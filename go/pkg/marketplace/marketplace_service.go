package marketplace

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/internal/airtable_fetcher"
	"github.com/TERITORI/teritori-dapp/go/internal/ethereum"
	"github.com/TERITORI/teritori-dapp/go/internal/faking"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/internal/ipfsutil"
	"github.com/TERITORI/teritori-dapp/go/pkg/holagql"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/bxcodec/faker/v3"
	"github.com/pkg/errors"
	"github.com/volatiletech/sqlboiler/v4/queries"
	"github.com/volatiletech/sqlboiler/v4/types"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type MarkteplaceService struct {
	marketplacepb.UnimplementedMarketplaceServiceServer

	homeProvider     *airtable_fetcher.Cache
	ethereumProvider *ethereum.Provider
	// collectionsByVolumeProvider         collections.CollectionsProvider
	// collectionsByMarketCapProvider      collections.CollectionsProvider
	conf *Config
}

type Config struct {
	Logger             *zap.Logger
	IndexerDB          *gorm.DB
	GraphqlEndpoint    string
	TheGraphEndpoint   string
	TNSContractAddress string
	TNSDefaultImageURL string
	Whitelist          []string
	AirtableAPIKey     string
}

func NewMarketplaceService(ctx context.Context, conf *Config) marketplacepb.MarketplaceServiceServer {
	var homeProvider *airtable_fetcher.Cache
	if conf.AirtableAPIKey != "" {
		homeProvider = airtable_fetcher.NewCache(ctx, airtable_fetcher.NewClient(conf.AirtableAPIKey), conf.Logger.Named("airtable_fetcher"))
	}

	// FIXME: validate config
	return &MarkteplaceService{
		conf:             conf,
		homeProvider:     homeProvider,
		ethereumProvider: ethereum.NewEthereumProvider(conf.TheGraphEndpoint),
		// collectionsByVolumeProvider:         collections.NewCollectionsByVolumeProvider(ctx, conf.GraphqlEndpoint, conf.Logger),
		// collectionsByMarketCapProvider:      collections.NewCollectionsByMarketCapProvider(ctx, conf.GraphqlEndpoint, conf.Logger),
	}
}

type DBCollectionWithExtra struct {
	Network             string
	ID                  string
	Name                string
	ImageURI            string
	Volume              string
	MintContractAddress string
	CreatorAddress      string
	SecondaryDuringMint bool
}

func (s *MarkteplaceService) Collections(req *marketplacepb.CollectionsRequest, srv marketplacepb.MarketplaceService_CollectionsServer) error {
	limit := req.GetLimit()
	if limit <= 0 {
		return errors.New("limit must be a positive number")
	}

	offset := req.GetOffset()
	if offset < 0 {
		return errors.New("offset must be greater or equal to 0")
	}

	if req.GetUpcoming() {
		if s.homeProvider == nil {
			return nil
		}
		launches := subSlice(s.homeProvider.GetUpcomingLaunches(), int(offset), int(offset+limit))
		for _, launch := range launches {
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: launch}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}
		return nil
	}

	switch req.GetNetworkId() {

	case "teritori", "teritori-testnet":
		var collections []DBCollectionWithExtra

		where := ""
		switch req.GetMintState() {
		case marketplacepb.MintState_MINT_STATE_RUNNING:
			where = "where c.paused = false and c.max_supply != -1 and (select count from count_by_collection where collection_id = c.id) != c.max_supply"
		case marketplacepb.MintState_MINT_STATE_ENDED:
			where = "where c.max_supply = -1 or (select count from count_by_collection where collection_id = c.id) = c.max_supply"
		}

		err := s.conf.IndexerDB.Raw(fmt.Sprintf(`
			WITH count_by_collection AS (
				SELECT count(1), collection_id FROM nfts GROUP BY nfts.collection_id
			),
			tori_collections AS (
				SELECT c.*, tc.mint_contract_address, tc.creator_address FROM collections AS c
				INNER JOIN teritori_collections tc ON tc.collection_id = c.id
				%s
				AND tc.mint_contract_address IN ?
			),
			nft_by_collection AS (
				SELECT  tc.id,n.id  nft_id  FROM tori_collections AS tc
				INNER JOIN nfts AS n ON tc.id = n.collection_id
			),
			activities_on_period AS (
				SELECT * FROM activities a2 WHERE a2."time" > ?
			),
			trades_on_period AS (
				SELECT * FROM trades t2 INNER JOIN activities_on_period aop
				ON aop.id = t2.activity_id
			),
			trades_by_collection AS (
				SELECT SUM(t.usd_price) volume, nbc.id FROM trades_on_period AS t
				INNER JOIN nft_by_collection nbc ON nbc.nft_id = t.nft_id
				GROUP BY nbc.id
			)
			SELECT tc.*, COALESCE((SELECT tbc.volume FROM trades_by_collection tbc WHERE tbc.id = tc.id), 0) volume 
				FROM tori_collections tc
			ORDER BY volume DESC, id ASC
			LIMIT ?
			OFFSET ?
		`, where),
			s.conf.Whitelist,
			time.Now().AddDate(0, 0, -30),
			limit,
			offset,
		).Scan(&collections).Error
		if err != nil {
			return errors.Wrap(err, "failed to query database")
		}

		for _, c := range collections {
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: &marketplacepb.Collection{
				Id:                  c.ID,
				CollectionName:      c.Name,
				Verified:            true,
				ImageUri:            ipfsutil.IPFSURIToURL(c.ImageURI),
				MintAddress:         c.MintContractAddress,
				NetworkId:           req.GetNetworkId(),
				Volume:              c.Volume,
				CreatorId:           string(indexerdb.TeritoriUserID(c.CreatorAddress)),
				SecondaryDuringMint: c.SecondaryDuringMint,
			}}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}

		return nil

	case "fake":
		for i := int32(0); i < limit; i++ {
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: faking.FakeCollection()}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}
		return nil

	case "ethereum", "ethereum-goerli":
		collections, err := s.ethereumProvider.GetCollections(srv.Context(), req.GetNetworkId())
		if err != nil {
			return errors.Wrap(err, "failed to query database")
		}
		for i := range collections {
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: &collections[i]}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}
		return nil
	}

	return fmt.Errorf("unknown collection network %s", req.GetNetworkId())
}

type NFTOwnerInfo struct {
	Name     string
	ImageURL string
}

func (s *MarkteplaceService) NFTs(req *marketplacepb.NFTsRequest, srv marketplacepb.MarketplaceService_NFTsServer) error {
	// NOTE: we should probably query the graphql api from the client directly in this case

	limit := req.GetLimit()
	if limit <= 0 {
		return errors.New("limit must be a positive number")
	}

	offset := req.GetOffset()
	if offset < 0 {
		return errors.New("offset must be greater or equal to 0")
	}

	sort := req.GetSort()
	if sort == marketplacepb.Sort_SORTING_UNSPECIFIED {
		sort = marketplacepb.Sort_SORTING_PRICE
	}

	sortDirection := req.GetSortDirection()
	if sortDirection == marketplacepb.SortDirection_SORT_DIRECTION_UNSPECIFIED {
		sortDirection = marketplacepb.SortDirection_SORT_DIRECTION_ASCENDING
	}
	networkID := req.GetNetworkId()
	collection_id := req.GetCollectionId()
	ownerId := req.GetOwnerId()

	// FIXME: return fake data if any filter is fake
	if strings.HasPrefix(collection_id, "fake") {
		for i := int32(0); i < limit; i++ {
			if err := srv.Send(&marketplacepb.NFTsResponse{Nft: faking.FakeNFT()}); err != nil {
				return errors.Wrap(err, "failed to send nft")
			}
		}
		return nil
	}

	if networkID == "ethereum" || networkID == "ethereum-goerli" {
		nfts, err := s.ethereumProvider.GetNFTs(srv.Context(), networkID, collection_id, ownerId, int(limit), int(offset), sortDirection)
		if err != nil {
			return errors.Wrap(err, "failed to fetch collection nfts")
		}
		for _, nft := range nfts {
			if err := srv.Send(&marketplacepb.NFTsResponse{Nft: nft}); err != nil {
				return errors.Wrap(err, "failed to send nft")
			}
		}
		return nil
	}
	// FIXME: support other filters on solana
	if strings.HasPrefix(collection_id, "sol") {
		gqlClient := graphql.NewClient(s.conf.GraphqlEndpoint, nil)

		collectionNFTs, err := holagql.GetCollectionNFTs(srv.Context(), gqlClient,
			strings.TrimPrefix(collection_id, "sol-"),
			int(limit),
			int(offset),
		)
		if err != nil {
			return errors.Wrap(err, "failed to fetch collection nfts")
		}

		for _, nft := range collectionNFTs.GetNfts() {
			price := ""
			if len(nft.GetListings()) != 0 {
				price = nft.GetListings()[0].GetPrice()
			}
			if err := srv.Send(&marketplacepb.NFTsResponse{Nft: &marketplacepb.NFT{
				Name:        nft.GetName(),
				MintAddress: nft.GetMintAddress(),
				ImageUri:    nft.GetImage(),
				Price:       price,
				Denom:       "lamports",
			}}); err != nil {
				return errors.Wrap(err, "failed to send nft")
			}
		}
		return nil
	}

	// teritori

	query := s.conf.IndexerDB.
		Preload("TeritoriNFT").
		Preload("Collection").
		Preload("Collection.TeritoriCollection").
		Where("burnt = ?", false).
		Offset(int(offset)).
		Limit(int(limit)).
		Order("is_listed DESC")

	if sortDirection == marketplacepb.SortDirection_SORT_DIRECTION_ASCENDING {
		query = query.Order("price_amount ASC")
	} else {
		query = query.Order("price_amount DESC")
	}

	query = query.Order("id ASC")

	if collection_id != "" {
		query = query.Where("collection_id = ?", collection_id)
	}

	if ownerId != "" {
		query = query.Where("owner_id = ?", ownerId)
	}

	var nfts []*indexerdb.NFT
	if err := query. // FIXME: this doesn't support mixed denoms
				Find(&nfts, &indexerdb.NFT{CollectionID: collection_id}).
				Error; err != nil {
		return errors.Wrap(err, "failed to fetch collection nfts")
	}

	tnsId := indexerdb.TeritoriCollectionID(s.conf.TNSContractAddress)

	for _, nft := range nfts {
		if nft.Collection == nil {
			return errors.New("no collection on nft")
		}

		imageURI := nft.ImageURI
		textInsert := ""

		// tns-specific
		if nft.CollectionID == tnsId {
			textInsert = nft.Name
			if imageURI == "" {
				imageURI = s.conf.TNSDefaultImageURL
			}
		}

		// map => json string
		jsonStr, err := json.Marshal(nft.Attributes)
		if err != nil {
			return errors.Wrap(err, "failed to convert nft attributes => json string")
		}

		// json string => struct
		var attributes []*marketplacepb.Attribute
		if err := json.Unmarshal(jsonStr, &attributes); err != nil {
			return errors.Wrap(err, "failed to convert nft json string => struct")
		}

		if err := srv.Send(&marketplacepb.NFTsResponse{Nft: &marketplacepb.NFT{
			Id:                 nft.ID,
			Name:               nft.Name,
			CollectionName:     nft.Collection.Name,
			NetworkId:          nft.Collection.NetworkId,
			ImageUri:           ipfsutil.IPFSURIToURL(imageURI),
			IsListed:           nft.IsListed,
			Price:              nft.PriceAmount,
			Denom:              nft.PriceDenom,
			TextInsert:         textInsert,
			OwnerId:            string(nft.OwnerID),
			Attributes:         attributes,
			NftContractAddress: nft.Collection.TeritoriCollection.NFTContractAddress,
			LockedOn:           nft.LockedOn,
		}}); err != nil {
			return errors.Wrap(err, "failed to send nft")
		}
	}

	return nil
}

func (s *MarkteplaceService) Activity(req *marketplacepb.ActivityRequest, srv marketplacepb.MarketplaceService_ActivityServer) error {
	// TODO: we should use a time cursor based pagination instead of limit and offset

	limit := req.GetLimit()
	if limit <= 0 {
		return errors.New("limit must be a positive number")
	}

	offset := req.GetOffset()
	if offset < 0 {
		return errors.New("offset must be greater or equal to 0")
	}

	collectionID := req.GetCollectionId()
	if collectionID != "" {
		//Check for collection Type
		if strings.HasPrefix(collectionID, "fake") {
			for i := int32(0); i < limit; i++ {
				if err := srv.Send(&marketplacepb.ActivityResponse{Activity: faking.FakeActivity()}); err != nil {
					return errors.Wrap(err, "failed to send activity")
				}
			}
			return nil
		}

		if strings.HasPrefix(collectionID, "sol") {
			gqlClient := graphql.NewClient(s.conf.GraphqlEndpoint, nil)

			collectionActivity, err := holagql.GetCollectionActivity(srv.Context(), gqlClient,
				strings.TrimPrefix(collectionID, "sol-"),
				int(limit),
				int(offset),
			)
			if err != nil {
				return errors.Wrap(err, "failed to fetch collection activity")
			}

			for _, activity := range collectionActivity.Collection.Activities {
				if err := srv.Send(&marketplacepb.ActivityResponse{Activity: &marketplacepb.Activity{
					Id:              fmt.Sprintf("%s-%s", "sol", faker.UUIDDigit()),
					Amount:          activity.Price,
					Denom:           "lamports",
					TransactionKind: activity.ActivityType,
					TargetName:      activity.Nft.Name,
					TargetImageUri:  activity.Nft.Image,
					Time:            activity.CreatedAt,
				}}); err != nil {
					return errors.Wrap(err, "failed to send activity")
				}
			}

			return nil
		}
	}
	networkID := req.GetNetworkId()
	nftID := req.GetNftId()
	if networkID == "ethereum" || networkID == "ethereum-goerli" {
		activities, total, err := s.ethereumProvider.GetActivities(srv.Context(), collectionID, nftID, int(limit), int(offset))
		if err != nil {
			return errors.Wrap(err, "failed to fetch collection activity")
		}
		if err := srv.Send(&marketplacepb.ActivityResponse{Total: int64(total)}); err != nil {
			return errors.Wrap(err, "failed to send total count")
		}
		for _, activity := range activities {
			if err := srv.Send(&marketplacepb.ActivityResponse{Activity: activity}); err != nil {
				return errors.Wrap(err, "failed to send activity")
			}
		}
		return nil
	}

	var totalCount int64
	if err := s.conf.IndexerDB.
		Model(&indexerdb.Activity{}).
		Joins("JOIN nfts on nfts.id = activities.nft_id").
		Where("nfts.collection_id = ? OR ? = ''", collectionID, collectionID).
		Where("nfts.id = ? OR ? = ''", nftID, nftID).
		Count(&totalCount).Error; err != nil {
		return errors.Wrap(err, "failed to retrieve activities from db")
	}

	if err := srv.Send(&marketplacepb.ActivityResponse{Total: totalCount}); err != nil {
		return errors.Wrap(err, "failed to send total count")
	}

	var activities []*indexerdb.Activity
	if err := s.conf.IndexerDB.
		Preload("CancelListing").
		Preload("UpdateNFTPrice").
		Preload("TransferNFT").
		Preload("SendNFT").
		Preload("Burn").
		Preload("Mint").
		Preload("Listing").
		Preload("Trade").
		Preload("NFT").
		Joins("JOIN nfts on nfts.id = activities.nft_id").
		Order("Time DESC").
		Limit(int(limit)).
		Offset(int(offset)).
		Where("nfts.collection_id = ? OR ? = ''", collectionID, collectionID).
		Where("nfts.id = ? OR ? = ''", nftID, nftID).
		Find(&activities).Error; err != nil {
		return errors.Wrap(err, "failed to retrieve activities from db")
	}
	for _, activity := range activities {
		if activity.NFT == nil {
			s.conf.Logger.Error("missing NFT on activity")
			continue
		}
		var price, denom, buyerId, sellerId string
		var usdPrice float64
		switch activity.Kind {
		case indexerdb.ActivityKindTrade:
			if activity.Trade != nil {
				price = activity.Trade.Price
				denom = activity.Trade.PriceDenom
				buyerId = string(activity.Trade.BuyerID)
				sellerId = string(activity.Trade.SellerID)
				usdPrice = activity.Trade.USDPrice
			}
		case indexerdb.ActivityKindList:
			if activity.Listing != nil {
				price = activity.Listing.Price
				denom = activity.Listing.PriceDenom
				usdPrice = activity.Listing.USDPrice // beware this will not be the real time price, consider using spot price here
				sellerId = string(activity.Listing.SellerID)
			}
		case indexerdb.ActivityKindMint:
			if activity.Mint != nil {
				buyerId = string(activity.Mint.BuyerID)
			}
		case indexerdb.ActivityKindBurn:
			if activity.Burn != nil {
				sellerId = string(activity.Burn.BurnerID)
			}
		case indexerdb.ActivityKindTransferNFT:
			if activity.TransferNFT != nil {
				sellerId = string(activity.TransferNFT.Sender)
				buyerId = string(activity.TransferNFT.Receiver)
			}
		case indexerdb.ActivityKindSendNFT:
			if activity.SendNFT != nil {
				sellerId = string(activity.SendNFT.Sender)
				buyerId = string(activity.SendNFT.Receiver)
			}
		case indexerdb.ActivityKindCancelListing:
			if activity.CancelListing != nil {
				sellerId = string(activity.CancelListing.SellerID)
			}
		case indexerdb.ActivityKindUpdateNFTPrice:
			if activity.UpdateNFTPrice != nil {
				sellerId = string(activity.UpdateNFTPrice.SellerID)
				price = activity.UpdateNFTPrice.Price
				denom = activity.UpdateNFTPrice.PriceDenom
				usdPrice = activity.UpdateNFTPrice.USDPrice
			}
		}
		if err := srv.Send(&marketplacepb.ActivityResponse{Activity: &marketplacepb.Activity{
			Id:              activity.ID,
			TransactionKind: string(activity.Kind),
			TargetName:      activity.NFT.Name,
			TargetImageUri:  activity.NFT.ImageURI,
			ContractName:    "ToriVault",
			Time:            activity.Time.Format(time.RFC3339),
			Amount:          price,
			Denom:           denom,
			UsdPrice:        usdPrice,
			BuyerId:         buyerId,
			SellerId:        sellerId,
		}}); err != nil {
			return errors.Wrap(err, "failed to send activity")
		}
	}

	return nil
}

func (s *MarkteplaceService) NFTPriceHistory(ctx context.Context, req *marketplacepb.NFTPriceHistoryRequest) (*marketplacepb.NFTPriceHistoryResponse, error) {
	id := req.GetId()
	if id == "" {
		return nil, errors.New("empty id")
	}
	networkID := req.GetNetworkId()
	var data []*marketplacepb.PriceDatum
	var err error
	if networkID == "ethereum" || networkID == "ethereum-goerli" {
		data, err = s.ethereumProvider.GetNFTPriceHistory(ctx, id)
		if err != nil {
			return nil, errors.Wrap(err, "failed get price history")
		}
		return &marketplacepb.NFTPriceHistoryResponse{Data: data}, nil
	}

	// TODO: data decimation in case we have a lot of samples for the period

	if err := s.conf.IndexerDB.
		WithContext(ctx).
		Model(&indexerdb.Trade{}).
		Select("trades.usd_price as price, activities.time as time").
		Joins("JOIN activities ON trades.activity_id = activities.id").
		Where("activities.time > ?", time.Now().AddDate(0, 0, -7)).
		Where("activities.nft_id = ?", id).
		Order("activities.time ASC").
		Scan(&data).Error; err != nil {
		return nil, errors.Wrap(err, "failed to retrieve data from db")
	}

	return &marketplacepb.NFTPriceHistoryResponse{Data: data}, nil
}

type QuestWithCompletion struct {
	ID        string
	Title     string
	Completed bool
}

func (s *MarkteplaceService) Quests(req *marketplacepb.QuestsRequest, srv marketplacepb.MarketplaceService_QuestsServer) error {
	var quests []QuestWithCompletion
	if err := s.conf.IndexerDB.
		WithContext(srv.Context()).
		Model(&indexerdb.Quest{}).
		Select("quests.id as id, quests.title as title, quest_completions.completed as completed").
		Joins("LEFT JOIN quest_completions ON quests.id = quest_completions.quest_id AND quest_completions.user_id = ?", req.GetUserId()).
		Limit(int(req.GetLimit())).
		Offset(int(req.GetOffset())).
		Scan(&quests).Error; err != nil {
		return errors.Wrap(err, "failed to query quests")
	}
	for _, q := range quests {
		if err := srv.Send(&marketplacepb.QuestsResponse{Quest: &marketplacepb.Quest{
			Id:        q.ID,
			Title:     q.Title,
			Completed: q.Completed,
		}}); err != nil {
			return errors.Wrap(err, "failed to send quest")
		}
	}
	return nil
}

type CollectionStats struct {
	marketplacepb.CollectionStats `boil:",bind"`
	LowerPrice                    types.JSON
}
type coin struct {
	Denom  string `json:"denom"`
	Amount int64  `json:"amount"`
}

func (s *MarkteplaceService) CollectionStats(ctx context.Context, req *marketplacepb.CollectionStatsRequest) (*marketplacepb.CollectionStatsResponse, error) {
	collectionID := req.GetCollectionId()
	if collectionID == "" {
		return nil, errors.New("empty collectionID")
	}
	ownerID := req.GetOwnerId()

	networkID := req.GetNetworkId()
	if networkID == "ethereum" || networkID == "ethereum-goerli" {
		stats, err := s.ethereumProvider.GetCollectionStats(ctx, collectionID, ownerID)
		if err != nil {
			return nil, errors.Wrap(err, "failed fetch ethereum collection stats")
		}
		return &marketplacepb.CollectionStatsResponse{
			Stats: stats,
		}, nil
	}

	db, err := s.conf.IndexerDB.DB()
	if err != nil {
		return nil, errors.Wrap(err, "failed get DB instance")
	}

	var stats CollectionStats
	err = queries.Raw(`with 
	nfts_in_collection as (
		SELECT  *  FROM nfts n where n.collection_id = $1
	),
	listed_nfts as (
		SELECT  * from nfts_in_collection nic where is_listed = true
	),
	min_price_by_denom as (
		select min(price_amount) price_amount, price_denom from listed_nfts ln2 group by ln2.price_denom 
	),
	trades_in_collection as (
		select COALESCE(sum(t.usd_price),0) total_volume FROM trades AS t
		INNER join activities AS a on a.id = t.activity_id 
		INNER join nfts_in_collection nic on nic.id = a.nft_id
	)
	select 
		to_json(array( select json_build_object('amount',price_amount,'denom',ln2.price_denom) from min_price_by_denom ln2)) lower_price, 
		(select total_volume from trades_in_collection),
		(select count(distinct owner_id)  from nfts_in_collection) owners,
		(select count(1) from listed_nfts) listed,
		count(1) total_supply,
		(select count(1) from nfts_in_collection where owner_id = $2) owned
	from nfts_in_collection`, collectionID, ownerID).Bind(ctx, db, &stats)
	if err != nil {
		return nil, errors.Wrap(err, "failed to make query")
	}
	var coins []coin
	err = stats.LowerPrice.Unmarshal(&coins)
	if err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal floor_price struct")
	}
	stats.FloorPrice = make([]*marketplacepb.Amount, len(coins))
	for index, coin := range coins {
		stats.FloorPrice[index] = &marketplacepb.Amount{Denom: coin.Denom, Quantity: fmt.Sprint(coin.Amount)}
	}
	return &marketplacepb.CollectionStatsResponse{
		Stats: &stats.CollectionStats,
	}, nil
}

func (s *MarkteplaceService) Banners(ctx context.Context, req *marketplacepb.BannersRequest) (*marketplacepb.BannersResponse, error) {
	if s.homeProvider == nil {
		return &marketplacepb.BannersResponse{}, nil
	}
	if req.GetTestnet() {
		return &marketplacepb.BannersResponse{Banners: s.homeProvider.GetTestnetBanners()}, nil
	}
	return &marketplacepb.BannersResponse{Banners: s.homeProvider.GetBanners()}, nil
}

func (s *MarkteplaceService) News(ctx context.Context, req *marketplacepb.NewsRequest) (*marketplacepb.NewsResponse, error) {
	if s.homeProvider == nil {
		return &marketplacepb.NewsResponse{}, nil
	}
	if req.GetTestnet() {
		return &marketplacepb.NewsResponse{News: s.homeProvider.GetTestnetNews()}, nil
	}
	return &marketplacepb.NewsResponse{News: s.homeProvider.GetNews()}, nil
}

package marketplace

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/internal/collections"
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

	upcomingLaunchesProvider            collections.CollectionsProvider
	collectionsByVolumeProvider         collections.CollectionsProvider
	collectionsByMarketCapProvider      collections.CollectionsProvider
	teritoriFeaturesCollectionsProvider collections.CollectionsProvider
	conf                                *Config
}

type Config struct {
	Logger             *zap.Logger
	IndexerDB          *gorm.DB
	GraphqlEndpoint    string
	TNSContractAddress string
	TNSDefaultImageURL string
}

func NewMarketplaceService(ctx context.Context, conf *Config) marketplacepb.MarketplaceServiceServer {
	// FIXME: validate config
	return &MarkteplaceService{
		conf:                                conf,
		upcomingLaunchesProvider:            collections.NewUpcomingLaunchesProvider(ctx, conf.Logger),
		collectionsByVolumeProvider:         collections.NewCollectionsByVolumeProvider(ctx, conf.GraphqlEndpoint, conf.Logger),
		collectionsByMarketCapProvider:      collections.NewCollectionsByMarketCapProvider(ctx, conf.GraphqlEndpoint, conf.Logger),
		teritoriFeaturesCollectionsProvider: collections.NewTeritoriCollectionsProvider(conf.IndexerDB, conf.Logger),
	}
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

	switch req.GetKind() {

	case marketplacepb.CollectionsRequest_KIND_UPCOMING:
		launches := s.upcomingLaunchesProvider.Collections(int(limit), int(offset))
		for launch := range launches {
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: launch}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}
		return nil

	case marketplacepb.CollectionsRequest_KIND_BY_VOLUME:
		collections := s.collectionsByVolumeProvider.Collections(int(limit), int(offset))
		for collection := range collections {
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: collection}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}
		return nil

	case marketplacepb.CollectionsRequest_KIND_BY_MARKETCAP:
		collections := s.collectionsByMarketCapProvider.Collections(int(limit), int(offset))
		for collection := range collections {
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: collection}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}
		return nil

	case marketplacepb.CollectionsRequest_KIND_TERITORI_FEATURES:
		s.conf.Logger.Info("fetch teritori features collections")
		collections := s.teritoriFeaturesCollectionsProvider.Collections(int(limit), int(offset))
		for collection := range collections {
			s.conf.Logger.Info("fetched teritori collection", zap.Any("collection", collection))
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: collection}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}
		return nil

	case marketplacepb.CollectionsRequest_KIND_FAKE:
		for i := int32(0); i < limit; i++ {
			if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: faking.FakeCollection()}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}
		return nil

	}

	return fmt.Errorf("unknown collection list kind %s", req.GetKind().String())
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

	collection_id := req.GetCollectionId()

	// FIXME: return fake data if any filter is fake
	if strings.HasPrefix(collection_id, marketplacepb.Network_NETWORK_FAKE.Prefix()) {
		for i := int32(0); i < limit; i++ {
			if err := srv.Send(&marketplacepb.NFTsResponse{Nft: faking.FakeNFT()}); err != nil {
				return errors.Wrap(err, "failed to send nft")
			}
		}
		return nil
	}

	// FIXME: support other filters on solana
	if strings.HasPrefix(collection_id, marketplacepb.Network_NETWORK_SOLANA.Prefix()) {
		gqlClient := graphql.NewClient(s.conf.GraphqlEndpoint, nil)

		collectionNFTs, err := holagql.GetCollectionNFTs(srv.Context(), gqlClient,
			strings.TrimPrefix(collection_id, marketplacepb.Network_NETWORK_SOLANA.Prefix()+"-"),
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
		Offset(int(offset)).
		Limit(int(limit)).
		Order("is_listed DESC").
		Order("price_amount ASC")

	if collection_id != "" {
		query = query.Where("collection_id = ?", collection_id)
	}

	ownerId := req.GetOwnerId()
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

		if err := srv.Send(&marketplacepb.NFTsResponse{Nft: &marketplacepb.NFT{
			Id:             nft.ID,
			Name:           nft.Name,
			CollectionName: nft.Collection.Name,
			Network:        nft.Collection.Network,
			ImageUri:       ipfsutil.IPFSURIToURL(imageURI),
			IsListed:       nft.IsListed,
			Price:          nft.PriceAmount.String,
			Denom:          nft.PriceDenom,
			TextInsert:     textInsert,
			OwnerId:        string(nft.OwnerID),
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
		if strings.HasPrefix(collectionID, marketplacepb.Network_NETWORK_FAKE.Prefix()) {
			for i := int32(0); i < limit; i++ {
				if err := srv.Send(&marketplacepb.ActivityResponse{Activity: faking.FakeActivity()}); err != nil {
					return errors.Wrap(err, "failed to send activity")
				}
			}
			return nil
		}

		if strings.HasPrefix(collectionID, marketplacepb.Network_NETWORK_SOLANA.Prefix()) {
			gqlClient := graphql.NewClient(s.conf.GraphqlEndpoint, nil)

			collectionActivity, err := holagql.GetCollectionActivity(srv.Context(), gqlClient,
				strings.TrimPrefix(collectionID, marketplacepb.Network_NETWORK_SOLANA.Prefix()+"-"),
				int(limit),
				int(offset),
			)
			if err != nil {
				return errors.Wrap(err, "failed to fetch collection activity")
			}

			for _, activity := range collectionActivity.Collection.Activities {
				if err := srv.Send(&marketplacepb.ActivityResponse{Activity: &marketplacepb.Activity{
					Id:              fmt.Sprintf("%s-%s", marketplacepb.Network_NETWORK_SOLANA.Prefix(), faker.UUIDDigit()),
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

	nftID := req.GetNftId()

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

	var data []*marketplacepb.PriceDatum

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
		stats.FloorPrice[index] = &marketplacepb.Amount{Denom: coin.Denom, Quantity: coin.Amount}
	}
	return &marketplacepb.CollectionStatsResponse{
		Stats: &stats.CollectionStats,
	}, nil
}

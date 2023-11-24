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
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/holagql"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/bxcodec/faker/v3"
	"github.com/pkg/errors"
	"github.com/volatiletech/sqlboiler/v4/queries"
	"github.com/volatiletech/sqlboiler/v4/types"
	"go.uber.org/zap"
	"golang.org/x/exp/constraints"
	"gorm.io/gorm"
)

type MarkteplaceService struct {
	marketplacepb.UnimplementedMarketplaceServiceServer

	homeProvider      *airtable_fetcher.Cache
	dAppStoreProvider *airtable_fetcher.Cache
	ethereumProvider  *ethereum.Provider
	// collectionsByVolumeProvider         collections.CollectionsProvider
	// collectionsByMarketCapProvider      collections.CollectionsProvider
	conf *Config
}

type Config struct {
	Logger                   *zap.Logger
	IndexerDB                *gorm.DB
	Whitelist                []string
	AirtableAPIKey           string
	AirtableAPIKeydappsStore string
	NetworkStore             networks.NetworkStore
}

func NewMarketplaceService(ctx context.Context, conf *Config) (marketplacepb.MarketplaceServiceServer, error) {
	var homeProvider *airtable_fetcher.Cache
	var dAppStoreProvider *airtable_fetcher.Cache
	if conf.AirtableAPIKey != "" {
		homeProvider = airtable_fetcher.NewCache(ctx, airtable_fetcher.NewClient(conf.AirtableAPIKey), conf.Logger.Named("airtable_fetcher"))
	}
	if conf.AirtableAPIKeydappsStore != "" {
		dAppStoreProvider = airtable_fetcher.NewCache(ctx, airtable_fetcher.NewClient(conf.AirtableAPIKeydappsStore), conf.Logger.Named("airtable_fetcher"))
	}

	ethProvider, err := ethereum.NewEthereumProvider(conf.NetworkStore)
	if err != nil {
		return nil, errors.Wrap(err, "failed to create ethereum provider")
	}

	// FIXME: validate config
	return &MarkteplaceService{
		conf:              conf,
		homeProvider:      homeProvider,
		dAppStoreProvider: dAppStoreProvider,
		ethereumProvider:  ethProvider,
		// collectionsByVolumeProvider:         collections.NewCollectionsByVolumeProvider(ctx, conf.GraphqlEndpoint, conf.Logger),
		// collectionsByMarketCapProvider:      collections.NewCollectionsByMarketCapProvider(ctx, conf.GraphqlEndpoint, conf.Logger),
	}, nil
}

type DBCollectionWithExtra struct {
	Network             string
	ID                  string
	Name                string
	ImageURI            string
	Volume              string
	TotalVolume         float32
	FloorPrice          uint64
	MintPrice           string
	NumTrades           int64
	NumOwners           int32
	Denom               string
	MintContractAddress string
	CreatorAddress      string
	Price               string
	MaxSupply           int64
	SecondaryDuringMint bool
	VolumeCompare       float32
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

	networkID := req.GetNetworkId()
	if networkID == "" {
		return errors.New("missing network id")
	}

	network, err := s.conf.NetworkStore.GetNetwork(networkID)
	if err != nil {
		return errors.Wrap(err, fmt.Sprintf("unknown network id '%s'", networkID))
	}

	switch network := network.(type) {

	case *networks.CosmosNetwork:
		var collections []DBCollectionWithExtra

		where := ""
		switch req.GetMintState() {
		case marketplacepb.MintState_MINT_STATE_RUNNING:
			where = "where c.paused = false and c.max_supply != -1 and (select count from count_by_collection where collection_id = c.id) != c.max_supply"
		case marketplacepb.MintState_MINT_STATE_ENDED:
			where = "where (select count from count_by_collection where collection_id = c.id) = c.max_supply"
		}
		orderDirection := ""
		switch req.GetSortDirection() {
		case marketplacepb.SortDirection_SORT_DIRECTION_UNSPECIFIED:
			orderDirection = ""
		case marketplacepb.SortDirection_SORT_DIRECTION_ASCENDING:
			orderDirection = " ASC "
		case marketplacepb.SortDirection_SORT_DIRECTION_DESCENDING:
			orderDirection = " DESC "
		}
		orderSQL := ""
		switch req.GetSort() {
		case marketplacepb.Sort_SORT_PRICE:
			where = where + "AND tc.denom = utori" // not mixed denoms allowed !
			orderSQL = "tc.price" + orderDirection
		case marketplacepb.Sort_SORT_VOLUME:
			orderSQL = "case when total_volume is null then 1 else 0 end, total_volume " + orderDirection
		case marketplacepb.Sort_SORT_CREATED_AT:
			orderSQL = "tc.time " + orderDirection
		case marketplacepb.Sort_SORT_VOLUME_USD:
			orderSQL = "case when total_volume_usd is null then 1 else 0 end, total_volume_usd " + orderDirection
		case marketplacepb.Sort_SORT_UNSPECIFIED:
			orderSQL = "volume DESC"
		}

		err := s.conf.IndexerDB.Raw(fmt.Sprintf(`
			WITH count_by_collection AS (
				SELECT count(1), collection_id FROM nfts GROUP BY nfts.collection_id
			),
			tori_collections AS (
				SELECT c.*, tc.* FROM collections AS c
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
     activities_on_period_comparision AS (
         SELECT * FROM activities a2 WHERE a2."time" < ? and a2."time" > ?
     ),
     trades_on_period_comparision AS (
         SELECT * FROM trades t2 INNER JOIN activities_on_period_comparision aop
                                            ON aop.id = t2.activity_id
     ),
     trades_by_collection_historic AS (
         select COALESCE(sum(cast(t.price as float8)),0) as total_volume, COALESCE(sum(t.usd_price),0) as total_volume_usd, c.id, count(*) num_trades
         FROM trades t join activities a on a.id = t.activity_id
                       join teritori_collections tc on split_part(a.nft_id,'-',2)=tc.mint_contract_address
                       join collections c on c.id = tc.collection_id
         group by c.id),
     current_num_owners AS (
         select count (DISTINCT owner_id) num_owners, collection_id, min(price_amount) floor_price
         from nfts
         group by collection_id),
			trades_by_collection AS (
				SELECT SUM(cast(t.price as float8)) volume, nbc.id FROM trades_on_period AS t
				INNER JOIN nft_by_collection nbc ON nbc.nft_id = t.nft_id
				GROUP BY nbc.id
      ),
     trades_by_collection_comparision AS (
         SELECT SUM(cast(t.price as float8)) volume, nbc.id 
         FROM trades_on_period_comparision AS t
         INNER JOIN nft_by_collection nbc ON nbc.nft_id = t.nft_id
         GROUP BY nbc.id
     )
      SELECT tc.*, COALESCE((SELECT tbc.volume FROM trades_by_collection tbc WHERE tbc.id = tc.id), 0) volume,
         total_volume, floor_price, num_trades, num_owners, 
       COALESCE((SELECT tcc.volume FROM trades_by_collection_comparision tcc WHERE tcc.id = tc.id), 0) volume_compare
      FROM tori_collections tc
      left join trades_by_collection_historic tch on tc.id = tch.id
      left join current_num_owners on tc.collection_id = current_num_owners.collection_id
			ORDER BY %s
			LIMIT ?
			OFFSET ?
		`, where, orderSQL), // order By here or it won't work
			s.conf.Whitelist,
			time.Now().AddDate(0, 0, -30),
			time.Now().AddDate(0, 0, -30),
			time.Now().AddDate(0, 0, -60),
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
				ImageUri:            c.ImageURI,
				MintAddress:         c.MintContractAddress,
				NetworkId:           req.GetNetworkId(),
				Volume:              c.Volume,
				VolumeDenom:         c.Denom,
				VolumeCompare:       c.VolumeCompare,
				CreatorId:           string(network.UserID(c.CreatorAddress)),
				SecondaryDuringMint: c.SecondaryDuringMint,
				MintPrice:           c.Price,
				Denom:               c.Denom,
				FloorPrice:          c.FloorPrice,
				TotalVolume:         c.TotalVolume,
				NumTrades:           c.NumTrades,
				NumOwners:           c.NumOwners,
				MaxSupply:           c.MaxSupply,
			}}); err != nil {
				return errors.Wrap(err, "failed to send collection")
			}
		}

		return nil

	case *networks.EthereumNetwork:
		collections, err := s.ethereumProvider.GetCollections(srv.Context(), networkID, req)
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

	return fmt.Errorf("unsupported network kind '%s'", network.GetBase().Kind)
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
	if sort == marketplacepb.Sort_SORT_UNSPECIFIED {
		sort = marketplacepb.Sort_SORT_PRICE
	}

	sortDirection := req.GetSortDirection()
	if sortDirection == marketplacepb.SortDirection_SORT_DIRECTION_UNSPECIFIED {
		sortDirection = marketplacepb.SortDirection_SORT_DIRECTION_ASCENDING
	}

	collectionID := req.GetCollectionId()
	ownerID := req.GetOwnerId()

	var err error
	var network networks.Network
	if ownerID != "" {
		if network, _, err = s.conf.NetworkStore.ParseUserID(ownerID); err != nil {
			return errors.Wrap(err, "failed to parse owner id")
		}
	} else if collectionID != "" {
		if network, _, err = s.conf.NetworkStore.ParseCollectionID(collectionID); err != nil {
			return errors.Wrap(err, "failed to parse collection id")
		}
	} else {
		return errors.New("missing filter")
	}

	/*
		if networkId == "fake" {
			for i := int32(0); i < limit; i++ {
				if err := srv.Send(&marketplacepb.NFTsResponse{Nft: faking.FakeNFT()}); err != nil {
					return errors.Wrap(err, "failed to send nft")
				}
			}
			return nil
		}
	*/

	switch network := network.(type) {

	case *networks.EthereumNetwork:
		nfts, err := s.ethereumProvider.GetNFTs(srv.Context(), collectionID, ownerID, int(limit), int(offset), sortDirection)
		if err != nil {
			return errors.Wrap(err, "failed to fetch collection nfts")
		}
		for _, nft := range nfts {
			if err := srv.Send(&marketplacepb.NFTsResponse{Nft: nft}); err != nil {
				return errors.Wrap(err, "failed to send nft")
			}
		}
		return nil

	case *networks.SolanaNetwork:
		if ownerID != "" {
			return errors.New("owner id filter not supported on solana")
		}

		_, collectionAddress, err := s.conf.NetworkStore.ParseCollectionID(collectionID)
		if err != nil {
			return errors.Wrap(err, "failed to parse collection id")
		}

		gqlClient := graphql.NewClient(network.HolaplexGraphqlEndpoint, nil)

		collectionNFTs, err := holagql.GetCollectionNFTs(srv.Context(), gqlClient,
			collectionAddress,
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

	case *networks.CosmosNetwork:
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

		if collectionID != "" {
			query = query.Where("collection_id = ?", collectionID)
		}

		if ownerID != "" {
			query = query.Where("owner_id = ?", ownerID)
		}

		if len(req.Attributes) > 0 {
			var attributeQueryParts []string
			var attributeQueryArgs []interface{}
			for _, attribute := range req.Attributes {
				attributeQueryParts = append(attributeQueryParts, "attributes @> ?::jsonb")
				jsonQuery, err := json.Marshal([]indexerdb.Attribute{{Value: attribute.GetValue(), TraitType: attribute.GetTraitType()}})
				if err != nil {
					return errors.Wrap(err, "failed to marshal attribute query")
				}
				attributeQueryArgs = append(attributeQueryArgs, string(jsonQuery))
			}
			query.Where(
				strings.Join(attributeQueryParts, " OR "), attributeQueryArgs...,
			)
		}

		if req.IsListed {
			query.Where("is_listed = ?", true) // Options are ALL or buy now
		}

		if req.PriceRange != nil {
			if req.PriceRange.Min != "0" && req.PriceRange.Min != "" {
				query.Where("price_amount >= ?", req.PriceRange.Min)
			}
			if req.PriceRange.Max != "0" && req.PriceRange.Max != "" {
				query.Where("price_amount <= ?", req.PriceRange.Max)
			}
		}

		var nfts []*indexerdb.NFT
		if err := query. // FIXME: this doesn't support mixed denoms
					Find(&nfts, &indexerdb.NFT{CollectionID: networks.CollectionID(collectionID)}).
					Error; err != nil {
			return errors.Wrap(err, "failed to fetch collection nfts")
		}

		tnsCollectionID := network.CollectionID(network.NameServiceContractAddress)

		for _, nft := range nfts {
			if nft.Collection == nil {
				return errors.New("no collection on nft")
			}

			imageURI := nft.ImageURI
			textInsert := ""

			// tns-specific
			if nft.CollectionID == tnsCollectionID {
				textInsert = nft.Name
				if imageURI == "" {
					imageURI = network.NameServiceDefaultImage
				}
			}

			// map => json string
			jsonStr, err := json.Marshal(nft.Attributes)
			if err != nil {
				return errors.Wrap(err, "failed to convert nft attributes => json string")
			}

			// json string => struct
			var dbAttributes []indexerdb.Attribute
			if err := json.Unmarshal(jsonStr, &dbAttributes); err != nil {
				return errors.Wrap(err, "failed to convert nft json string => struct")
			}

			// db -> pb
			var attributes []*marketplacepb.Attribute
			for _, attribute := range dbAttributes {
				attributes = append(attributes, &marketplacepb.Attribute{
					TraitType: attribute.TraitType,
					Value:     attribute.Value,
				})
			}

			if err := srv.Send(&marketplacepb.NFTsResponse{Nft: &marketplacepb.NFT{
				Id:                 string(nft.ID),
				Name:               nft.Name,
				CollectionName:     nft.Collection.Name,
				NetworkId:          nft.Collection.NetworkId,
				ImageUri:           imageURI,
				IsListed:           nft.IsListed,
				Price:              nft.PriceAmount.String,
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

	return fmt.Errorf("unsupported network kind '%s'", network.GetBase().Kind)
}

func (s *MarkteplaceService) NFTCollectionAttributes(req *marketplacepb.NFTCollectionAttributesRequest, srv marketplacepb.MarketplaceService_NFTCollectionAttributesServer) error {
	collectionID := req.GetCollectionId()
	queryArgs := []interface{}{collectionID}

	var attributeQueryParts []string
	for _, attribute := range req.WhereAttributes {
		attributeQueryParts = append(attributeQueryParts, "(trait_type = ? and value = ?)")
		queryArgs = append(queryArgs, attribute.GetTraitType(), attribute.GetValue())
	}
	attributesQuery := strings.Join(attributeQueryParts, " OR ")
	if attributesQuery != "" {
		attributesQuery = "where " + attributesQuery
	}

	var attributes []*marketplacepb.AttributeRarityFloor
	if err := s.conf.IndexerDB.Raw(fmt.Sprintf(
		`
WITH count_by_collection AS (
    SELECT count(1) as total, collection_id FROM nfts GROUP BY nfts.collection_id
),
    with_attributes as (
select trait_type, value, counta, floor, collection_id  from (
      select trait_type, value, count(*) as counta, min(price_amount) as floor, collection_id from (SELECT attr.trait_type as trait_type, attr.value, price_amount, collection_id FROM nfts t,
           jsonb_to_recordset(t.attributes) as attr(value varchar, trait_type varchar)
           where collection_id = ?
      ) as sorted
       %s
      group by trait_type, value, collection_id
      order by floor, counta, trait_type asc, LENGTH(value) desc, value desc
      ) as col
)
select *, (cast(counta as float) / total) * 100 as rare_ratio, total as collection_size
from with_attributes
join count_by_collection on with_attributes.collection_id = count_by_collection.collection_id
		`, attributesQuery), queryArgs...,
	).Scan(&attributes).Error; err != nil {
		return errors.Wrap(err, "failed to fetch collection attributes")
	}

	for _, attribute := range attributes {
		if err := srv.Send(&marketplacepb.NFTCollectionAttributesResponse{Attributes: attribute}); err != nil {
			return errors.Wrap(err, "failed to send attributes")
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

	var err error
	collectionID := req.GetCollectionId()
	nftID := req.GetNftId()

	// find network id
	var network networks.Network
	if collectionID != "" {
		if network, _, err = s.conf.NetworkStore.ParseCollectionID(collectionID); err != nil {
			return errors.Wrap(err, "failed to parse collection id")
		}
	} else if nftID != "" {
		if network, _, _, err = s.conf.NetworkStore.ParseNFTID(nftID); err != nil {
			return errors.Wrap(err, "failed to parse nft id")
		}
	} else {
		return errors.New("missing filter")
	}

	/*
		// return fake data if fake network
		if networkId == "fake" {
			for i := int32(0); i < limit; i++ {
				if err := srv.Send(&marketplacepb.ActivityResponse{Activity: faking.FakeActivity()}); err != nil {
					return errors.Wrap(err, "failed to send activity")
				}
			}
			return nil
		}
	*/

	switch network := network.(type) {

	case *networks.SolanaNetwork:
		if nftID != "" {
			return errors.New("nft id filter not supported on solana")
		}

		gqlClient := graphql.NewClient(network.HolaplexGraphqlEndpoint, nil)

		_, collectionAddress, err := s.conf.NetworkStore.ParseCollectionID(collectionID)
		if err != nil {
			return errors.Wrap(err, "failed to parse collection id")
		}

		collectionActivity, err := holagql.GetCollectionActivity(srv.Context(), gqlClient,
			collectionAddress,
			int(limit),
			int(offset),
		)
		if err != nil {
			return errors.Wrap(err, "failed to fetch collection activity")
		}

		for _, activity := range collectionActivity.Collection.Activities {
			if err := srv.Send(&marketplacepb.ActivityResponse{Activity: &marketplacepb.Activity{
				Id:              string(network.ActivityID(faker.UUIDDigit(), 0)),
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

	case *networks.EthereumNetwork:
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

	case *networks.CosmosNetwork:
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
				Id:              string(activity.ID),
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

	return fmt.Errorf("unsupported network kind '%s'", network.GetBase().Kind)
}

func (s *MarkteplaceService) NFTPriceHistory(ctx context.Context, req *marketplacepb.NFTPriceHistoryRequest) (*marketplacepb.NFTPriceHistoryResponse, error) {
	id := req.GetId()
	if id == "" {
		return nil, errors.New("empty id")
	}
	network, _, _, err := s.conf.NetworkStore.ParseNFTID(id)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse nft id")
	}

	switch network.(type) {

	case *networks.EthereumNetwork:
		data, err := s.ethereumProvider.GetNFTPriceHistory(ctx, id)
		if err != nil {
			return nil, errors.Wrap(err, "failed get price history")
		}
		return &marketplacepb.NFTPriceHistoryResponse{Data: data}, nil

	case *networks.CosmosNetwork:
		var data []*marketplacepb.PriceDatum
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

	return nil, fmt.Errorf("unsupported network kind '%s'", network.GetBase().Kind)
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

	network, _, err := s.conf.NetworkStore.ParseCollectionID(collectionID)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse collection id")
	}

	switch network.(type) {

	case *networks.EthereumNetwork:
		stats, err := s.ethereumProvider.GetCollectionStats(ctx, collectionID, ownerID)
		if err != nil {
			return nil, errors.Wrap(err, "failed fetch ethereum collection stats")
		}
		return &marketplacepb.CollectionStatsResponse{
			Stats: stats,
		}, nil

	case *networks.CosmosNetwork:
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
        SELECT * from nfts_in_collection nic where is_listed = true
      ),
      min_price_by_denom as (
        select min(price_amount) price_amount, price_denom from listed_nfts ln2 group by ln2.price_denom 
      ),
      trades_in_collection as (
        select COALESCE(sum(cast(t.price as float8)),0) total_volume FROM trades AS t
        INNER join activities AS a on a.id = t.activity_id 
        INNER join nfts_in_collection nic on nic.id = a.nft_id
      ),
			activities_on_period AS (
				SELECT *, a2.id activity_id FROM activities a2 
        right join nfts_in_collection on a2.nft_id = nfts_in_collection.id
        WHERE a2."time" > $3
			),
			trades_on_period AS (
        SELECT COALESCE(avg(cast(t2.price as float8)),0) avg_price_period FROM trades t2 INNER JOIN activities_on_period aop
				ON aop.activity_id = t2.activity_id
			)
      select 
        to_json(array( select json_build_object('amount',price_amount,'denom',ln2.price_denom) from min_price_by_denom ln2)) lower_price, 
        (select total_volume from trades_in_collection),
        (select count(distinct owner_id)  from nfts_in_collection) owners,
        (select count(1) from listed_nfts) listed,
       (select avg_price_period from trades_on_period) as avg_price_period,
        count(1) total_supply,
        (select count(1) from nfts_in_collection where owner_id = $2) owned
      from nfts_in_collection`, collectionID, ownerID, time.Now().AddDate(0, 0, -1)).Bind(ctx, db, &stats)

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

	return nil, fmt.Errorf("unsupported network kind '%s'", network.GetBase().Kind)
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

func (s *MarkteplaceService) SearchNames(ctx context.Context, req *marketplacepb.SearchNamesRequest) (*marketplacepb.SearchNamesResponse, error) {
	const maxLimit = 21
	limit := req.Limit
	if limit > maxLimit {
		limit = maxLimit
	}

	var names []string

	network, err := s.conf.NetworkStore.GetCosmosNetwork(req.NetworkId)
	if err == nil {
		collectionID := network.CollectionID(network.NameServiceContractAddress)
		var nfts []indexerdb.NFT
		if err := s.conf.IndexerDB.
			Preload("TeritoriNFT").
			Joins("JOIN teritori_nfts ON teritori_nfts.nft_id = nfts.id").
			Where("teritori_nfts.token_id ~* ? AND nfts.collection_id = ? AND nfts.burnt = false", req.Input, collectionID).
			Limit(int(limit)).
			Find(&nfts).Error; err != nil {
			return nil, errors.Wrap(err, "failed to read nfts in db")
		}
		for _, nft := range nfts {
			if nft.TeritoriNFT == nil {
				s.conf.Logger.Debug("failed to get nft token id")
				continue
			}
			names = append(names, nft.TeritoriNFT.TokenID)
		}
	}

	missing := int(limit) - len(names)
	if missing > 0 {
		var dbNames []indexerdb.Name
		if err := s.conf.IndexerDB.Limit(missing).Where("names.value ~* ?", req.Input).Find(&dbNames).Error; err != nil {
			return nil, errors.Wrap(err, "failed to read names db")
		}
		s.conf.Logger.Info("search names", zap.Int("db", len(dbNames)))
		for _, n := range dbNames[:min(missing, len(dbNames))] {
			names = append(names, n.Value)
		}
	}

	return &marketplacepb.SearchNamesResponse{Names: names}, nil
}

func min[T constraints.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}

// TODO: consider merging this into Collections call
func (s *MarkteplaceService) SearchCollections(ctx context.Context, req *marketplacepb.SearchCollectionsRequest) (*marketplacepb.SearchCollectionsResponse, error) {
	const maxLimit = 21
	limit := req.Limit
	if limit > maxLimit {
		limit = maxLimit
	}

	if req.Input == "" {
		return nil, errors.New("no input")
	}

	var collections []indexerdb.Collection
	if err := s.conf.IndexerDB.
		Preload("TeritoriCollection").
		Joins("JOIN teritori_collections ON teritori_collections.collection_id = collections.id").
		Where("name ~* ?", req.Input).
		Where("teritori_collections.mint_contract_address IN ?", s.conf.Whitelist).
		Limit(int(limit)).
		Find(&collections).Error; err != nil {
		return nil, errors.Wrap(err, "failed to read db")
	}
	var pbCollections []*marketplacepb.Collection
	for _, c := range collections {
		network, err := s.conf.NetworkStore.GetNetwork(c.NetworkId)
		if err != nil {
			s.conf.Logger.Debug("failed to get collection network", zap.Error(err))
			continue
		}
		nc := &marketplacepb.Collection{
			Id:                  string(c.ID),
			CollectionName:      c.Name,
			Verified:            true,
			ImageUri:            c.ImageURI,
			NetworkId:           c.NetworkId,
			SecondaryDuringMint: c.SecondaryDuringMint,
		}
		if c.TeritoriCollection != nil {
			nc.CreatorId = string(network.GetBase().UserID(c.TeritoriCollection.CreatorAddress))
			nc.MintAddress = c.TeritoriCollection.MintContractAddress
		}
		pbCollections = append(pbCollections, nc)
	}
	return &marketplacepb.SearchCollectionsResponse{Collections: pbCollections}, nil
}

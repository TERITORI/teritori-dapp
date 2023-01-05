package ethereum

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"math/big"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/TERITORI/teritori-dapp/go/pkg/thegraph"
	"github.com/dgraph-io/ristretto"
)

type Provider struct {
	client graphql.Client
	cache  *ristretto.Cache
}

var refreshTime = time.Minute

func NewEthereumProvider(graphqlEndpoint string) *Provider {
	client := graphql.NewClient(graphqlEndpoint, nil)
	cache, err := ristretto.NewCache(&ristretto.Config{
		NumCounters: 1e7,
		MaxCost:     1 << 30,
		BufferItems: 64,
	})
	if err != nil {
		log.Fatal(err)
	}
	return &Provider{
		client: client,
		cache:  cache,
	}
}

type Volume struct {
	denom  string
	volume int64
}

func (p *Provider) GetCollections(ctx context.Context, networkId string) ([]marketplacepb.Collection, error) {
	cacheKey := fmt.Sprintf("col_%s", networkId)
	data, ok := p.cache.Get(cacheKey)
	if ok {
		return data.([]marketplacepb.Collection), nil
	}
	//30 days window
	unixTime := time.Now().AddDate(0, 0, -30).Unix()
	collections, err := thegraph.GetCollections(ctx, p.client, fmt.Sprint(unixTime))
	if err != nil {
		return nil, err
	}
	//volumeByCollectionByDenom
	volumeByCollection := make(map[string]Volume)
	//Fill collection volume
	for _, trade := range collections.Buys {
		volume, ok := volumeByCollection[trade.Nft.Contract.Id]
		if !ok {
			volume.denom = trade.Denom
		}
		volume.volume += stringToInt64(trade.Price)
		volumeByCollection[trade.Nft.Contract.Id] = volume
	}
	// Fix: currently it does not support multiple denoms
	res := make([]marketplacepb.Collection, 0, len(collections.NftContracts))
	for _, contract := range collections.NftContracts {
		res = append(res, marketplacepb.Collection{
			NetworkId:      networkId,
			Id:             indexerdb.EthereumCollectionID(contract.Minter),
			CollectionName: contract.Name,
			MintAddress:    contract.Minter,
			Volume:         fmt.Sprint(volumeByCollection[contract.Id].volume),
			CreatorId:      fmt.Sprintf("eth-%s", contract.Minter),
			VolumeDenom:    volumeByCollection[contract.Id].denom,
		})
	}
	p.cache.SetWithTTL(cacheKey, res, 0, refreshTime)
	return res, nil
}

func (p *Provider) GetCollectionStats(ctx context.Context, collectionID string, owner string) (*marketplacepb.CollectionStats, error) {
	minter := strings.Replace(collectionID, "eth-", "", 1)
	cacheKey := fmt.Sprintf("col_stats_%s", collectionID)
	data, ok := p.cache.Get(cacheKey)
	var err error
	var collectionsStats *thegraph.GetCollectionStatsResponse
	if ok {
		collectionsStats = data.(*thegraph.GetCollectionStatsResponse)
	} else {
		collectionsStats, err = thegraph.GetCollectionStats(ctx, p.client, minter)
		p.cache.SetWithTTL(cacheKey, collectionsStats, 0, refreshTime)
	}
	if err != nil {
		return nil, err
	}

	if len(collectionsStats.NftContracts) == 0 {
		return &marketplacepb.CollectionStats{}, nil
	}
	nftContract := collectionsStats.NftContracts[0]
	nfts := nftContract.Nfts

	volumeByDenom := make(map[string](*big.Int))
	floorByDenom := make(map[string](*big.Int))

	// Fill collection volume
	var lastDenom string
	for _, trade := range collectionsStats.Buys {
		_, ok := volumeByDenom[trade.Denom]
		if !ok {
			volumeByDenom[trade.Denom] = big.NewInt(0)
		}

		tradePrice := stringToBigInt(trade.Price)
		volumeByDenom[trade.Denom] = volumeByDenom[trade.Denom].Add(volumeByDenom[trade.Denom], tradePrice)
		lastDenom = trade.Denom
	}

	//TODO: deal with several denoms right now just sending last denom volume
	ownersSeen := make(map[string]int32)
	var listed int32
	for _, nft := range nfts {
		//Count number of owners and number of nfts Owned
		ownersSeen[nft.Owner]++
		if nft.InSale {
			listed++

			priceBigInt := stringToBigInt(nft.Price)

			currentPrice, ok := floorByDenom[nft.Denom]
			if !ok {
				floorByDenom[nft.Denom] = priceBigInt
				continue
			}

			if priceBigInt.Uint64() == 0 {
				continue
			}

			if currentPrice.Cmp(priceBigInt) == 1 {
				floorByDenom[nft.Denom] = priceBigInt
			}
		}
	}
	res := &marketplacepb.CollectionStats{
		Owners:      int32(len(ownersSeen)),
		Owned:       ownersSeen[owner],
		Listed:      listed,
		TotalSupply: int64(len(nfts)),
		TotalVolume: fmt.Sprint(volumeByDenom[lastDenom]),
	}
	res.FloorPrice = make([]*marketplacepb.Amount, 0, len(floorByDenom))
	for denom, price := range floorByDenom {
		res.FloorPrice = append(res.FloorPrice, &marketplacepb.Amount{Denom: denom, Quantity: fmt.Sprint(price)})
	}
	return res, nil
}

func (p *Provider) GetNFTs(ctx context.Context, networkID string, collectionID string, ownerId string, limit, offset int, orderDirection marketplacepb.SortDirection) ([]*marketplacepb.NFT, error) {
	// TODO: find how to send the whole `where` filter to query with genqlcient instead of separating into 2 queries

	minter := strings.Replace(collectionID, "eth-", "", 1)
	owner := strings.Replace(ownerId, "eth-", "", 1)

	nftContractFilter := thegraph.NftContract_filter{}
	// FIXME: re-work on indexer to keep ownerInfo/lockedOn info, for now we have to make 2 queries
	// This is really ugly now we should fix that soon
	nftFilter1 := thegraph.Nft_filter{}
	nftFilter2 := thegraph.Nft_filter{}

	if minter != "" {
		nftContractFilter.Minter = minter
	}

	if owner != "" {
		nftFilter1.Owner = owner
		nftFilter2.Seller = owner
	}

	sortDirection := thegraph.OrderDirectionAsc
	if orderDirection == marketplacepb.SortDirection_SORT_DIRECTION_DESCENDING {
		sortDirection = thegraph.OrderDirectionDesc
	}
	cacheKey := fmt.Sprintf("nft_%s_%s_%s", minter, owner, sortDirection)
	var res []*marketplacepb.NFT
	data, ok := p.cache.Get(cacheKey)
	if ok {
		res = data.([]*marketplacepb.NFT)
	} else {
		collection1, err := thegraph.GetCollectionNFTs(ctx, p.client, nftContractFilter, nftFilter1, thegraph.Nft_orderByPrice, sortDirection)
		if err != nil {
			return nil, err
		}

		collection2, err := thegraph.GetCollectionNFTs(ctx, p.client, nftContractFilter, nftFilter2, thegraph.Nft_orderByPrice, sortDirection)
		if err != nil {
			return nil, err
		}

		for _, nftContract := range collection1.NftContracts {
			nfts := nftContract.Nfts

			for _, nft := range nfts {
				var (
					lockedOn = ""
					ownerId  = nft.Owner
				)

				if nft.InSale {
					lockedOn = nft.Owner
					ownerId = nft.Seller
				}

				nft := marketplacepb.NFT{
					Id:                 fmt.Sprintf("eth-%s-%s", nftContract.Minter, nft.TokenID),
					NetworkId:          networkID,
					ImageUri:           nft.TokenURI,
					MintAddress:        nftContract.Minter,
					Price:              nft.Price,
					Denom:              nft.Denom,
					IsListed:           nft.InSale,
					CollectionName:     nftContract.Name,
					OwnerId:            ownerId,
					LockedOn:           lockedOn,
					NftContractAddress: nftContract.Id,
				}

				res = append(res, &nft)
			}
		}

		for _, nftContract := range collection2.NftContracts {
			nfts := nftContract.Nfts

			for _, nft := range nfts {
				var (
					lockedOn = ""
					ownerId  = nft.Owner
				)

				if nft.InSale {
					lockedOn = nft.Owner
					ownerId = nft.Seller
				}

				nft := marketplacepb.NFT{
					Id:                 fmt.Sprintf("eth-%s-%s", nftContract.Minter, nft.TokenID),
					NetworkId:          networkID,
					ImageUri:           nft.TokenURI,
					MintAddress:        nftContract.Minter,
					Price:              nft.Price,
					Denom:              nft.Denom,
					IsListed:           nft.InSale,
					CollectionName:     nftContract.Name,
					OwnerId:            ownerId,
					LockedOn:           lockedOn,
					NftContractAddress: nftContract.Id,
				}

				res = append(res, &nft)
			}
		}

		p.cache.SetWithTTL(cacheKey, res, 0, refreshTime)
	}

	total := len(res)
	if offset > total {
		return []*marketplacepb.NFT{}, nil
	}
	end := offset + limit
	if end > total {
		end = total
	}
	nfts := res[offset:end]
	return sortArray(nfts), nil
}

func (p *Provider) GetActivities(ctx context.Context, collectionID string, nftID string, limit, offset int) ([]*marketplacepb.Activity, int, error) {
	minter := strings.Replace(collectionID, "eth-", "", 1)
	var activities []thegraph.Activities
	cacheKey := fmt.Sprintf("Act_%s_%s", collectionID, nftID)
	data, ok := p.cache.Get(cacheKey)
	if ok {
		activities = data.([]thegraph.Activities)
	} else {
		if nftID != "" {
			res, err := thegraph.GetNFTActivities(ctx, p.client, nftID)
			if err != nil {
				return nil, 0, err
			}
			activities = res.Actions
		} else {
			res, err := thegraph.GetCollectionActivities(ctx, p.client, minter)
			if err != nil {
				return nil, 0, err
			}
			activities = res.Actions
		}
		p.cache.SetWithTTL(cacheKey, activities, 0, refreshTime)
	}
	total := len(activities)
	if offset > total {
		return []*marketplacepb.Activity{}, total, nil
	}
	end := offset + limit
	if end > total {
		end = total
	}
	res := make([]*marketplacepb.Activity, len(activities))
	activities = activities[offset:end]
	for index, activity := range activities {
		activityItem := marketplacepb.Activity{
			Id:              indexerdb.EthereumActivityID(activity.TxID, index),
			TransactionKind: activity.Action,
			TargetImageUri:  activity.Nft.TokenURI,
			ContractName:    activity.Nft.Contract.Name,
			TransactionId:   activity.TxID,
			Time:            time.Unix(stringToInt64(activity.CreatedAt), 0).Format(time.RFC3339),
		}
		switch activity.Action {
		case "trade":
			activityItem.Amount = activity.Buy.Price
			activityItem.Denom = activity.Buy.Denom
			activityItem.BuyerId = UserIDString(activity.Actor)
			activityItem.SellerId = UserIDString(activity.Buy.Seller)
		case "list":
			activityItem.Amount = activity.List.Price
			activityItem.Denom = activity.List.Denom
			activityItem.SellerId = UserIDString(activity.Actor)
		case "cancel_list":
			activityItem.SellerId = UserIDString(activity.Actor)
		case "transfer-nft":
			activityItem.SellerId = UserIDString(activity.Actor)
			activityItem.BuyerId = UserIDString(activity.Receiver)
		}
		res[index] = &activityItem
	}
	return res, total, nil
}

// stringToInt64 assumes a number, return 0 if string cannot be parsed
func stringToInt64(number string) int64 {
	res, _ := strconv.ParseInt(number, 10, 64)
	return res
}

func stringToBigInt(val string) *big.Int {
	wei, ok := new(big.Int).SetString(val, 10)
	if !ok {
		return big.NewInt(0)
	}
	return wei
}

func (p *Provider) GetNFTPriceHistory(ctx context.Context, nftID string) ([]*marketplacepb.PriceDatum, error) {
	buys, err := thegraph.GetNFTPriceHistory(ctx, p.client, nftID)
	if err != nil {
		return nil, err
	}
	res := make([]*marketplacepb.PriceDatum, len(buys.Buys))
	for index, trade := range buys.Buys {

		res[index] = &marketplacepb.PriceDatum{
			Time:  time.Unix(stringToInt64(trade.CreatedAt), 0).Format(time.RFC3339),
			Price: trade.Price,
		}
	}
	return res, nil

}

func UserIDString(addr string) string {
	return string(indexerdb.EthereumUserID(addr))
}

// In order to always push the non-listed nfts at the end
func sortArray(arr []*marketplacepb.NFT) []*marketplacepb.NFT {
	// Find the index of the first element with an empty field
	var emptyFieldIndex int
	for i, item := range arr {
		if item.Price != "" {
			emptyFieldIndex = i
			break
		}
	}

	// Create a slice containing the elements from the input slice up to the first element with an empty field
	sortedElements := arr[emptyFieldIndex:]

	// Create a slice containing the remaining elements from the input slice
	emptyFieldElements := arr[:emptyFieldIndex]

	// Concatenate the two slices, with the slice of empty field elements coming after the sorted elements
	return append(sortedElements, emptyFieldElements...)
}

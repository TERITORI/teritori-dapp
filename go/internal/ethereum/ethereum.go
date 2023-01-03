package ethereum

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"math/big"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/TERITORI/teritori-dapp/go/pkg/thegraph"
)

type Provider struct {
	client graphql.Client
}

func NewEthereumProvider(graphqlEndpoint string) *Provider {
	client := graphql.NewClient(graphqlEndpoint, nil)
	return &Provider{
		client: client,
	}
}

type Volume struct {
	denom  string
	volume int64
}

func (p *Provider) GetCollections(ctx context.Context, networkId string) ([]marketplacepb.Collection, error) {
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
	return res, nil
}

func (p *Provider) GetCollectionStats(ctx context.Context, collectionID string, owner string) (*marketplacepb.CollectionStats, error) {

	minter := strings.Replace(collectionID, "eth-", "", 1)
	collectionsStats, err := thegraph.GetCollectionStats(ctx, p.client, minter)
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

			if currentPrice.Cmp(priceBigInt) > 1 {
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
		res.FloorPrice = append(res.FloorPrice, &marketplacepb.Amount{Denom: denom, Quantity: price})
	}
	return res, nil
}

func (p *Provider) GetNFTs(ctx context.Context, networkID string, collectionID string, ownerId string, limit, offset int) ([]*marketplacepb.NFT, error) {
	// TODO: find how to send the whole `where` filter to query with genqlcient instead of separating into 2 queries

	minter := strings.Replace(collectionID, "eth-", "", 1)
	owner := strings.Replace(ownerId, "eth-", "", 1)

	nftContractFilter := thegraph.NftContract_filter{}
	nftFilter := thegraph.Nft_filter{}

	if minter != "" {
		nftContractFilter.Minter = minter
	}

	if owner != "" {
		nftFilter.Owner = owner
	}

	collection, err := thegraph.GetCollectionNFTs(ctx, p.client, nftContractFilter, nftFilter, limit, offset)
	if err != nil {
		return nil, err
	}

	var res []*marketplacepb.NFT

	for _, nftContract := range collection.NftContracts {
		nfts := nftContract.Nfts

		for _, nft := range nfts {
			var (
				lockedOn = ""
				ownerId  = nft.Owner
			)

			if nft.Seller != "" {
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

	return res, nil
}

func (p *Provider) GetActivities(ctx context.Context, collectionID string, nftID string, limit, offset int) ([]*marketplacepb.Activity, error) {
	minter := strings.Replace(collectionID, "eth-", "", 1)
	if nftID != "" {
		activities, err := thegraph.GetNFTActivities(ctx, p.client, nftID, limit, offset)
		if err != nil {
			return nil, err
		}
		res := make([]*marketplacepb.Activity, len(activities.Actions))
		for index, activity := range activities.Actions {
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
			}
			res[index] = &activityItem
		}
		return res, nil
	}
	activities, err := thegraph.GetCollectionActivities(ctx, p.client, minter, limit, offset)
	if err != nil {
		return nil, err
	}
	res := make([]*marketplacepb.Activity, len(activities.Actions))
	for index, activity := range activities.Actions {
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
		}
		res[index] = &activityItem
	}
	return res, nil
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
			Price: float64(stringToInt64(trade.Price)),
		}
	}
	return res, nil

}

func UserIDString(addr string) string {
	return string(indexerdb.EthereumUserID(addr))
}

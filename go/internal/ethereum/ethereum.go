package ethereum

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/Khan/genqlient/graphql"
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

type volume struct {
	denom  string
	volume int64
}

func (p *Provider) GetCollections(networkId string) ([]marketplacepb.Collection, error) {
	ctx := context.Background()
	//30 days window
	unixTime := time.Now().AddDate(0, 0, -30).Unix()
	collections, err := thegraph.GetCollections(ctx, p.client, fmt.Sprint(unixTime))
	if err != nil {
		return nil, err
	}
	//volumeByCollectionByDenom
	volumeByCollection := make(map[string]volume)
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

		fmt.Printf("%v", contract)

		res = append(res, marketplacepb.Collection{
			NetworkId:           networkId,
			Id:                  contract.Id,
			CollectionName:      contract.Name,
			MintAddress:         contract.Id,
			Volume:              fmt.Sprint(volumeByCollection[contract.Id].volume),
			VolumeDenom:         volumeByCollection[contract.Id].denom,
			SecondaryDuringMint: true, // TODO: force to test
		})
	}
	return res, nil
}

func (p *Provider) GetCollectionStats(collectionID string, owner string) (*marketplacepb.CollectionStats, error) {
	ctx := context.Background()
	collectionsStats, err := thegraph.GetCollectionStats(ctx, p.client, collectionID)
	if err != nil {
		return nil, err
	}
	volumeByDenom := make(map[string]int64)
	floorByDenom := make(map[string]int64)
	//Fill collection volume
	var lastDenom string
	for _, trade := range collectionsStats.Buys {
		volumeByDenom[trade.Denom] = volumeByDenom[trade.Denom] + stringToInt64(trade.Price)
		lastDenom = trade.Denom
	}
	//TODO: deal with several denoms right now just sending last denom volume
	ownersSeen := make(map[string]int32)
	var listed int32
	for _, nft := range collectionsStats.Nfts {
		//Count number of owners and number of nfts Owned
		ownersSeen[nft.Owner]++
		if nft.InSale {
			listed++
			currentPrice, ok := floorByDenom[nft.Denom]
			if !ok {
				floorByDenom[nft.Denom] = stringToInt64(nft.Price)
				continue
			}
			if currentPrice > stringToInt64(nft.Price) {
				floorByDenom[nft.Denom] = stringToInt64(nft.Price)
			}
		}
	}
	res := &marketplacepb.CollectionStats{
		Owners:      int32(len(ownersSeen)),
		Owned:       ownersSeen[owner],
		Listed:      listed,
		TotalSupply: int64(len(collectionsStats.Nfts)),
		TotalVolume: fmt.Sprint(volumeByDenom[lastDenom]),
	}
	res.FloorPrice = make([]*marketplacepb.Amount, 0, len(floorByDenom))
	for denom, price := range floorByDenom {
		res.FloorPrice = append(res.FloorPrice, &marketplacepb.Amount{Denom: denom, Quantity: price})
	}
	return res, nil
}

func (p *Provider) GetNFTs(collectionID string, limit, offset int) ([]marketplacepb.NFT, error) {
	ctx := context.Background()
	nfts, err := thegraph.GetCollectionNFTs(ctx, p.client, collectionID, limit, offset)
	if err != nil {
		return nil, err
	}
	res := make([]marketplacepb.NFT, len(nfts.Nfts))
	for index, nft := range nfts.Nfts {
		res[index] = marketplacepb.NFT{
			Id:        nft.Id,
			NetworkId: "ethereum",
			ImageUri:  nft.TokenURI,
			//Name: nft.,
			MintAddress:        collectionID,
			Price:              nft.Price,
			Denom:              nft.Denom,
			IsListed:           nft.InSale,
			CollectionName:     nft.Contract.Name,
			OwnerId:            nft.Owner,
			NftContractAddress: collectionID,
		}
	}
	return res, nil
}

func (p *Provider) GetCollectionActivities(collectionID string, limit, offset int) ([]*marketplacepb.Activity, error) {
	ctx := context.Background()
	activities, err := thegraph.GetCollectionActivities(ctx, p.client, collectionID, limit, offset)
	if err != nil {
		return nil, err
	}
	res := make([]*marketplacepb.Activity, len(activities.Actions))
	for index, activity := range activities.Actions {
		activityItem := marketplacepb.Activity{
			Id:              activity.Id,
			TransactionKind: activity.Action,
			TargetImageUri:  activity.Nft.TokenURI,
			ContractName:    activity.Nft.Contract.Name,
			Time:            activity.CreatedAt,
		}
		switch activity.Action {
		case "buy":
			activityItem.Amount = activity.Buy.Price
			activityItem.Denom = activity.Buy.Denom
			activityItem.BuyerId = activity.Actor
			activityItem.SellerId = activity.Buy.Seller
		case "list":
			activityItem.Amount = activity.List.Price
			activityItem.Denom = activity.List.Denom
			activityItem.SellerId = activity.Actor
		case "cancel_list":
			activityItem.SellerId = activity.Actor
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

package collections

import (
	"context"
	"fmt"
	"time"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/pkg/holagql"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func NewCollectionsByMarketCapProvider(ctx context.Context, graphqlEndpoint string, logger *zap.Logger) CollectionsProvider {
	fetch := func() ([]*marketplacepb.Collection, error) {
		return fetchCollectionsByMarketCap(ctx, graphqlEndpoint, logger)
	}
	return newCachedCollectionsProvider(ctx, fetch, logger)
}

func fetchCollectionsByMarketCap(ctx context.Context, graphqlEndpoint string, logger *zap.Logger) ([]*marketplacepb.Collection, error) {
	endDate := time.Now()
	startDate := endDate.AddDate(-1, 0, 0)

	gqlClient := graphql.NewClient(graphqlEndpoint, nil)
	collectionsByMarketCap, err := holagql.GetCollectionsByMarketCap(ctx, gqlClient,
		holagql.OrderDirectionDesc,
		startDate.Format(time.RFC3339),
		endDate.Format(time.RFC3339),
		fetchLimit,
		0,
	)
	if err != nil {
		return nil, errors.Wrap(err, "failed to run graphql query")
	}

	var collections []*marketplacepb.Collection
	for _, collection := range collectionsByMarketCap.GetCollectionsFeaturedByMarketCap() {
		var creator *holagql.GetCollectionsByMarketCapCollectionsFeaturedByMarketCapCollectionNftCreatorsNftCreator
		creators := collection.GetNft().Creators

		creatorName := ""
		if len(creators) > 0 {
			creator = &creators[0]
			creatorNameReply, err := holagql.GetCreatorName(ctx, gqlClient, creator.GetMetadataAddress())
			if err != nil {
				logger.Error("failed to fetch creator name", zap.Error(err))
			} else if len(creatorNameReply.GetMetadataJsons()) == 0 {
				logger.Error("no creator metadata")
			} else {
				creatorName = creatorNameReply.GetMetadataJsons()[0].GetName()
			}
		}

		mintAddress := collection.GetNft().MintAddress
		collections = append(collections, &marketplacepb.Collection{
			Id:             fmt.Sprintf("%s-%s", "sol", mintAddress),
			CollectionName: collection.GetNft().Name,
			Verified:       true,
			CreatorName:    creatorName,
			ImageUri:       collection.GetNft().Image,
			MintAddress:    mintAddress,
		})
	}
	return collections, nil
}

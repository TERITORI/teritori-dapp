package marketplace

import (
	"context"
	"fmt"
	"math/big"
	"strings"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/internal/collections"
	"github.com/TERITORI/teritori-dapp/go/internal/faking"
	"github.com/TERITORI/teritori-dapp/go/pkg/holagql"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type MarkteplaceService struct {
	marketplacepb.UnimplementedMarketplaceServiceServer

	upcomingLaunchesProvider       collections.CollectionsProvider
	collectionsByVolumeProvider    collections.CollectionsProvider
	collectionsByMarketCapProvider collections.CollectionsProvider
	logger                         *zap.Logger
	graphqlEndpoint                string
}

func NewMarketplaceService(ctx context.Context, logger *zap.Logger) *MarkteplaceService {
	graphqlEndpoint := "https://graph.65.108.73.219.nip.io/v1" // FIXME: pass by env
	return &MarkteplaceService{
		logger:                         logger,
		upcomingLaunchesProvider:       collections.NewUpcomingLaunchesProvider(ctx, logger),
		collectionsByVolumeProvider:    collections.NewCollectionsByVolumeProvider(ctx, graphqlEndpoint, logger),
		collectionsByMarketCapProvider: collections.NewCollectionsByMarketCapProvider(ctx, graphqlEndpoint, logger),
		graphqlEndpoint:                graphqlEndpoint,
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

var solsPerLamport = big.NewFloat(0.000000001)

func formatLamports(lamportsString string) (string, error) {
	lamports, _, err := big.ParseFloat(lamportsString, 10, 53, big.ToNearestEven)
	if err != nil {
		return "", errors.Wrap(err, "failed to parse lamports")
	}
	sols := (&big.Float{}).Mul(lamports, solsPerLamport)
	return fmt.Sprintf("%s SOL", strings.TrimRight(strings.TrimRight(fmt.Sprintf("%f", sols), "0"), ".")), nil
}

func (s *MarkteplaceService) CollectionNFTs(req *marketplacepb.CollectionNFTsRequest, srv marketplacepb.MarketplaceService_CollectionNFTsServer) error {
	// NOTE: we should probably query the graphql api from the client directly in this case

	limit := req.GetLimit()
	if limit <= 0 {
		return errors.New("limit must be a positive number")
	}

	offset := req.GetOffset()
	if offset < 0 {
		return errors.New("offset must be greater or equal to 0")
	}

	collectionMintAddress := req.GetMintAddress()
	if collectionMintAddress == "" {
		return errors.New("empty mint address")
	}

	if strings.HasPrefix(collectionMintAddress, faking.CollectionPrefix) {
		for i := int32(0); i < limit; i++ {
			if err := srv.Send(&marketplacepb.CollectionNFTsResponse{Nft: faking.FakeNFT()}); err != nil {
				return errors.Wrap(err, "failed to send nft")
			}
		}
		return nil
	}

	gqlClient := graphql.NewClient(s.graphqlEndpoint, nil)

	collectionNFTs, err := holagql.GetCollectionNFTs(srv.Context(), gqlClient,
		collectionMintAddress,
		int(limit),
		int(offset),
	)
	if err != nil {
		return errors.Wrap(err, "failed to fetch collection nfts")
	}

	for _, nft := range collectionNFTs.GetNfts() {
		price := ""
		if len(nft.GetListings()) != 0 {
			price, err = formatLamports(nft.GetListings()[0].GetPrice())
			if err != nil {
				s.logger.Error("failed to format offer price", zap.Error(err))
			}
		}
		if err := srv.Send(&marketplacepb.CollectionNFTsResponse{Nft: &marketplacepb.NFT{
			Name:        nft.GetName(),
			MintAddress: nft.GetMintAddress(),
			ImageUri:    nft.GetImage(),
			Price:       price,
		}}); err != nil {
			return errors.Wrap(err, "failed to send nft")
		}
	}

	return nil
}

func (s *MarkteplaceService) CollectionActivity(req *marketplacepb.CollectionActivityRequest, srv marketplacepb.MarketplaceService_CollectionActivityServer) error {
	// TODO: we should use a time cursor based pagination instead of limit and offset

	limit := req.GetLimit()
	if limit <= 0 {
		return errors.New("limit must be a positive number")
	}

	offset := req.GetOffset()
	if offset < 0 {
		return errors.New("offset must be greater or equal to 0")
	}

	collectionMintAddress := req.GetMintAddress()
	if collectionMintAddress == "" {
		return errors.New("empty mint address")
	}

	if strings.HasPrefix(collectionMintAddress, faking.CollectionPrefix) {
		for i := int32(0); i < limit; i++ {
			if err := srv.Send(&marketplacepb.CollectionActivityResponse{Activity: faking.FakeActivity()}); err != nil {
				return errors.Wrap(err, "failed to send activity")
			}
		}
		return nil
	}

	gqlClient := graphql.NewClient(s.graphqlEndpoint, nil)

	collectionActivity, err := holagql.GetCollectionActivity(srv.Context(), gqlClient,
		collectionMintAddress,
		int(limit),
		int(offset),
	)
	if err != nil {
		return errors.Wrap(err, "failed to fetch collection activity")
	}

	for _, activity := range collectionActivity.Collection.Activities {
		price, err := formatLamports(activity.Price)
		if err != nil {
			s.logger.Error("failed to format activity price", zap.Error(err))
		}
		if err := srv.Send(&marketplacepb.CollectionActivityResponse{Activity: &marketplacepb.Activity{
			Amount:          price,
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

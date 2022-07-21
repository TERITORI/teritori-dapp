package marketplace

import (
	"github.com/TERITORI/teritori-dapp/go/internal/airtable"
	"github.com/TERITORI/teritori-dapp/go/internal/faking"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type MarkteplaceService struct {
	marketplacepb.UnimplementedMarketplaceServiceServer

	UpcomingLaunchesProvider airtable.UpcomingLaunchesProvider
	Logger                   *zap.Logger
}

func (s *MarkteplaceService) UpcomingLaunches(req *marketplacepb.UpcomingLaunchesRequest, srv marketplacepb.MarketplaceService_UpcomingLaunchesServer) error {
	launches := s.UpcomingLaunchesProvider.UpcomingLaunches()
	for launch := range launches {
		if err := srv.Send(&marketplacepb.UpcomingLaunchesResponse{Collection: launch}); err != nil {
			return errors.Wrap(err, "failed to send")
		}
	}
	return nil
}

func (s *MarkteplaceService) Collections(req *marketplacepb.CollectionsRequest, srv marketplacepb.MarketplaceService_CollectionsServer) error {
	for i := 0; i < 10; i++ {
		if err := srv.Send(&marketplacepb.CollectionsResponse{Collection: faking.FakeCollection()}); err != nil {
			return errors.Wrap(err, "failed to send")
		}
	}
	return nil
}

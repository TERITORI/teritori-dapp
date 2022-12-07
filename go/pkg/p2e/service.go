package p2e

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/airtable_fetcher"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2epb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type P2eService struct {
	p2epb.UnimplementedP2EServiceServer

	homeProvider *airtable_fetcher.Cache
	// collectionsByVolumeProvider         collections.CollectionsProvider
	// collectionsByMarketCapProvider      collections.CollectionsProvider
	conf *Config
}

type Config struct {
	Logger             *zap.Logger
	IndexerDB          *gorm.DB
	GraphqlEndpoint    string
	TNSContractAddress string
	TNSDefaultImageURL string
	Whitelist          []string
}

func NewP2eService(ctx context.Context, conf *Config) p2epb.P2EServiceServer {
	// FIXME: validate config
	return &P2eService{
		conf:         conf,
		homeProvider: airtable_fetcher.NewCache(ctx, airtable_fetcher.NewClient(), conf.Logger.Named("airtable_fetcher")),
	}
}

type P2eLeaderboardWithRank struct {
	indexerdb.P2eLeaderboard
	Rank uint32
}

func (s *P2eService) Leaderboard(req *p2epb.LeaderboardRequest, srv p2epb.P2EService_LeaderboardServer) error {
	limit := req.GetLimit()
	if limit <= 0 {
		return errors.New("limit must be a positive number")
	}

	offset := req.GetOffset()
	if offset < 0 {
		return errors.New("offset must be greater or equal to 0")
	}
	// TODO: for performance, we allow max limit = 500
	if offset > 500 {
		offset = 500
	}

	// TODO: We can support global leaderboard without collectionId in the future
	collectionId := req.GetCollectionId()
	if collectionId == "" {
		return errors.New("collectionId must be provided")
	}

	var userScores []P2eLeaderboardWithRank

	err := s.conf.IndexerDB.Raw(`
		SELECT ROW_NUMBER() OVER(ORDER BY in_progress_score desc) as rank, *
		FROM p2e_leaderboards
		WHERE collection_id = ?
		ORDER BY in_progress_score desc
		OFFSET ?
		LIMIT ?
	`,
		collectionId,
		int(offset),
		int(limit),
	).Scan(&userScores).Error

	if err != nil {
		return errors.Wrap(err, "failed to fetch leaderboard")
	}

	for _, userScore := range userScores {
		if err := srv.Send(&p2epb.LeaderboardResponse{UserScore: &p2epb.UserScore{
			Rank:            int32(userScore.Rank),
			UserId:          string(userScore.UserID),
			InProgressScore: int64(userScore.InProgressScore),
			SnapshotScore:   int64(userScore.SnapshotScore),
			SnapshotRank:    int32(userScore.SnapshotRank),
		}}); err != nil {
			return errors.Wrap(err, "failed to send user score")
		}
	}

	return nil
}

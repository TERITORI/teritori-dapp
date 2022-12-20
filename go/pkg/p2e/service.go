package p2e

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2epb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type P2eService struct {
	p2epb.UnimplementedP2EServiceServer
	conf *Config
}

type Config struct {
	Logger        *zap.Logger
	IndexerDB     *gorm.DB
	RiotStartedAt string
}

type UserScoreResponse struct {
	Rank            int32
	UserId          string
	InProgressScore int64
	SnapshotScore   int64
	SnapshotRank    int32
}

func NewP2eService(ctx context.Context, conf *Config) p2epb.P2EServiceServer {
	// FIXME: validate config
	return &P2eService{
		conf: conf,
	}
}

func (s *P2eService) FightersCount(ctx context.Context, req *p2epb.FightersCountRequest) (*p2epb.FightersCountResponse, error) {
	var count int64

	collectionId := req.GetCollectionId()
	if collectionId == "" {
		return nil, errors.New("missing collection_id")
	}

	if err := s.conf.IndexerDB.Model(&indexerdb.P2eLeaderboard{CollectionID: collectionId}).Count(&count).Error; err != nil {
		return nil, errors.Wrap(err, "failed count fighters")
	}

	return &p2epb.FightersCountResponse{Count: uint32(count)}, nil
}

func (s *P2eService) FighterScore(ctx context.Context, req *p2epb.FighterScoreRequest) (*p2epb.FighterScoreResponse, error) {
	collectionId := req.GetCollectionId()
	if collectionId == "" {
		return nil, errors.New("missing collection_id")
	}

	userId := req.GetUserId()
	if userId == "" {
		return nil, errors.New("missing user_id")
	}

	var userScore p2epb.UserScore
	q := &indexerdb.P2eLeaderboard{
		CollectionID: collectionId,
		UserID:       indexerdb.UserID(userId),
	}

	if err := s.conf.IndexerDB.Model(q).First(&userScore).Error; err != nil {
		return nil, errors.Wrap(err, "failed to get user score")
	}

	return &p2epb.FighterScoreResponse{UserScore: &userScore}, nil
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

	seasonId := req.GetSeasonId()
	if seasonId == 0 {
		return errors.New("seasonId invalid")
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

	var userScores []UserScoreResponse

	err := s.conf.IndexerDB.Raw(`
		SELECT ROW_NUMBER() OVER(ORDER BY in_progress_score desc) as rank, *
		FROM p2e_leaderboards
		WHERE collection_id = ? AND season_id = ?
		ORDER BY in_progress_score desc
		OFFSET ?
		LIMIT ?
	`,
		collectionId,
		seasonId,
		int(offset),
		int(limit),
	).Scan(&userScores).Error

	if err != nil {
		return errors.Wrap(err, "failed to fetch leaderboard")
	}

	for _, userScore := range userScores {
		if err := srv.Send(&p2epb.LeaderboardResponse{UserScore: &p2epb.UserScore{
			Rank:            int32(userScore.Rank),
			UserId:          string(userScore.UserId),
			InProgressScore: int64(userScore.InProgressScore),
			SnapshotScore:   int64(userScore.SnapshotScore),
			SnapshotRank:    int32(userScore.SnapshotRank),
		}}); err != nil {
			return errors.Wrap(err, "failed to send user score")
		}
	}

	return nil
}

func (s *P2eService) CurrentSeason(ctx context.Context, req *p2epb.CurrentSeasonRequest) (*p2epb.CurrentSeasonResponse, error) {
	currentSeason, remainingHp, err := GetCurrentSeason(s.conf.RiotStartedAt)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get current season")
	}

	return &p2epb.CurrentSeasonResponse{
		Id:          currentSeason.ID,
		TotalPrize:  currentSeason.TotalPrize,
		BossName:    currentSeason.BossName,
		BossHp:      currentSeason.BossHp,
		RemainingHp: float32(remainingHp),
	}, nil
}

func (s *P2eService) AllSeasons(ctx context.Context, req *p2epb.AllSeasonsRequest) (*p2epb.AllSeasonsResponse, error) {
	allSeasons := GetAllSeasons()

	var data []*p2epb.SeasonWithoutPrize

	for _, season := range allSeasons {
		data = append(data, &p2epb.SeasonWithoutPrize{
			Id:       season.ID,
			BossName: season.BossName,
			BossHp:   season.BossHp,
		})
	}

	return &p2epb.AllSeasonsResponse{Seasons: data}, nil
}

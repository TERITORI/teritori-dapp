package p2e

import (
	"context"
	"time"

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
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewP2eService(ctx context.Context, conf *Config) p2epb.P2EServiceServer {
	// FIXME: validate config
	return &P2eService{
		conf: conf,
	}
}

type UserRankData struct {
	p2epb.UserScore
	TotalUsers int32 `json:"total_users"`
}

func (s *P2eService) UserRank(ctx context.Context, req *p2epb.UserRankRequest) (*p2epb.UserRankResponse, error) {
	seasonId := req.GetSeasonId()
	if seasonId == "" {
		return nil, errors.New("missing season_id")
	}

	userId := req.GetUserId()
	if userId == "" {
		return nil, errors.New("missing user_id")
	}

	var userRank UserRankData
	err := s.conf.IndexerDB.Raw(`
		SELECT *
		FROM p2e_leaderboards pl
		JOIN (
			SELECT COUNT(*) AS total_users, season_id 
			FROM p2e_leaderboards 
			GROUP BY season_id 
			HAVING season_id = ?
		) ct
		ON pl.season_id = ct.season_id 
		WHERE pl.user_id = ?
	`,
		seasonId,
		userId,
	).Scan(&userRank).Error

	if err != nil {
		return nil, errors.Wrap(err, "failed to get user rank")
	}

	return &p2epb.UserRankResponse{
		TotalUsers: userRank.TotalUsers,
		UserScore: &p2epb.UserScore{
			Rank:            userRank.Rank,
			SnapshotRank:    userRank.SnapshotRank,
			UserId:          userRank.UserId,
			InProgressScore: userRank.InProgressScore,
			SnapshotScore:   userRank.SnapshotScore,
			SeasonId:        userRank.SeasonId,
		},
	}, nil
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
	if seasonId == "" {
		return errors.New("missing season_id")
	}

	// TODO: for performance, we allow max limit = 500
	if limit > 500 {
		limit = 500
	}
	var leaderboard []indexerdb.P2eLeaderboard

	err := s.conf.IndexerDB.Order("rank ASC").Limit(int(limit)).Offset(int(offset)).Find(
		&leaderboard,
		"season_id = ?", seasonId,
	).Error

	if err != nil {
		return errors.Wrap(err, "failed to fetch leaderboard")
	}

	for _, userScore := range leaderboard {
		if err := srv.Send(&p2epb.LeaderboardResponse{UserScore: &p2epb.UserScore{
			Rank:            int32(userScore.Rank),
			UserId:          string(userScore.UserID),
			InProgressScore: int64(userScore.InProgressScore),
			SnapshotScore:   int64(userScore.SnapshotScore),
			SnapshotRank:    int32(userScore.SnapshotRank),
			SeasonId:        userScore.SeasonID,
		}}); err != nil {
			return errors.Wrap(err, "failed to send user score")
		}
	}

	return nil
}

func (s *P2eService) CurrentSeason(ctx context.Context, req *p2epb.CurrentSeasonRequest) (*p2epb.CurrentSeasonResponse, error) {
	currentTime := time.Now().UTC()
	currentSeason, remainingHp, err := GetSeasonByTime(currentTime)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get current season")
	}

	bossHp, err := GetBossHp(currentSeason)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get boss HP")
	}

	return &p2epb.CurrentSeasonResponse{
		Id:          currentSeason.ID,
		TotalPrize:  currentSeason.TotalPrize,
		BossName:    currentSeason.BossName,
		BossHp:      bossHp,
		BossImage:   currentSeason.BossImage,
		Denom:       currentSeason.Denom,
		RemainingHp: float32(remainingHp),
		IsPre:       currentSeason.IsPre,
	}, nil
}

func (s *P2eService) AllSeasons(ctx context.Context, req *p2epb.AllSeasonsRequest) (*p2epb.AllSeasonsResponse, error) {
	allSeasons := GetAllSeasons()

	var data []*p2epb.SeasonWithoutPrize

	for _, season := range allSeasons {
		bossHp, err := GetBossHp(season)
		if err != nil {
			return nil, errors.Wrap(err, "failed to get boss HP")
		}

		data = append(data, &p2epb.SeasonWithoutPrize{
			Id:       season.ID,
			BossName: season.BossName,
			BossHp:   bossHp,
		})
	}

	return &p2epb.AllSeasonsResponse{Seasons: data}, nil
}

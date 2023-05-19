package p2e

import (
	"context"
	"math/big"
	"strings"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2epb"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mitchellh/mapstructure"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type P2eService struct {
	p2epb.UnimplementedP2EServiceServer
	conf *Config
}

type Config struct {
	Logger       *zap.Logger
	IndexerDB    *gorm.DB
	NetworkStore networks.NetworkStore
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
	network, err := s.conf.NetworkStore.GetNetwork(req.GetNetworkId())

	if err != nil {
		return nil, errors.Wrap(err, "failed to get provided network")
	}

	currentTime := time.Now().UTC()
	currentSeason, remainingHp, err := GetSeasonByTime(currentTime, network)
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
	network, err := s.conf.NetworkStore.GetNetwork(req.GetNetworkId())

	if err != nil {
		return nil, errors.Wrap(err, "failed to get provided network")
	}

	allSeasons := GetAllSeasons(network)

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

func (s *P2eService) MerkleProof(ctx context.Context, req *p2epb.MerkleProofRequest) (*p2epb.MerkleProofResponse, error) {
	userID := req.GetUserId()
	token := req.GetToken()
	networkID := req.GetNetworkId()

	if userID == "" {
		return nil, errors.New("missing userId")
	}

	if token == "" {
		return nil, errors.New("missing token")
	}

	if networkID == "" {
		return nil, errors.New("missing networkId")
	}

	todayID := time.Now().UTC().Format("2006-01-02")
	currentReward := indexerdb.P2eDailyReward{
		DayID:     todayID,
		NetworkID: networkID,
	}

	if err := s.conf.IndexerDB.First(&currentReward).Error; err != nil {
		return nil, errors.Wrap(err, "failed to get current daily reward")
	}

	var totalRewards UserRewardMap
	if err := mapstructure.Decode(currentReward.TotalRewards, &totalRewards); err != nil {
		return nil, errors.Wrap(err, "failed to decode user reward map from DB")
	}

	var userLeaf RewardData
	var leaves []merkletree.Content
	for addr, userReward := range totalRewards {
		amount := new(big.Int)
		// userReward.Amount is already BigInt string so base here is 0
		amount, ok := amount.SetString(userReward.Amount, 0)
		if !ok {
			return nil, errors.New("failed to create BigInt from user reward amount")
		}

		leaf := RewardData{
			To:     common.HexToAddress(addr),
			Token:  common.HexToAddress(userReward.Token),
			Amount: amount,
		}

		if addr == userID && token == strings.ToLower(leaf.Token.String()) {
			userLeaf = leaf
		}

		leaves = append(leaves, leaf)
	}

	if userLeaf.Amount == nil {
		return nil, errors.New("user does not have reward")
	}

	tree, err := merkletree.New(leaves)
	if err != nil {
		return nil, errors.Wrap(err, "failed to build merkletree from DB")
	}

	proof, err := tree.GetHexProof(userLeaf)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get proof")
	}

	return &p2epb.MerkleProofResponse{
		Proof: proof,
		UserReward: &p2epb.UserReward{
			To:     userLeaf.To.String(),
			Token:  userLeaf.Token.String(),
			Amount: userLeaf.Amount.String(),
		},
	}, nil
}

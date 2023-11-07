package follow

import (
	"context"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/followpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type FollowService struct {
	followpb.UnimplementedFollowServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
	NetStore  *networks.NetworkStore
}

func NewFollowService(ctx context.Context, conf *Config) followpb.FollowServiceServer {
	return &FollowService{
		conf: conf,
	}
}

func (s *FollowService) Followers(ctx context.Context, req *followpb.FollowersRequest) (*followpb.FollowersResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()
	if userId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address}"), "need a wallet address")
	}

	query = query.Where("user_id = ?", userId)

	var followUsers []*indexerdb.FollowUser
	err := query.Find(&followUsers).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	pbNotifications := make([]*followpb.Follower, len(followUsers))
	for i, d := range followUsers {

		pbNotifications[i] = &followpb.Follower{
			UserId: string(d.UserId),
		}
	}

	return &followpb.FollowersResponse{
		Followers: pbNotifications,
	}, nil
}

func (s *FollowService) UserFollowStats(ctx context.Context, req *followpb.UserFollowStatsRequest) (*followpb.UserFollowStatsResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()
	if userId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address}"), "need a wallet address")
	}
	var followUsers *indexerdb.FollowUser

	query = query.Where("follow_user_id = ?", userId)

	var countFollowers int64
	err := query.Model(followUsers).Count(&countFollowers).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	query = s.conf.IndexerDB
	query = query.Where("user_id = ?", userId)
	var countFollowing int64
	err = query.Model(followUsers).Count(&countFollowing).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	return &followpb.UserFollowStatsResponse{
		Followers: countFollowers,
		Following: countFollowing,
	}, nil
}

func (s *FollowService) UserFollowsUser(ctx context.Context, req *followpb.UserFollowsUserRequest) (*followpb.UserFollowsUserResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()
	followUserId := req.GetFollowUserId()

	if userId == "" || followUserId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address} and a notification Id"), "need a wallet address")
	}
	var followUsers *indexerdb.FollowUser

	query = query.Where("follow_user_id = ? and user_id = ?", followUserId, userId)

	var countFollowers int64
	err := query.Model(followUsers).Count(&countFollowers).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	return &followpb.UserFollowsUserResponse{
		Status: countFollowers > 0,
	}, nil
}

func (s *FollowService) FollowUser(ctx context.Context, req *followpb.FollowUserRequest) (*followpb.FollowUserResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()
	followUserId := req.GetFollowUserId()

	if userId == "" || followUserId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address} and a notification Id"), "need a wallet address")
	}
	query = query.Where("follow_user_id = ? and user_id = ?", followUserId, userId)

	var followUsers *indexerdb.FollowUser
	query.First(&followUsers)

	followerInteraction := indexerdb.FollowUser{
		UserId:       networks.UserID(userId),
		FollowUserId: networks.UserID(followUserId),
	}

	if followUsers.Id == 0 {
		err := s.conf.IndexerDB.Create(&followerInteraction).Error
		if err != nil {
			return nil, errors.Wrap(err, "failed to create follower")
		}
	} else {
		err := s.conf.IndexerDB.Delete(&followerInteraction, "user_id = ? AND follow_user_id = ?",
			userId, followUserId).Error
		if err != nil {
			return nil, errors.Wrap(err, "failed to delete follower")
		}
	}

	return &followpb.FollowUserResponse{}, nil
}

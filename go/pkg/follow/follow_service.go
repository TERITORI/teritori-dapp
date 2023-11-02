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

	query = query.Where("user_id = ?", userId, userId)

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

func (s *FollowService) FollowUser(ctx context.Context, req *followpb.FollowUserRequest) (*followpb.FollowUserResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()
	followUserId := req.GetFollowUserId()

	if userId == "" || followUserId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address} and a notification Id"), "need a wallet address")
	}
	query = query.Where("user_id = ?", userId)

	var followUsers *indexerdb.FollowUser
	err := query.First(&followUsers).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	followerInteraction := indexerdb.FollowUser{
		UserId:       networks.UserID(userId),
		FollowUserId: networks.UserID(followUserId),
	}

	if followUsers == nil {
		err := s.conf.IndexerDB.Create(&followerInteraction).Error
		if err != nil {
			return nil, errors.Wrap(err, "failed to create follower")
		}
	} else {
		err := s.conf.IndexerDB.Delete(&followerInteraction).Error
		if err != nil {
			return nil, errors.Wrap(err, "failed to delete follower")
		}
	}

	return &followpb.FollowUserResponse{
		Ok: true,
	}, nil
}

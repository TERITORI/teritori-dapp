package notification

import (
	"context"
	"github.com/TERITORI/teritori-dapp/go/pkg/notificationpb"
	"strconv"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type NotificationService struct {
	notificationpb.UnimplementedNotificationServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
	NetStore  *networks.NetworkStore
}

func NewNotificationService(ctx context.Context, conf *Config) notificationpb.NotificationServiceServer {
	return &NotificationService{
		conf: conf,
	}
}

func (s *NotificationService) Notifications(ctx context.Context, req *notificationpb.NotificationRequest) (*notificationpb.NotificationResponse, error) {
	db := s.conf.IndexerDB
	userId := req.GetUserId()
	if userId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address}"), "need a wallet address")
	}
	db.Where("created_by = ?", userId)

	var notifications []*indexerdb.Post
	err := db.Find(&notifications).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	pbnotifications := make([]*notificationpb.Notification, len(notifications))
	for i, d := range notifications {

		pbnotifications[i] = &notificationpb.Notification{
			Image:     string(d.AuthorId),
			Text:      d.Identifier,
			Type:      "post-" + strconv.Itoa(int(d.Category)),
			Timestamp: d.CreatedAt,
		}
	}

	return &notificationpb.NotificationResponse{
		Notifications: pbnotifications,
	}, nil
}

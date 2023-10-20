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

func (s *NotificationService) Notifications(ctx context.Context, req *notificationpb.NotificationsRequest) (*notificationpb.NotificationsResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()
	if userId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address}"), "need a wallet address")
	}
	//networkId := req.GetNetworkId()
	//if networkId != "" {
	//	query = query.Where("network_id = ?", networkId)
	//}
	query = query.Where("user_id = ?", userId)

	var notifications []*indexerdb.Notification
	err := query.Find(&notifications).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	pbnotifications := make([]*notificationpb.Notification, len(notifications))
	for i, d := range notifications {

		pbnotifications[i] = &notificationpb.Notification{
			UserId:    string(d.UserId),
			Body:      d.Body,
			Type:      "post-" + strconv.Itoa(int(d.Category)),
			Timestamp: d.CreatedAt,
			TriggerBy: string(d.TriggerBy),
		}
	}

	return &notificationpb.NotificationsResponse{
		Notifications: pbnotifications,
	}, nil
}

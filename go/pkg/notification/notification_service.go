package notification

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/notificationpb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// FIXME: auth

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
		return nil, errors.New("empty user id")
	}

	query = query.Where("user_id = ? and dismissed = ?", userId, false).Order("created_at desc")

	var notifications []*indexerdb.Notification
	err := query.Find(&notifications).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	pbNotifications := make([]*notificationpb.Notification, len(notifications))
	for i, d := range notifications {

		pbNotifications[i] = &notificationpb.Notification{
			UserId:    string(d.UserId),
			TriggerBy: string(d.TriggerBy),
			Body:      d.Body,
			Action:    d.Action,
			Category:  d.Category,
			CreatedAt: d.CreatedAt,
			Dismissed: d.Dismissed,
			Id:        d.Id,
		}
	}

	return &notificationpb.NotificationsResponse{
		Notifications: pbNotifications,
	}, nil
}

func (s *NotificationService) DismissNotification(ctx context.Context, req *notificationpb.DismissNotificationRequest) (*notificationpb.DismissNotificationResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()
	notificationId := req.GetNotificationId()

	if userId == "" {
		return nil, errors.New("empty user id")
	}
	if notificationId <= 0 {
		return nil, errors.New("invalid notification id")
	}
	query = query.Where("user_id = ? and id = ?", userId, req.GetNotificationId())

	var notifications []*indexerdb.Notification
	err := query.Find(&notifications).Update("dismissed", true).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to update database")
	}
	return &notificationpb.DismissNotificationResponse{}, nil
}

func (s *NotificationService) DismissAllNotifications(ctx context.Context, req *notificationpb.DismissAllNotificationsRequest) (*notificationpb.DismissAllNotificationsResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()

	if userId == "" {
		return nil, errors.New("empty user id")
	}
	query = query.Where("user_id = ? ", userId)

	var notifications []*indexerdb.Notification
	err := query.Find(&notifications).Update("dismissed", true).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to update database")
	}
	return &notificationpb.DismissAllNotificationsResponse{}, nil
}

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

	query = query.Where("user_id = ? and dismissed = ?", userId, false)

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

func (s *NotificationService) DismissNotification(ctx context.Context, req *notificationpb.DismissNotificationRequest) (*notificationpb.DismissNotificationResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()
	notificationId := req.GetNotificationId()

	if userId == "" || notificationId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address} and a notification Id"), "need a wallet address")
	}
	query = query.Where("user_id = ? and id = ?", userId, req.GetNotificationId())

	var notifications []*indexerdb.Notification
	err := query.Find(&notifications).Update("dismissed", true).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &notificationpb.DismissNotificationResponse{
		Ok: true,
	}, nil
}

func (s *NotificationService) DismissAllNotification(ctx context.Context, req *notificationpb.NotificationsRequest) (*notificationpb.DismissNotificationResponse, error) {
	query := s.conf.IndexerDB
	userId := req.GetUserId()

	if userId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address} and a notification Id"), "need a wallet address")
	}
	query = query.Where("user_id = ? ", userId)

	var notifications []*indexerdb.Notification
	err := query.Find(&notifications).Update("dismissed", true).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &notificationpb.DismissNotificationResponse{
		Ok: true,
	}, nil
}

//func (s *NotificationService) UpdateNotifications(ctx context.Context, req *notificationpb.NotificationsRequest) (*notificationpb.DismissNotificationResponse, error) {
//	userId := req.GetUserId()
//	query := s.conf.IndexerDB
//
//	var post []*indexerdb.Post
//	if err := query.Where("created_by = ?", userId).Find(&post).Error; err != nil {
//		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address} and a notification Id"), "need a wallet address")
//	}
//
//	//pbnotifications := make([]*feedpb.Post, len(post))
//	for i, d := range post {
//		userReactions := d.UserReactions
//		for k, reaction := range userReactions {
//			print(reaction, k, i)
//
//			//notification := indexerdb.Notification{
//			//	UserId:    d.AuthorId,
//			//	Body:      userReactions,
//			//	Type:      "post-" + strconv.Itoa(int(d.Category)),
//			//	Timestamp: d.CreatedAt,
//			//	TriggerBy: userReactions.Value,
//			//}
//			//if err := s.conf.IndexerDB.Create(&notification).Error; err != nil {
//			//	return errors.Wrap(err, "failed to create post")
//			//}
//		}
//	}
//	return &notificationpb.DismissNotificationResponse{
//		Ok: true,
//	}, nil
//}

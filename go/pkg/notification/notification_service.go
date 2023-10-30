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

type NotificationService struct {
	notificationpb.UnimplementedNotificationServiceServer
	conf *Config
}

type Config struct {
	Logger       *zap.Logger
	IndexerDB    *gorm.DB
	PersistentDB *gorm.DB
	NetStore     *networks.NetworkStore
}

func NewNotificationService(ctx context.Context, conf *Config) notificationpb.NotificationServiceServer {
	return &NotificationService{
		conf: conf,
	}
}

func (s *NotificationService) Notifications(ctx context.Context, req *notificationpb.NotificationsRequest) (*notificationpb.NotificationsResponse, error) {
	query := s.conf.PersistentDB
	userId := req.GetUserId()
	if userId == "" {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address}"), "need a wallet address")
	}
	_, updateerr := s.UpdateNotifications(ctx, req)
	if updateerr != nil {
		return nil, updateerr
	}

	query = query.Where("user_id = ? and dismissed = ?", userId, false).Order("created_at desc")

	var notifications []*indexerdb.Notification
	err := query.Find(&notifications).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	pbnotifications := make([]*notificationpb.Notification, len(notifications))
	for i, d := range notifications {

		pbnotifications[i] = &notificationpb.Notification{
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
		Notifications: pbnotifications,
	}, nil
}

func (s *NotificationService) DismissNotification(ctx context.Context, req *notificationpb.DismissNotificationsRequest) (*notificationpb.DismissNotificationsResponse, error) {
	query := s.conf.PersistentDB
	userId := req.GetUserId()
	notificationId := req.GetNotificationId()

	if userId == "" || notificationId == 0 {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address} and a notification Id"), "need a wallet address")
	}
	query = query.Where("user_id = ? and id = ?", userId, req.GetNotificationId())

	var notifications []*indexerdb.Notification
	err := query.Find(&notifications).Update("dismissed", true).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &notificationpb.DismissNotificationsResponse{
		Ok: true,
	}, nil
}

func (s *NotificationService) DismissAllNotifications(ctx context.Context, req *notificationpb.NotificationsRequest) (*notificationpb.DismissNotificationsResponse, error) {
	query := s.conf.PersistentDB
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
	return &notificationpb.DismissNotificationsResponse{
		Ok: true,
	}, nil
}

func (s *NotificationService) UpdateNotifications(ctx context.Context, req *notificationpb.NotificationsRequest) (*notificationpb.DismissNotificationsResponse, error) {
	userId := req.GetUserId()
	query := s.conf.IndexerDB

	var post []*indexerdb.Post
	if err := query.Where("author_id = ?", userId).Find(&post).Error; err != nil {
		return nil, errors.Wrap(errors.New("need a user id tori-{wallet_address} and a notification Id"), "need a wallet address")
	}

	for _, d := range post {
		createComment(d, userId, s)
		createReaction(d, userId, s)
	}
	return &notificationpb.DismissNotificationsResponse{
		Ok: true,
	}, nil
}

func createComment(d *indexerdb.Post, userId string, s *NotificationService) {

	query := s.conf.IndexerDB
	var comments []*indexerdb.Post
	query.Where("parent_post_identifier = ? and author_id != ?", d.Identifier, userId).Find(&comments)

	for _, d := range comments {

		notification := indexerdb.Notification{
			UserId:    networks.UserID(userId),
			TriggerBy: d.AuthorId,
			Body:      "comment-" + d.ParentPostIdentifier + "-" + d.Identifier,
			Action:    d.ParentPostIdentifier,
			Category:  "comment",
			CreatedAt: d.CreatedAt,
		}
		s.conf.PersistentDB.Create(&notification)

	}
}

func createReaction(d *indexerdb.Post, userId string, s *NotificationService) {
	userReactions := d.UserReactions
	for emoji, users := range userReactions {

		for _, user := range users.([]interface{}) {
			notification := indexerdb.Notification{
				UserId:    networks.UserID(userId),
				TriggerBy: networks.UserID(user.(string)),
				Body:      emoji,
				Action:    d.Identifier,
				Category:  "reaction",
				CreatedAt: d.CreatedAt,
			}
			s.conf.PersistentDB.Create(&notification)
			//if err := s.conf.PersistentDB.Create(&notification).Error; err != nil && !errors.Is(err, gorm.ErrDuplicatedKey) {
			//	return nil, errors.Wrap(errors.New(err.Error()), "Create notification record error")
			//}
		}

	}
}

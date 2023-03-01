package feed

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/feedpb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type FeedService struct {
	feedpb.UnimplementedFeedServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewFeedService(ctx context.Context, conf *Config) feedpb.FeedServiceServer {
	// FIXME: validate config
	return &FeedService{
		conf: conf,
	}
}

func (s *FeedService) Posts(ctx context.Context, req *feedpb.PostsRequest) (*feedpb.PostsResponse, error) {
	filter := req.GetFilter()
	var categories []uint32
	var user string
	var hashtags []string

	if filter != nil {
		categories = filter.Categories
		user = filter.User
		hashtags = filter.Hashtags
	}

	limit := req.GetLimit()
	if limit <= 0 {
		limit = 10
	}
	offset := req.GetOffset()
	if offset <= 0 {
		offset = 0
	}

	query := s.conf.IndexerDB
	if len(categories) > 0 {
		query = query.Where("category IN ?", categories)
	}
	if user != "" {
		query = query.Where("created_by = ?", user)
	}
	if len(hashtags) > 0 {
		formattedHashtags := make([]string, 0)
		for _, hashtag := range hashtags {
			if hashtag != "" {
				formattedHashtags = append(formattedHashtags, fmt.Sprintf("'%s'", hashtag))
			}
		}

		query = query.Where(fmt.Sprintf("metadata -> 'hashtags' ?| array[%s]", strings.Join(formattedHashtags, ",")))
	}

	query = query.
		Order("created_at desc").
		Limit(int(limit)).
		Offset(int(offset))

	var dbPosts []indexerdb.Post
	if err := query.Find(&dbPosts).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query posts")
	}

	posts := make([]*feedpb.Post, len(dbPosts))
	for idx, dbPost := range dbPosts {
		var reactions []*feedpb.Reaction
		for icon, users := range dbPost.UserReactions {
			reactions = append(reactions, &feedpb.Reaction{
				Icon:  icon,
				Count: uint32(len(users.([]interface{}))),
			})
		}

		medadata, err := json.Marshal(dbPost.Metadata)
		if err != nil {
			return nil, err
		}

		posts[idx] = &feedpb.Post{
			Category:             dbPost.Category,
			IsDeleted:            dbPost.IsDeleted,
			Identifier:           dbPost.Identifier,
			Metadata:             string(medadata),
			ParentPostIdentifier: dbPost.ParentPostIdentifier,
			CreatedBy:            string(dbPost.CreatedBy),
			CreatedAt:            dbPost.CreatedAt,
			Reactions:            reactions,
		}
	}

	return &feedpb.PostsResponse{Posts: posts}, nil
}

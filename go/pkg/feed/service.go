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

type DBPostWithExtra struct {
	indexerdb.Post
	SubPostLength uint32
}

func NewFeedService(ctx context.Context, conf *Config) feedpb.FeedServiceServer {
	// FIXME: validate config
	return &FeedService{
		conf: conf,
	}
}

func (s *FeedService) Posts(ctx context.Context, req *feedpb.PostsRequest) (*feedpb.PostsResponse, error) {
	filter := req.GetFilter()
	var user string
	var mentions []string
	var categories []uint32
	var hashtags []string

	if filter != nil {
		categories = filter.Categories
		user = filter.User
		hashtags = filter.Hashtags
		mentions = filter.Mentions
	}

	limit := req.GetLimit()
	if limit <= 0 {
		limit = 10
	}
	offset := req.GetOffset()
	if offset <= 0 {
		offset = 0
	}

	query := s.conf.IndexerDB.
		Table("posts as p1").
		Select(`
			p1.*,
			(
				SELECT COUNT(p2.identifier) AS sub_post_length
				FROM posts p2
				WHERE p2.parent_post_identifier = p1.identifier
			)
		`)

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
	if len(mentions) > 0 {
		formattedMentions := make([]string, 0)
		for _, mention := range mentions {
			if mention != "" {
				formattedMentions = append(formattedMentions, fmt.Sprintf("'%s'", mention))
			}
		}
		query = query.Where(fmt.Sprintf("metadata -> 'mentions' ?| array[%s]", strings.Join(formattedMentions, ",")))
	}

	query = query.
		Order("created_at desc").
		Limit(int(limit)).
		Offset(int(offset))

	var dbPostWithExtras []DBPostWithExtra
	if err := query.Find(&dbPostWithExtras).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query posts")
	}

	posts := make([]*feedpb.Post, len(dbPostWithExtras))
	for idx, dbPost := range dbPostWithExtras {
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
			SubPostLength:        dbPost.SubPostLength,
			CreatedBy:            string(dbPost.CreatedBy),
			CreatedAt:            dbPost.CreatedAt,
			Reactions:            reactions,
		}
	}

	return &feedpb.PostsResponse{Posts: posts}, nil
}

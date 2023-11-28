package feed

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/feedpb"
	"github.com/dgraph-io/ristretto"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type FeedService struct {
	feedpb.UnimplementedFeedServiceServer
	conf  *Config
	cache *ristretto.Cache
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
	PinataJWT string
}

type DBPostWithExtra struct {
	indexerdb.Post
	SubPostLength uint32
}

func NewFeedService(ctx context.Context, conf *Config) feedpb.FeedServiceServer {
	cache, err := ristretto.NewCache(&ristretto.Config{
		NumCounters: 1e7,
		MaxCost:     1 << 30,
		BufferItems: 64,
	})
	if err != nil {
		panic(fmt.Sprintf("failed to created cache: %s", err))
	}

	// FIXME: validate config
	return &FeedService{
		conf:  conf,
		cache: cache,
	}
}

func (s *FeedService) IPFSKey(ctx context.Context, req *feedpb.IPFSKeyRequest) (*feedpb.IPFSKeyResponse, error) {
	userId := req.GetUserId()
	cacheKey := fmt.Sprintf("pinata_jwt_%s", userId)

	cachedJWT, ok := s.cache.Get(cacheKey)
	if ok {
		return &feedpb.IPFSKeyResponse{
			Jwt: cachedJWT.(string),
		}, nil
	}

	pinata := NewPinataService(s.conf.PinataJWT)
	credential, err := pinata.GenerateAPIKey()
	if err != nil {
		return nil, errors.Wrap(err, "failed to generate api key")
	}

	// With normal upload flow, suppose that time between posts always > TTL => we always generate a new key
	// In abnormal case, time < TTL then we return the cached key, the worst case user still have 4s to make the upload request
	s.cache.SetWithTTL(cacheKey, credential.JWT, 0, time.Second*(KEY_TTL-4))

	return &feedpb.IPFSKeyResponse{
		Jwt: credential.JWT,
	}, nil
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

	queryUserID := req.GetQueryUserId()

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
		Where("p1.parent_post_identifier = ?", "").
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
		query = query.Where("author_id = ?", user)
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
		Order("created_at DESC").
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
			ownState := false
			if queryUserID != "" {
				// TODO: create a reactions table to store user reactions and have performant query
				for _, user := range users.([]interface{}) {
					if user.(string) == queryUserID {
						ownState = true
						break
					}
				}
			}
			reactions = append(reactions, &feedpb.Reaction{
				Icon:     icon,
				Count:    uint32(len(users.([]interface{}))),
				OwnState: ownState,
			})
		}

		metadata, err := json.Marshal(dbPost.Metadata)
		if err != nil {
			return nil, err
		}

		posts[idx] = &feedpb.Post{
			Category:             dbPost.Category,
			IsDeleted:            dbPost.IsDeleted,
			Identifier:           dbPost.Identifier,
			Metadata:             string(metadata),
			ParentPostIdentifier: dbPost.ParentPostIdentifier,
			SubPostLength:        dbPost.SubPostLength,
			AuthorId:             string(dbPost.AuthorId),
			CreatedAt:            dbPost.CreatedAt,
			Reactions:            reactions,
			TipAmount:            dbPost.TipAmount,
		}
	}

	return &feedpb.PostsResponse{Posts: posts}, nil
}

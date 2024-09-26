package feed

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/feedpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
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
	Networks  networks.NetworkStore
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
	var (
		networkId       string
		user            string
		mentions        []string
		categories      []uint32
		hashtags        []string
		premiumLevelMin int32
		premiumLevelMax int32
	)

	if filter != nil {
		networkId = filter.NetworkId
		categories = filter.Categories
		user = filter.User
		hashtags = filter.Hashtags
		mentions = filter.Mentions
		premiumLevelMin = filter.PremiumLevelMin
		premiumLevelMax = filter.PremiumLevelMax
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
				SELECT COUNT(p2.local_identifier) AS sub_post_length
				FROM posts p2
				WHERE p2.parent_post_identifier = p1.local_identifier AND p2.network_id = p1.network_id
			)
		`)

	if len(categories) > 0 {
		query = query.Where("category IN ?", categories)
	}
	if user != "" {
		query = query.Where("author_id = ?", user)
	}
	if networkId != "" {
		query = query.Where("network_id = ?", networkId)
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

	if premiumLevelMin > 0 {
		query = query.Where("premium_level >= ?", premiumLevelMin)
	}
	if premiumLevelMax >= 0 {
		query = query.Where("premium_level <= ?", premiumLevelMax)
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
		reactionsMap := map[string]interface{}{}
		dbPost.UserReactions.Scan(&reactionsMap)
		for icon, users := range reactionsMap {
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

		n, err := s.conf.Networks.GetNetwork(dbPost.NetworkID)
		if err != nil {
			return nil, errors.Wrap(err, "failed to get post network")
		}

		posts[idx] = &feedpb.Post{
			Id:                   string(n.GetBase().PostID(dbPost.LocalIdentifier)),
			Category:             dbPost.Category,
			IsDeleted:            dbPost.IsDeleted,
			Identifier:           dbPost.LocalIdentifier,
			LocalIdentifier:      dbPost.LocalIdentifier,
			NetworkId:            dbPost.NetworkID,
			Metadata:             string(metadata),
			ParentPostIdentifier: dbPost.ParentPostIdentifier,
			SubPostLength:        dbPost.SubPostLength,
			AuthorId:             string(dbPost.AuthorId),
			CreatedAt:            dbPost.CreatedAt,
			Reactions:            reactions,
			TipAmount:            dbPost.TipAmount,
			PremiumLevel:         dbPost.PremiumLevel,
		}
	}

	return &feedpb.PostsResponse{Posts: posts}, nil
}

func (s *FeedService) PostsWithLocation(ctx context.Context, data *feedpb.PostsWithLocationRequest) (*feedpb.PostsWithLocationResponse, error) {
	locationFilter := locationFilter(data)
	totalPosts, err := s.getPostsCountWithLocationFilter(data.NetworkId, locationFilter)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get posts with location filter")
	}

	if totalPosts > 250 {
		//Load heatmap
		return s.loadHeatMap(data)
	}

	return s.loadDetailedPosts(data, locationFilter)
}
func (s *FeedService) getPostsWithLocationFilter(networkID string, locationFilter *locationQueryData) ([]indexerdb.Post, error) {
	posts := make([]indexerdb.Post, 0)
	cachekey := fmt.Sprintf("%s/%s", networkID, locationFilter.cacheKey())
	data, ok := s.cache.Get(cachekey)
	if ok {
		return data.([]indexerdb.Post), nil
	}
	query := s.conf.IndexerDB.Model(&indexerdb.Post{})
	if networkID != "" {
		query = query.Where("network_id = ?", networkID)
	}
	err := query.Where("lat_int < ? AND lat_int > ? AND lng_int < ? AND lng_int > ? AND  lat_int <> 0 AND lng_int <> 0 ", locationFilter.N, locationFilter.S, locationFilter.E, locationFilter.W).Find(&posts).Error
	if err != nil {
		return nil, err
	}

	s.cache.SetWithTTL(cachekey, posts, 0, time.Minute*5)

	return posts, nil
}

func (s *FeedService) getPostsCountWithLocationFilter(networkID string, locationFilter *locationQueryData) (int64, error) {
	cachekey := fmt.Sprintf("%s/%s", networkID, locationFilter.countCacheKey())
	data, ok := s.cache.Get(cachekey)
	if ok {
		return data.(int64), nil
	}
	var totalPost int64

	query := s.conf.IndexerDB.Model(&indexerdb.Post{})
	if networkID != "" {
		query = query.Where("network_id = ?", networkID)
	}
	err := query.Where("lat_int < ? AND lat_int > ? AND lng_int < ? AND lng_int > ?", locationFilter.N, locationFilter.S, locationFilter.E, locationFilter.W).Count(&totalPost).Error
	if err != nil {
		return 0, err
	}

	s.cache.SetWithTTL(cachekey, totalPost, 0, time.Minute*5)

	return totalPost, nil
}

const agregatedPostQuery = `
with post_with_cluster as (
	select *,(p.lat/$5)::int lat_cluster,(p.lng/$6)::int long_cluster from posts p 
	where network_id = $7 p.lat_int >= $2 and p.lat_int <=$1 and p.lng_int <=$3 and p.lng_int >=$4
)
select avg(post_with_cluster.lat) lat ,avg(post_with_cluster.lng) long,count(*) total_points, 
post_with_cluster.lat_cluster, post_with_cluster.long_cluster
from post_with_cluster group by post_with_cluster.lat_cluster,post_with_cluster.long_cluster
`

/*
loadHeatMap

	 _______
	|       |
	|       |ySquare
	|_______|
	 xSquare

divide the entire world latitude & longitude on  squares and agregate the posts on them
*/
func (s *FeedService) loadHeatMap(data *feedpb.PostsWithLocationRequest) (*feedpb.PostsWithLocationResponse, error) {
	aggregatedPosts := []*feedpb.AggregatedPost{}
	latitudeClusterNumber := 30
	longitudeClusterNumber := 60
	xSquare := 360.0 / longitudeClusterNumber
	ySquare := 180.0 / latitudeClusterNumber

	err := s.conf.IndexerDB.Raw(agregatedPostQuery, data.North, data.South, data.East, data.West, ySquare, xSquare, data.NetworkId).Scan(&aggregatedPosts).Error
	if err != nil {
		fmt.Printf("error: %s\n", err.Error())
		return nil, err
	}

	return &feedpb.PostsWithLocationResponse{
		AggregatedPosts: aggregatedPosts,
		IsAggregated:    true,
	}, nil
}

func (s *FeedService) loadDetailedPosts(data *feedpb.PostsWithLocationRequest, locationFilter *locationQueryData) (*feedpb.PostsWithLocationResponse, error) {
	posts, err := s.getPostsWithLocationFilter(data.NetworkId, locationFilter)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get posts with location filter")
	}
	res := &feedpb.PostsWithLocationResponse{
		Posts: make([]*feedpb.Post, 0, len(posts)),
	}

	for _, post := range posts {
		if post.Lat > float64(data.North) || post.Lat < float64(data.South) || post.Lng > float64(data.East) || post.Lng < float64(data.West) {
			continue
		}

		n, err := s.conf.Networks.GetNetwork(post.NetworkID)
		if err != nil {
			return nil, errors.Wrap(err, "failed to get post network")
		}

		res.Posts = append(res.Posts, &feedpb.Post{
			Id:                   string(n.GetBase().PostID(post.LocalIdentifier)),
			Category:             post.Category,
			IsDeleted:            post.IsDeleted,
			Identifier:           post.LocalIdentifier,
			LocalIdentifier:      post.LocalIdentifier,
			NetworkId:            post.NetworkID,
			Metadata:             string(post.Metadata),
			ParentPostIdentifier: post.ParentPostIdentifier,
			AuthorId:             string(post.AuthorId),
			CreatedAt:            post.CreatedAt,
			Reactions:            nil,
			TipAmount:            post.TipAmount,
			PremiumLevel:         post.PremiumLevel,
		})
	}

	return res, nil
}
func (data *locationQueryData) countCacheKey() string {
	return "count_" + data.cacheKey()
}
func (data *locationQueryData) cacheKey() string {
	return fmt.Sprintf("%d_%d_%d_%d", data.N, data.S, data.W, data.E)
}

func locationFilter(data *feedpb.PostsWithLocationRequest) *locationQueryData {
	return &locationQueryData{
		N: getNextTenth(int(data.North)),
		S: getLowerTenth(int(data.South)),
		W: getLowerTenth(int(data.West)),
		E: getNextTenth(int(data.East)),
	}
}

type locationQueryData struct {
	N int
	S int
	W int
	E int
}

// getNextTenth return the nearest upper 10 divisible number ex= 43 -> 50 40 -> 40
func getNextTenth(number int) int {
	return (number + 10) / 10 * 10
}

func getLowerTenth(number int) int {
	return (number - 10) / 10 * 10
}

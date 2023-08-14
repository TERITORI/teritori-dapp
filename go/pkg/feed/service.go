package feed

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
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
	Logger     *zap.Logger
	IndexerDB  *gorm.DB
	PinataJWT  string
	ChatApiKey string
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
			reactions = append(reactions, &feedpb.Reaction{
				Icon:  icon,
				Count: uint32(len(users.([]interface{}))),
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

type CreateCompletionsRequest struct {
	Model            string            `json:"model,omitempty"`
	Prompt           string            `json:"prompt,omitempty"`
	Messages         []Message         `json:"messages,omitempty"`
	Suffix           string            `json:"suffix,omitempty"`
	MaxTokens        int               `json:"max_tokens,omitempty"`
	Temperature      float64           `json:"temperature,omitempty"`
	TopP             float64           `json:"top_p,omitempty"`
	N                int               `json:"n,omitempty"`
	Stream           bool              `json:"stream,omitempty"`
	LogProbs         int               `json:"logprobs,omitempty"`
	Echo             bool              `json:"echo,omitempty"`
	PresencePenalty  float64           `json:"presence_penalty,omitempty"`
	FrequencyPenalty float64           `json:"frequency_penalty,omitempty"`
	BestOf           int               `json:"best_of,omitempty"`
	LogitBias        map[string]string `json:"logit_bias,omitempty"`
	User             string            `json:"user,omitempty"`
}
type CreateCompletionsResponse struct {
	ID      string `json:"id,omitempty"`
	Object  string `json:"object,omitempty"`
	Created int    `json:"created,omitempty"`
	Model   string `json:"model,omitempty"`
	Choices []struct {
		Message struct {
			Role    string `json:"role,omitempty"`
			Content string `json:"content,omitempty"`
		} `json:"message"`
		Text         string      `json:"text,omitempty"`
		Index        int         `json:"index,omitempty"`
		Logprobs     interface{} `json:"logprobs,omitempty"`
		FinishReason string      `json:"finish_reason,omitempty"`
	} `json:"choices,omitempty"`
	Usage struct {
		PromptTokens     int `json:"prompt_tokens,omitempty"`
		CompletionTokens int `json:"completion_tokens,omitempty"`
		TotalTokens      int `json:"total_tokens,omitempty"`
	} `json:"usage,omitempty"`

	Error Error `json:"error,omitempty"`
}
type Error struct {
	Message string      `json:"message,omitempty"`
	Type    string      `json:"type,omitempty"`
	Param   interface{} `json:"param,omitempty"`
	Code    interface{} `json:"code,omitempty"`
}

type Message struct {
	Role    string `json:"role,omitempty"`
	Content string `json:"content,omitempty"`
}

func (s *FeedService) ChatBot(ctx context.Context, req *feedpb.ChatBotRequest) (*feedpb.ChatBotResponse, error) {
	apiKey := s.conf.ChatApiKey
	url := "https://api.openai.com/v1/completions"
	response := make([]byte, 0)
	input := CreateCompletionsRequest{
		Model:       "text-davinci-003",
		Prompt:      req.GetQuestion(),
		Temperature: 0.7,
	}
	rJson, err := json.Marshal(input)
	if err != nil {
		return nil, err
	}
	body := bytes.NewReader(rJson)
	req1, err1 := http.NewRequest(http.MethodPost, url, body)
	if err != nil {
		return nil, err1
	}

	req1.Header.Add("Authorization", "Bearer "+apiKey)
	req1.Header.Add("Content-Type", "application/json")
	client := &http.Client{}
	resp, err2 := client.Do(req1)
	if err2 != nil {
		return nil, err2
	}
	defer resp.Body.Close()
	response, err3 := io.ReadAll(resp.Body)
	if err3 != nil {
		return nil, err3
	}
	res3 := CreateCompletionsResponse{}
	err = json.Unmarshal(response, &res3)
	if err != nil {
		return nil, err
	}
	if res3.Error.Message != "" {
		return nil, errors.New(res3.Error.Message)
	}
	return &feedpb.ChatBotResponse{Answer: res3.Choices[0].Text}, nil
}

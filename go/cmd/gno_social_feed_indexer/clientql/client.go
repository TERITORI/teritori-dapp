package clientql

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/gnoindexerql"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type IndexerQL struct {
	gqlClient graphql.Client
	db        *gorm.DB
	network   networks.GnoNetwork
	logger    *zap.Logger
}

func New(network networks.GnoNetwork, graphqlEndpoint string, db *gorm.DB, logger *zap.Logger) *IndexerQL {
	gqlClient := graphql.NewClient(graphqlEndpoint, nil)
	return &IndexerQL{gqlClient: gqlClient, db: db, network: network, logger: logger}
}

func (client *IndexerQL) SyncPosts() error {
	/*
		    // FIXME: this is mixing height and timestamp, we need to redo this
				lastPost := client.getLastPost()
					var fromBlock int
					if lastPost != nil {
						fromBlock = int(lastPost.CreatedAt) + 1
					}
	*/

	block := 0                                    // FIXME: use cursor instead
	pkgPath := "gno.land/r/teritori/social_feeds" // FIXME: get from network feature

	client.logger.Info("fetching", zap.Int("block", block), zap.String("pkg_path", pkgPath))

	posts, err := gnoindexerql.GetPostTransactions(context.Background(), client.gqlClient, block, pkgPath)
	if err != nil {
		return err
	}

	count := 0
	for _, transaction := range posts.Transactions {
		for _, post := range transaction.Messages {

			data, ok := post.Value.(*gnoindexerql.GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall)
			if !ok {
				client.logger.Error("failed to get data from post", zap.String("hash", transaction.Hash))
				continue
			}
			post, err := client.getPostWithData(data, transaction)
			if err != nil {
				return err
			}

			err = client.db.Save(&post).Error
			if err != nil {
				return err
			}

			count += 1
		}
	}
	client.logger.Info("saved posts", zap.Int("count", count))

	return nil
}

func (client *IndexerQL) getLastPost() *indexerdb.Post {
	post := &indexerdb.Post{}
	client.db.Order("created_at desc").Find(post)

	return post
}

func (client *IndexerQL) getPostWithData(data *gnoindexerql.GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall, transaction gnoindexerql.GetPostTransactionsTransactionsTransaction) (indexerdb.Post, error) {
	if len(data.Args) != 4 {
		return indexerdb.Post{}, fmt.Errorf("invalid args length")
	}
	categoryID, _ := strconv.Atoi(data.Args[2])
	var metadata metadata
	err := json.Unmarshal([]byte(data.Args[3]), &metadata)
	if err != nil {
		return indexerdb.Post{}, err
	}
	metadataJSON, err := json.Marshal(metadata)
	if err != nil {
		return indexerdb.Post{}, err
	}

	postID, err := extractPostIdentifierFromData(transaction.Response.Data)
	if err != nil {
		return indexerdb.Post{}, errors.Join(errors.New("failed to extra post id"), err)
	}

	post := indexerdb.Post{
		NetworkID:            client.network.ID,
		LocalIdentifier:      postID,
		ParentPostIdentifier: data.Args[1],
		Category:             uint32(categoryID),
		Metadata:             metadataJSON,
		CreatedAt:            int64(transaction.Block_height),
		AuthorId:             client.network.UserID(data.Caller),
	}

	if len(metadata.Location) == 2 {
		post.Lat = metadata.Location[0]
		post.Lng = metadata.Location[1]
		post.LatInt = int(metadata.Location[0])
		post.LngInt = int(metadata.Location[1])
	}

	return post, nil

}

func extractPostIdentifierFromData(data string) (string, error) {
	if len(data) < 2 {
		return "", fmt.Errorf("data too short: %q", data)
	}
	data = data[1:]
	parts := strings.SplitN(data, " ", 2)
	if len(parts) < 1 {
		return "", fmt.Errorf("not enough parts in %q", data)
	}
	return parts[0], nil
}

type metadata struct {
	Message string `json:"message"`
	Files   []struct {
		FileName string `json:"fileName"`
		URL      string `json:"url"`
		MimeType string `json:"mimeType"`
		Size     int    `json:"size"`
		FileType string `json:"fileType"`
	} `json:"files"`
	Gifs      []any     `json:"gifs"`
	Hashtags  []any     `json:"hashtags"`
	Mentions  []any     `json:"mentions"`
	Location  []float64 `json:"location"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"createdAt"`
}

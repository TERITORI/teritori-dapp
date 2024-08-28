package clientql

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
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
	networkID string
	logger    *zap.SugaredLogger
}

func New(networkID string, graphqlEndpoint string, db *gorm.DB, logger *zap.SugaredLogger) *IndexerQL {
	gqlClient := graphql.NewClient(graphqlEndpoint, nil)
	return &IndexerQL{gqlClient: gqlClient, db: db, networkID: networkID, logger: logger}
}

func (client *IndexerQL) SyncPosts() error {
	lastPost := client.getLastPost()
	var fromBlock int
	if lastPost != nil {
		fromBlock = int(lastPost.CreatedAt) + 1
	}

	posts, err := gnoindexerql.GetPostTransactions(context.Background(), client.gqlClient, fromBlock)
	if err != nil {
		return err
	}

	for _, transaction := range posts.Transactions {
		for _, post := range transaction.Messages {

			data, ok := post.Value.(*gnoindexerql.GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall)
			if !ok {
				client.logger.Errorf("failed to get data from post %s", transaction.Hash)
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
		}
	}

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
	post := indexerdb.Post{
		Identifier:           fmt.Sprintf("%s-%s", data.Caller, transaction.Hash),
		ParentPostIdentifier: data.Args[1],
		Category:             uint32(categoryID),
		Metadata:             metadataJSON,
		NetworkID:            client.networkID,
		CreatedAt:            int64(transaction.Block_height),
		AuthorId:             networks.UserID(data.Caller),
	}

	if len(metadata.Location) == 2 {
		post.Lat = metadata.Location[0]
		post.Lng = metadata.Location[1]
		post.LatInt = int(metadata.Location[0])
		post.LngInt = int(metadata.Location[1])
	}

	return post, nil

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

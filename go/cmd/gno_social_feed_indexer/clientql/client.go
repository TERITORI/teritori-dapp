package clientql

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	indexerql "github.com/TERITORI/teritori-dapp/go/pkg/indexerQL"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type IndexerQL struct {
	gqlClient graphql.Client
	db        *gorm.DB
	networkID string
}

func New(networkID string, graphqlEndpoint string, db *gorm.DB) *IndexerQL {
	gqlClient := graphql.NewClient(graphqlEndpoint, nil)
	return &IndexerQL{gqlClient: gqlClient, db: db, networkID: networkID}
}

func (client *IndexerQL) SyncPosts() error {
	lastPost := client.getLastPost()
	var fromBlock int
	if lastPost != nil {
		fromBlock = int(lastPost.CreatedAt) + 1
	}

	posts, err := indexerql.GetPostTransactions(context.Background(), client.gqlClient, fromBlock)
	if err != nil {
		return err
	}

	for _, transaction := range posts.Transactions {
		for _, post := range transaction.Messages {
			data, ok := post.Value.(*indexerql.GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall)
			if !ok {
				fmt.Println("not ok, skipping")
				continue
			}
			post, err := client.getPostWithData(data, int(transaction.Block_height))
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
	client.db.Last(post)

	return post
}

func (client *IndexerQL) getPostWithData(data *indexerql.GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall, blockHeight int) (indexerdb.Post, error) {
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
		Identifier:           uuid.Must(uuid.NewV4()).String(),
		ParentPostIdentifier: data.Args[1],
		Category:             uint32(categoryID),
		Metadata:             metadataJSON,
		NetworkID:            client.networkID,
		CreatedAt:            int64(blockHeight),
		AuthorId:             networks.UserID(data.Caller),
	}

	if len(metadata.Location) == 2 {
		post.Lat = metadata.Location[0]
		post.Lng = metadata.Location[1]
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

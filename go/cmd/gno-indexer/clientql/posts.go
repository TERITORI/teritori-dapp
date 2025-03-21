package clientql

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/gnoindexerql"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func (client *IndexerQL) SyncPosts() error {
	block := 0 // FIXME: use cursor instead, since we use our own indexers, we can hammer them in the meantime

	if client.network.SocialFeedsPkgPath == nil {
		return errors.New("this network does not support social feeds")
	}
	pkgPath := *client.network.SocialFeedsPkgPath

	client.logger.Info("fetching posts", zap.Int("block", block), zap.String("pkg_path", pkgPath))

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

func (client *IndexerQL) getPostWithData(data *gnoindexerql.GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall, transaction gnoindexerql.GetPostTransactionsTransactionsTransaction) (indexerdb.Post, error) {
	if len(data.Args) != 4 {
		return indexerdb.Post{}, fmt.Errorf("invalid args length")
	}
	categoryID, _ := strconv.Atoi(data.Args[2])
	var metadata postMetadata
	metadataBytes := []byte(data.Args[3])
	if err := json.Unmarshal(metadataBytes, &metadata); err != nil {
		// we ignore malformed metadata since users can put anything in this field
		client.logger.Warn("failed to unmarshal post metadata", zap.Error(err))
		metadataBytes = []byte("{}")
	}

	postID, err := extractPostIdentifierFromData(transaction.Response.Data)
	if err != nil {
		return indexerdb.Post{}, errors.Wrap(err, "failed to extract post id")
	}

	post := indexerdb.Post{
		NetworkID:            client.network.ID,
		LocalIdentifier:      postID,
		ParentPostIdentifier: data.Args[1],
		Category:             uint32(categoryID),
		Metadata:             metadataBytes,
		CreatedAt:            int64(transaction.Block_height), // FIXME
		AuthorId:             client.network.UserID(data.Caller),
	}

	location := metadata.Location
	if len(location) >= 2 {
		post.Lat = location[0]
		post.Lng = location[1]
		post.LatInt = int(location[0])
		post.LngInt = int(location[1])
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

type postMetadata struct {
	Message string `json:"message"`
	Files   []struct {
		FileName string `json:"fileName"`
		URL      string `json:"url"`
		MimeType string `json:"mimeType"`
		Size     int    `json:"size"`
		FileType string `json:"fileType"`
	} `json:"files"`
	Gifs     []any     `json:"gifs"`
	Hashtags []any     `json:"hashtags"`
	Mentions []any     `json:"mentions"`
	Location []float64 `json:"location"`
	Title    string    `json:"title"`
}

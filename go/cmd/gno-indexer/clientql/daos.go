package clientql

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/gnoindexerql"
	"go.uber.org/zap"
)

func (client *IndexerQL) SyncDAOs() error {
	block := 0 // FIXME: use cursor instead, since we use our own indexers, we can hammer them in the meantime

	client.logger.Info("fetching daos", zap.Int("block", block))

	posts, err := gnoindexerql.GetDAOsTransactions(context.Background(), client.gqlClient, block)
	if err != nil {
		return err
	}

	count := 0
	for _, transaction := range posts.Transactions {
		for _, txmsg := range transaction.Messages {

			data, ok := txmsg.Value.(*gnoindexerql.GetDAOsTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage)
			if !ok {
				client.logger.Error("failed to get data from post", zap.String("hash", transaction.Hash))
				continue
			}

			dao := indexerdb.DAO{
				NetworkID:       client.network.ID,
				ContractAddress: data.Package.Path,
			}

			err = client.db.Save(&dao).Error
			if err != nil {
				return err
			}

			count += 1
		}
	}
	client.logger.Info("saved daos", zap.Int("count", count))

	return nil
}

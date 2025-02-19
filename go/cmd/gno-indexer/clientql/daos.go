package clientql

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/gnoindexerql"
	"go.uber.org/zap"
	"golang.org/x/exp/slices"
	"gorm.io/gorm"
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

			membersTxs, err := gnoindexerql.GetDAOMembersTransactions(context.Background(), client.gqlClient, dao.ContractAddress)
			if err != nil {
				return err
			}
			members := map[string]struct{}{}
			for _, transaction := range membersTxs.Transactions {
				for _, ievent := range transaction.Response.Events {
					event, ok := ievent.(*gnoindexerql.GetDAOMembersTransactionsTransactionsTransactionResponseEventsGnoEvent)
					if !ok {
						client.logger.Error("failed to get data from event", zap.String("hash", transaction.Hash))
						continue
					}
					if event.Pkg_path != dao.ContractAddress {
						continue
					}
					if !slices.Contains([]string{"BaseDAOAddMember", "BaseDAORemoveMember"}, event.Type) {
						continue
					}
					addrIdx := slices.IndexFunc(event.Attrs, func(attr gnoindexerql.GetDAOMembersTransactionsTransactionsTransactionResponseEventsGnoEventAttrsGnoEventAttribute) bool {
						return attr.Key == "address"
					})
					if addrIdx == -1 {
						continue
					}
					memberAddr := event.Attrs[addrIdx].Value
					if event.Type == "BaseDAOAddMember" {
						members[memberAddr] = struct{}{}
					} else if event.Type == "BaseDAORemoveMember" {
						delete(members, memberAddr)
					}
				}
			}

			daoMembers := []*indexerdb.DAOMember{}
			for member := range members {
				daoMembers = append(daoMembers, &indexerdb.DAOMember{
					DAONetworkID:       dao.NetworkID,
					DAOContractAddress: dao.ContractAddress,
					MemberAddress:      member,
				})
			}

			if err := client.db.Transaction(func(tx *gorm.DB) error {
				if err := tx.Save(&dao).Error; err != nil {
					return err
				}
				if err := tx.Delete(&indexerdb.DAOMember{}, "dao_network_id = ? AND dao_contract_address = ?", dao.NetworkID, dao.ContractAddress).Error; err != nil {
					return err
				}
				if err := tx.Save(daoMembers).Error; err != nil {
					return err
				}
				return nil
			}); err != nil {
				client.logger.Error("failed to save dao and members", zap.Error(err), zap.String("hash", transaction.Hash))
			}

			count += 1
		}
	}
	client.logger.Info("saved daos", zap.Int("count", count))

	return nil
}

package indexeraction

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type IndexerAction struct {
	network       *networks.NetworkBase
	dbTransaction *gorm.DB
	logger        *zap.Logger
}

func NewIndexerAction(network *networks.NetworkBase, dbTransaction *gorm.DB, logger *zap.Logger) (*IndexerAction, error) {
	return &IndexerAction{
		network:       network,
		dbTransaction: dbTransaction,
		logger:        logger,
	}, nil
}

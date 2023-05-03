package indexerutils

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type IndexerUtils struct {
	network       *networks.NetworkBase
	dbTransaction *gorm.DB
	logger        *zap.Logger
}

func NewIndexerUtils(network *networks.NetworkBase, dbTransaction *gorm.DB, logger *zap.Logger) (*IndexerUtils, error) {
	return &IndexerUtils{
		network:       network,
		dbTransaction: dbTransaction,
		logger:        logger,
	}, nil
}

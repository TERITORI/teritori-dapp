package handlers

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Handler struct {
	Logger       *zap.Logger
	Network      *networks.EthereumNetwork
	NetworkStore *networks.NetworkStore
	IndexerDB    *gorm.DB
}

func NewHandler(logger *zap.Logger, network *networks.EthereumNetwork, networkStore *networks.NetworkStore, indexerDB *gorm.DB) (*Handler, error) {
	return &Handler{
		Logger:       logger,
		Network:      network,
		NetworkStore: networkStore,
		IndexerDB:    indexerDB,
	}, nil
}

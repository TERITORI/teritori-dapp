package clientql

import (
	"github.com/Khan/genqlient/graphql"
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

package collections

import (
	"context"
	"time"

	"github.com/volatiletech/sqlboiler/v4/queries"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/internal/ipfsutil"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type teritoriCollectionsProvider struct {
	indexerDB *gorm.DB
	logger    *zap.Logger
}

var _ CollectionsProvider = (*teritoriCollectionsProvider)(nil)

func NewTeritoriCollectionsProvider(indexerDB *gorm.DB, logger *zap.Logger) CollectionsProvider {
	return &teritoriCollectionsProvider{
		indexerDB: indexerDB,
		logger:    logger,
	}
}

// Collection is an object representing the database table.
type DBCollectionWithExtra struct {
	Network             string
	ID                  string
	Name                string
	ImageURI            string
	Volume              string
	MintContractAddress string
}

func (p *teritoriCollectionsProvider) Collections(limit int, offset int) chan *marketplacepb.Collection {
	ch := make(chan *marketplacepb.Collection)

	db, err := p.indexerDB.DB()
	if err != nil {
		p.logger.Error("failed to get database from gorm.DB object", zap.Error(err))
		close(ch)
		return ch
	}
	rows, err := db.QueryContext(context.Background(), `
	with tori_collections as (
		SELECT c.*, tc.mint_contract_address  FROM collections AS c
		INNER join teritori_collections tc on tc.collection_id = c.id
	),
	nft_by_collection as (
	SELECT  tc.id,n.id  nft_id  FROM tori_collections AS tc
		INNER JOIN nfts AS n on tc.id = n.collection_id
	),
	trades_by_collection as (
		select sum(CAST(t.price as decimal)) volume, nbc.id FROM trades AS t
		INNER join activities AS a on a.id = t.activity_id 
		INNER join nft_by_collection nbc on nbc.nft_id = a.nft_id
		where a.time > $1 and a.kind = $2
		GROUP BY nbc.id
	)
	select tc.*, COALESCE((select tbc.volume from trades_by_collection tbc where tbc.id = tc.id), 0) volume 
	from tori_collections tc
	order by volume desc
	limit $3
	offset $4
	`, time.Now().AddDate(0, 0, -30), indexerdb.ActivityKindTrade, limit, offset)
	if err != nil {
		p.logger.Error("failed to make query", zap.Error(err))
		close(ch)
		return ch
	}

	// NOTE: You can uncomment this to dump the SQL query
	/*
		sql := p.indexerDB.ToSQL(func(tx *gorm.DB) *gorm.DB { return makeQuery(tx, &[]map[string]interface{}{}) })
		fmt.Println("SQL:\n" + sql)
	*/

	var collections []DBCollectionWithExtra
	err = queries.Bind(rows, &collections)
	if err != nil {
		p.logger.Error("failed to make query", zap.Error(err))
		close(ch)
		return ch
	}

	go func() {
		defer close(ch)
		for _, c := range collections {
			ch <- &marketplacepb.Collection{
				Id:             c.ID,
				CollectionName: c.Name,
				Verified:       true,
				ImageUri:       ipfsutil.IPFSURIToURL(c.ImageURI),
				MintAddress:    c.MintContractAddress,
				Network:        marketplacepb.Network_NETWORK_TERITORI,
				Volume:         c.Volume,
			}
		}
	}()

	return ch
}

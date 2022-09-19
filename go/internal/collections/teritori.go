package collections

import (
	"time"

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

type DBCollectionWithExtra struct {
	indexerdb.Collection
	Volume              string
	MintContractAddress string
}

func (p *teritoriCollectionsProvider) Collections(limit int, offset int) chan *marketplacepb.Collection {
	ch := make(chan *marketplacepb.Collection)

	// FIXME: this will not return collections with no volume

	makeQuery := func(tx *gorm.DB, r interface{}) *gorm.DB {
		return tx.
			Model(&indexerdb.Activity{}).
			Select("SUM(trades.price) as volume, collections.*, teritori_collections.mint_contract_address").
			Joins("JOIN trades ON trades.activity_id = activities.id").
			Joins("JOIN nfts ON nfts.id = activities.nft_id").
			Joins("JOIN collections ON collections.id = nfts.collection_id").
			Joins("JOIN teritori_collections ON collections.id = teritori_collections.collection_id").
			Where("activities.kind = ?", indexerdb.ActivityKindTrade).
			Where("activities.time > ?", time.Now().AddDate(0, 0, -30)).
			Not("nfts.collection_id = ?", "").
			Group("nfts.collection_id").
			Order("volume DESC").
			Limit(limit).
			Offset(offset).
			Scan(r)
	}

	// NOTE: You can uncomment this to dump the SQL query
	/*
		sql := p.indexerDB.ToSQL(func(tx *gorm.DB) *gorm.DB { return makeQuery(tx, &[]map[string]interface{}{}) })
		fmt.Println("SQL:\n" + sql)
	*/

	var collections []*DBCollectionWithExtra
	if err := makeQuery(p.indexerDB, &collections).Error; err != nil {
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

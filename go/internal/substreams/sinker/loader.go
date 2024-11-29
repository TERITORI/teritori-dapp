package sinker

import (
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
	sink "github.com/streamingfast/substreams-sink"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Loader struct {
	indexerDB *gorm.DB

	logger *zap.Logger

	// Set later
	dbTransaction *gorm.DB
}

func NewLoader(indexerDB *gorm.DB, logger *zap.Logger) *Loader {
	return &Loader{
		indexerDB: indexerDB,
		logger:    logger,
	}
}

// NOTE: There is mechanism to continue the indexer with changed/updated module but we don't process that
// we can implement that in the future if needed, for now, when changing module we have to re-run indexer
// Or maybe change the module hash manually ?
func (l *Loader) GetOrCreateCursor(cursorID string, networkID string, indexerMode indexerdb.IndexerMode) (*sink.Cursor, error) {
	c := indexerdb.Cursor{}
	err := l.indexerDB.Where("id = ? AND indexer_mode = ? AND network = ?", cursorID, indexerMode, networkID).First(&c).Error

	// If no error then return the cursor
	if err == nil {
		return sink.NewCursor(c.Cursor)
	}

	// If record not found then insert new cursor
	if errors.Is(err, gorm.ErrRecordNotFound) {
		sinkCursor := sink.NewBlankCursor()

		if err := l.WriteCursor(sinkCursor, cursorID, networkID, indexerMode); err != nil {
			return nil, errors.Wrap(err, "failed to init cursor")
		}
		return sinkCursor, nil
	}

	// If other error then throw error
	return nil, errors.Wrap(err, "failed to retrieve cursor")
}

func (l *Loader) WriteCursor(sinkCursor *sink.Cursor, cursorID string, networkID string, indexerMode indexerdb.IndexerMode) error {
	cursor := indexerdb.Cursor{
		ID:          cursorID,
		Cursor:      sinkCursor.String(),
		BlockNum:    sinkCursor.Block().Num(),
		BlockId:     sinkCursor.Block().ID(),
		Network:     networkID,
		IndexerMode: indexerMode,
	}

	if err := l.indexerDB.Create(&cursor).Error; err != nil {
		return errors.Wrap(err, "failed to write cursor")
	}

	return nil
}

func (l *Loader) UpdateCursor(sinkCursor *sink.Cursor, cursorID string, networkID string, indexerMode indexerdb.IndexerMode) error {
	err := l.dbTransaction.Model(&indexerdb.Cursor{}).Where("id = ? AND indexer_mode = ? AND network = ?", cursorID, indexerMode, networkID).Updates(indexerdb.Cursor{
		Cursor:   sinkCursor.String(),
		BlockNum: sinkCursor.Block().Num(),
		BlockId:  sinkCursor.Block().ID(),
	}).Error

	if err != nil {
		return errors.Wrap(err, "failed to update cursor")
	}

	return nil
}

func (l *Loader) ApplyChanges(sinkCursor *sink.Cursor, cursorID string, networkID string, indexerMode indexerdb.IndexerMode) (err error) {
	if err := l.UpdateCursor(sinkCursor, cursorID, networkID, indexerMode); err != nil {
		return errors.Wrap(err, "failed to update cursor when apply changes")
	}

	if err := l.dbTransaction.Commit().Error; err != nil {
		l.dbTransaction.Rollback()
		return err
	}

	// NOTE: Activate this if needed when debug
	// l.logger.Info(">>> cursor updated and changes applied !")

	// Start new transaction
	l.MustStartDbTransaction()

	return nil
}

func (l *Loader) MustStartDbTransaction() {
	l.dbTransaction = l.indexerDB.Begin()
	if l.dbTransaction.Error != nil {
		panic("failed to start DB transaction")
	}
}

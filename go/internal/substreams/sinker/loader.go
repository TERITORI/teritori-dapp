package sinker

import (
	"fmt"

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
func (l *Loader) GetOrCreateCursor(cursorID string, networkID string) (*sink.Cursor, error) {
	c := indexerdb.Cursors{ID: cursorID}
	err := l.indexerDB.First(&c).Error

	// If no error then return the cursor
	if err == nil {
		return sink.NewCursor(c.Cursor)
	}

	// If record not found then insert new cursor
	if errors.Is(err, gorm.ErrRecordNotFound) {
		sinkCursor := sink.NewBlankCursor()

		if err := l.WriteCursor(sinkCursor, cursorID, networkID); err != nil {
			return nil, errors.Wrap(err, "failed to init cursor")
		}
		return sinkCursor, nil
	}

	// If other error then throw error
	return nil, errors.Wrap(err, "failed to retrieve cursor")
}

func (l *Loader) WriteCursor(sinkCursor *sink.Cursor, cursorID string, networkID string) error {
	fmt.Println(sinkCursor, cursorID)

	cursor := indexerdb.Cursors{
		ID:       cursorID,
		Cursor:   sinkCursor.String(),
		BlockNum: sinkCursor.Block().Num(),
		BlockId:  sinkCursor.Block().ID(),
		Network:  networkID,
	}

	if err := l.indexerDB.Create(&cursor).Error; err != nil {
		return errors.Wrap(err, "failed to write cursor")
	}

	return nil
}

func (l *Loader) UpdateCursor(sinkCursor *sink.Cursor, cursorID string, networkID string) error {
	cursor := indexerdb.Cursors{
		ID:      cursorID,
		Network: networkID,
	}

	err := l.dbTransaction.Model(&cursor).Updates(indexerdb.Cursors{
		Cursor:   sinkCursor.String(),
		BlockNum: sinkCursor.Block().Num(),
		BlockId:  sinkCursor.Block().ID(),
	}).Error

	if err != nil {
		return errors.Wrap(err, "failed to update cursor")
	}

	return nil
}

func (l *Loader) ApplyChanges(sinkCursor *sink.Cursor, cursorID string, networkID string) (err error) {
	if err := l.UpdateCursor(sinkCursor, cursorID, networkID); err != nil {
		return errors.Wrap(err, "failed to update cursor when apply changes")
	}

	if err := l.dbTransaction.Commit().Error; err != nil {
		l.dbTransaction.Rollback()
		return err
	}

	l.logger.Info(">>> applied changes into DB done !")

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

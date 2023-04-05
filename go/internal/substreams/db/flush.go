package db

import (
	"context"
	"fmt"
	"reflect"

	sink "github.com/streamingfast/substreams-sink"
	"go.uber.org/zap"
)

func (l *Loader) Flush(ctx context.Context, moduleHash string, cursor *sink.Cursor) (err error) {
	if l.OperationsCount == 0 {
		return nil
	}

	l.logger.Info("flush operations", zap.Int64("total", int64(l.OperationsCount)))

	tx, err := l.DB.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to being db transaction: %w", err)
	}
	defer func() {
		if err != nil {
			if err := tx.Rollback(); err != nil {
				l.logger.Warn("failed to rollback transaction", zap.Error(err))
			}
		}
	}()

	sortedOperations := make([]*Operation, l.OperationsCount)
	for order, operation := range l.operations {
		sortedOperations[order] = operation
	}

	for _, entry := range sortedOperations {
		if err := entry.executeContext(ctx, tx, l.getType); err != nil {
			return fmt.Errorf("failed to execute operation: %w", err)
		}
	}

	if err := l.UpdateCursor(ctx, tx, moduleHash, cursor); err != nil {
		return fmt.Errorf("failed to update cursor: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit db transaction: %w", err)
	}

	l.reset()

	return nil
}

func (l *Loader) reset() {
	l.operations = map[uint64]*Operation{}
	l.OperationsCount = 0
}

func (l *Loader) getType(tableName string, columnName string) (reflect.Type, error) {
	if t, found := l.tables[tableName][columnName]; found {
		return t, nil
	}
	return nil, fmt.Errorf("cannot find type of column %q for table %q", columnName, tableName)
}

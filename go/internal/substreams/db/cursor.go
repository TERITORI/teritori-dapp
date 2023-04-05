package db

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pkg/errors"

	"github.com/streamingfast/bstream"
	sink "github.com/streamingfast/substreams-sink"
)

var ErrCursorNotFound = errors.New("cursor not found")

func (l *Loader) GetCursor(ctx context.Context, outputModuleHash string) (*sink.Cursor, error) {
	type cursorRow struct {
		Id       string
		Cursor   string
		BlockNum uint64
		BlockID  string
		Network  string
	}

	query := "SELECT id, cursor, block_num, block_id, network from cursors WHERE id = $1"
	row := l.DB.QueryRowContext(ctx, query, outputModuleHash)

	c := &cursorRow{}
	if err := row.Scan(&c.Id, &c.Cursor, &c.BlockNum, &c.BlockID, &c.Network); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrCursorNotFound
		}
		return nil, fmt.Errorf("getting cursor %q:  %w", outputModuleHash, err)
	}

	return sink.NewCursor(c.Cursor, bstream.NewBlockRef(c.BlockID, c.BlockNum)), nil
}

func (l *Loader) WriteCursor(ctx context.Context, moduleHash string, c *sink.Cursor) error {
	query := "INSERT INTO cursors (id, cursor, block_num, block_id, network) values ($1, $2, $3, $4, $5)"
	namedArgs := []interface{}{
		sql.Named("id", moduleHash),
		sql.Named("cursor", c.Cursor),
		sql.Named("block_num", c.Block.Num()),
		sql.Named("block_id", c.Block.ID()),
		sql.Named("network", "ethereum"),
	}

	if _, err := l.DB.ExecContext(ctx, query, namedArgs...); err != nil {
		return errors.Wrap(err, "failed to write cursor")
	}
	return nil
}

func (l *Loader) UpdateCursor(ctx context.Context, tx *sql.Tx, moduleHash string, c *sink.Cursor) error {
	cursorQuery := "UPDATE cursors set cursor = $1, block_num = $2, block_id = $3 WHERE id = $4 AND network =$5"

	namedArgs := []interface{}{
		sql.Named("cursor", c.Cursor),
		sql.Named("block_num", c.Block.Num()),
		sql.Named("block_id", c.Block.ID()),
		sql.Named("id", moduleHash),
		sql.Named("network", "ethereum"),
	}

	if _, err := tx.ExecContext(ctx, cursorQuery, namedArgs...); err != nil {
		return errors.Wrap(err, "failed to update cursor")
	}

	return nil
}

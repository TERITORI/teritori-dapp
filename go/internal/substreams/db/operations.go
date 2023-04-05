package db

import (
	"context"
	"database/sql"
	"fmt"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/pkg/errors"
)

type TypeGetter func(tableName string, columnName string) (reflect.Type, error)

type Queryable interface {
	query() (string, error)
}

type OperationType string

const (
	OperationTypeInsert OperationType = "INSERT"
	OperationTypeUpdate OperationType = "UPDATE"
	OperationTypeDelete OperationType = "DELETE"
)

type Operation struct {
	schemaName           string
	tableName            string
	primaryKeyColumnName string
	opType               OperationType
	primaryKey           string
	data                 map[string]string
}

func (o *Operation) String() string {
	return fmt.Sprintf("%s.%s/%s (%s)", o.schemaName, o.tableName, o.primaryKey, strings.ToLower(string(o.opType)))
}

func (l *Loader) newInsertOperation(tableName string, primaryKey string, data map[string]string) *Operation {
	return &Operation{
		schemaName:           l.schema,
		tableName:            tableName,
		opType:               OperationTypeInsert,
		primaryKeyColumnName: l.tablePrimaryKeys[tableName],
		primaryKey:           primaryKey,
		data:                 data,
	}
}

func (l *Loader) newUpdateOperation(tableName string, primaryKey string, data map[string]string) *Operation {
	return &Operation{
		schemaName:           l.schema,
		tableName:            tableName,
		opType:               OperationTypeUpdate,
		primaryKeyColumnName: l.tablePrimaryKeys[tableName],
		primaryKey:           primaryKey,
		data:                 data,
	}
}

func (l *Loader) newDeleteOperation(tableName string, primaryKey string) *Operation {
	return &Operation{
		schemaName:           l.schema,
		tableName:            tableName,
		opType:               OperationTypeDelete,
		primaryKeyColumnName: l.tablePrimaryKeys[tableName],
		primaryKey:           primaryKey,
	}
}

func (o *Operation) executeContext(ctx context.Context, tx *sql.Tx, typeGetter TypeGetter) error {
	var stmt string

	if o.opType == OperationTypeDelete {
		stmt = fmt.Sprintf("DELETE FROM %s.%s WHERE %s = ?", o.schemaName, o.tableName, o.primaryKeyColumnName)
		if _, err := tx.ExecContext(ctx, stmt, o.primaryKey); err != nil {
			return errors.Wrap(err, fmt.Sprintf("failed to exec delete: %s - pk: %s", stmt, o.primaryKey))
		}
		return nil

	}

	keys, values, namedPlaceholders, err := prepareColValues(o.tableName, o.data, typeGetter)
	if err != nil {
		return errors.Wrap(err, "preparing column-values")
	}

	namedArgs := make([]interface{}, len(keys))
	for i := 0; i < len(keys); i++ {
		namedArgs[i] = sql.Named(keys[i], values[i])
	}

	if o.opType == OperationTypeInsert {
		stmt = fmt.Sprintf("INSERT INTO %s.%s (%s) VALUES (%s)",
			o.schemaName,
			o.tableName,
			strings.Join(keys, ","),
			strings.Join(namedPlaceholders, ","),
		)

		if _, err := tx.ExecContext(ctx, stmt, namedArgs...); err != nil {
			return errors.Wrap(err, fmt.Sprintf("failed to exec insert: %s - pk: %s - values: %s", stmt, o.primaryKey, values))
		}
		return nil
	}

	var updates []string
	for i := 0; i < len(keys); i++ {
		update := fmt.Sprintf("%s=%s", keys[i], namedPlaceholders[i])
		updates = append(updates, update)
	}

	updatesString := strings.Join(updates, ", ")
	stmt = fmt.Sprintf("UPDATE %s.%s SET %s WHERE %s = '%s'", o.schemaName, o.tableName, updatesString, o.primaryKeyColumnName, o.primaryKey)
	if _, err := tx.ExecContext(ctx, stmt, namedArgs...); err != nil {
		return errors.Wrap(err, fmt.Sprintf("failed to exec update: %s - pk: %s - values: %s", stmt, o.primaryKey, values))
	}
	return nil
}

func prepareColValues(tableName string, colValues map[string]string, typeGetter TypeGetter) (columns []string, values []any, namedPlaceholders []string, err error) {
	i := 1
	for columnName, value := range colValues {
		columns = append(columns, columnName)

		valueType, err := typeGetter(tableName, columnName)
		if err != nil {
			return nil, nil, nil, fmt.Errorf("get column type %s.%s: %w", tableName, columnName, err)
		}

		normalizedValue, err := formatValue(tableName, columnName, value, valueType)
		if err != nil {
			return nil, nil, nil, fmt.Errorf("getting sql value for column %q raw value %q: %w", columnName, value, err)
		}
		values = append(values, normalizedValue)
		namedPlaceholders = append(namedPlaceholders, "$"+strconv.Itoa(i))
		i++
	}
	return
}

func isNumeric(tableName, columnName string) bool {
	// FIXME: we have to hardcode for NUMERIC type now, find a way to automatically format numeric value
	if tableName == "nfts" && columnName == "price_amount" {
		return true
	}
	if tableName == "listing" && columnName == "usd_price" {
		return true
	}

	return false
}

func formatValue(tableName, columnName, value string, valueType reflect.Type) (any, error) {
	// FIXME: all these values need proper escaping of values. merely wrapping in ' is an
	// opening for SQL injection.

	if isNumeric(tableName, columnName) {
		if value == "" {
			return nil, nil
		}
		return value, nil
	}

	switch valueType.Kind() {
	case reflect.Interface, reflect.String:
		return value, nil
	case reflect.Bool:
		boolValue, err := strconv.ParseBool(value)
		if err != nil {
			return false, err
		}
		return boolValue, nil
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return value, nil
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		return value, nil
	case reflect.Float32, reflect.Float64:
		return value, nil
	case reflect.Struct:
		if valueType == reflect.TypeOf(time.Time{}) {
			i, err := strconv.Atoi(value)
			if err != nil {
				return "", fmt.Errorf("could not convert %s to int: %w", value, err)
			}

			v := time.Unix(int64(i), 0).Format(time.RFC3339)
			return fmt.Sprintf("'%s'", v), nil
		}
		return "", fmt.Errorf("unsupported type %s for column %s in table %s", valueType, columnName, tableName)
	default:
		return "", fmt.Errorf("unsupported type %s for column %s in table %s", valueType, columnName, tableName)
	}
}

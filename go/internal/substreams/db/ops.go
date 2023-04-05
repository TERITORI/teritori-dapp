package db

// Insert a row in the DB, it is assumed the table exists, you can do a
// check before with HasTable()
func (l *Loader) Insert(tableName string, primaryKey string, data map[string]string) error {
	// If pk value = auto then remove pk from value list
	if data[primaryKey] == "__auto__" {
		delete(data, primaryKey)
	}

	l.operations[l.OperationsCount] = l.newInsertOperation(tableName, primaryKey, data)
	l.OperationsCount++
	return nil
}

// Update a row in the DB, it is assumed the table exists, you can do a
// check before with HasTable()
func (l *Loader) Update(tableName string, primaryKey string, data map[string]string) error {
	l.operations[l.OperationsCount] = l.newUpdateOperation(tableName, primaryKey, data)
	l.OperationsCount++
	return nil
}

// Delete a row in the DB, it is assumed the table exists, you can do a
// check before with HasTable()
func (l *Loader) Delete(tableName string, primaryKey string) error {
	l.operations[l.OperationsCount] = l.newDeleteOperation(tableName, primaryKey)
	l.OperationsCount++
	return nil
}

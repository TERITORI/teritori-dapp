package indexerdb

import (
	"gorm.io/gorm"
)

var persistentModels = []interface{}{

	// notifications
	&Notification{},
}

func MigratePersistentDB(db *gorm.DB) error {
	return db.AutoMigrate(persistentModels...)
}

//func CreateDatabase(dataConnexion string, dbPersistent string) error {
//	DB, _ := gorm.Open(postgres.Open(dataConnexion), &gorm.Config{})
//
//	createDatabaseCommand := fmt.Sprintf("CREATE DATABASE %s", dbPersistent)
//	if rs := DB.Exec(createDatabaseCommand); rs.Error != nil {
//		return rs.Error
//	}
//
//	return nil
//}
//
//func CreateIfNotExist(db *gorm.DB) error {
//	// check if db exists
//	stmt := fmt.Sprintf("SELECT * FROM pg_database WHERE datname = '%s';", db.Name)
//	rs := db.Raw(stmt)
//	if rs.Error != nil {
//		return rs.Error
//	}
//
//	// if not create it
//	var rec = make(map[string]interface{})
//	if rs.Find(rec); len(rec) == 0 {
//		stmt := fmt.Sprintf("CREATE DATABASE %s;", db.Name)
//		if rs := db.Exec(stmt); rs.Error != nil {
//			return rs.Error
//		}
//
//		// close db connection
//		sql, err := db.DB()
//		defer func() {
//			_ = sql.Close()
//		}()
//		if err != nil {
//			return err
//		}
//	}
//
//	return nil
//}

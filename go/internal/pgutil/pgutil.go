package pgutil

import (
	"errors"
	"fmt"
	"net/url"
)

type PostgreSQLConfig struct {
	User         string
	Password     string
	Host         string
	Port         int
	DatabaseName string
}

func PostgreSQLURL(conf *PostgreSQLConfig) url.URL {
	if conf == nil {
		panic(errors.New("nil conf"))
	}

	var dbURL url.URL

	dbURL.Scheme = "postgres"
	dbURL.User = url.UserPassword(conf.User, conf.Password)
	dbURL.Path = conf.DatabaseName
	dbURL.Host = fmt.Sprintf("%s:%d", conf.Host, conf.Port)

	return dbURL
}

package main

import (
	"github.com/TERITORI/teritori-dapp/go/internal/collections"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func main() {
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
	}

	cols, err := collections.FetchUpcomingLaunches(logger)
	if err != nil {
		panic(errors.Wrap(err, "failed to fetch upcoming launches"))
	}

	spew.Dump(cols)
}

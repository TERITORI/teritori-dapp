package main

import (
	"github.com/TERITORI/teritori-dapp/go/internal/airtable_fetcher"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func main() {
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
	}

	client := airtable_fetcher.NewClient()

	upcoming, err := client.FetchUpcomingLaunches(logger)
	if err != nil {
		logger.Error("failed to fetch upcoming launches", zap.Error(err))
	} else {
		logger.Info("Upcoming launches")
		spew.Dump(upcoming)
	}

	testnetBanners, err := client.FetchBanners(true)
	if err != nil {
		logger.Error("failed to fetch testnet banners", zap.Error(err))
	} else {
		logger.Info("Testnet banners")
		spew.Dump(testnetBanners)
	}

	mainnetBanners, err := client.FetchBanners(false)
	if err != nil {
		logger.Error("failed to fetch mainnet banners", zap.Error(err))
	} else {
		logger.Info("Mainnet banners")
		spew.Dump(mainnetBanners)
	}

	testnetNews, err := client.FetchNews(true)
	if err != nil {
		logger.Error("failed to fetch testnet news", zap.Error(err))
	} else {
		logger.Info("Testnet news")
		spew.Dump(testnetNews)
	}

	mainnetNews, err := client.FetchNews(false)
	if err != nil {
		logger.Error("failed to fetch mainnet news", zap.Error(err))
	} else {
		logger.Info("Mainnet news")
		spew.Dump(mainnetNews)
	}
}

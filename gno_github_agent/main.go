package main

import (
	"os"
	"time"

	"github.com/TERITORI/gh-verify-agent/clientql"
	"github.com/TERITORI/gh-verify-agent/db"
	"github.com/TERITORI/gh-verify-agent/signer"
	"github.com/go-co-op/gocron"
	"go.uber.org/zap"
)

var gnoSigner *signer.Signer

func main() {
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}

	db, err := db.New()
	if err != nil {
		panic(err)
	}
	mnemonic := os.Getenv("GNO_MNEMONIC")
	chainID := os.Getenv("GNO_CHAIN_ID")
	rpcAddr := os.Getenv("GNO_RPC_ADDR")
	realmPath := os.Getenv("GNO_REALM_PATH")
	txIndexerHost := os.Getenv("GNO_TX_INDEXER")

	gnoSigner = signer.New(db, logger.Sugar(), mnemonic, chainID, rpcAddr, realmPath)

	clientql := clientql.New(txIndexerHost, db, logger.Sugar(), gnoSigner, realmPath)
	schedule := gocron.NewScheduler(time.UTC)

	schedule.Every(30).Seconds().Do(func() {
		err = clientql.DealWithVerifications()
		if err != nil {
			logger.Error("failed to deal with verifications", zap.Error(err))
			panic(err)
		}
	})

	schedule.StartBlocking()
}

package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/feed"
	"github.com/go-co-op/gocron"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func main() {
	// NOTICE: This service should be replace by nft storage UCAN
	// This runs periodically to clean the keys, so under the normal condition where the number of existing keys are not too big, this can work
	// but in the future when we will have many users (several hundreds posts / min), this might not fit anymore

	fs := flag.NewFlagSet("feed-clean-pinata-keys", flag.ContinueOnError)
	var (
		pinataJWT = fs.String("pinata-jwt", "", "Pinata admin JWT token")
	)
	if err := ff.Parse(fs, os.Args[1:],
		ff.WithEnvVars(),
		ff.WithIgnoreUndefined(true),
		ff.WithConfigFile(".env"),
		ff.WithConfigFileParser(ff.EnvParser),
		ff.WithAllowMissingConfigFile(true),
	); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	// Load Pinata JWT token
	if *pinataJWT == "" {
		panic(errors.New("env PINATA_JWT must be provided"))
	}

	// get logger
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
	}

	pinata := feed.NewPinataService(*pinataJWT)

	schedule := gocron.NewScheduler(time.UTC)
	isProcessing := false
	schedule.Every(10).Seconds().Do(func() {
		if isProcessing {
			return
		}

		isProcessing = true

		keysResp, err := pinata.GetAPIKeys(0)
		if err != nil {
			logger.Error(fmt.Sprintf("failed to count keys: %s", err))
			isProcessing = false
			return
		}

		logger.Info("cleaning Pinata API keys", zap.Int("count", keysResp.Count))

		remainingPages := keysResp.Count / feed.PINATA_LIMIT_PER_PAGE
		totalSkip := 0
		totalRemaining := 0
		totalRevoked := 0

		// Get all existing keys
		keysData := keysResp.Keys
		for i := 0; i < remainingPages; i++ {
			respI, err := pinata.GetAPIKeys(i)
			if err != nil {
				logger.Error(fmt.Sprintf("failed to get API keys: %s", err))
				isProcessing = false
				return
			}

			keysData = append(keysData, respI.Keys...)
		}

		// Process each key
		for _, keyData := range keysData {
			if keyData.Revoked || keyData.Scopes.Admin || !strings.HasPrefix(keyData.Name, feed.FEED_KEY_PREFIX) {
				totalSkip++
				continue
			}

			now := time.Now()
			diff := now.Sub(keyData.CreatedAt)

			if diff.Seconds() <= feed.KEY_TTL {
				totalRemaining++
				continue
			}

			if err := pinata.RevokeAPIKey(keyData.Key); err != nil {
				logger.Error(fmt.Sprintf("failed revoke API key %s: %s", keyData.Key, err))
				isProcessing = false
				return
			}

			totalRevoked++
			time.Sleep(time.Second / 3) // Rate limit of Pinata
		}

		logger.Info("done", zap.Int("skip", totalSkip), zap.Int("revoked", totalRevoked), zap.Int("remaining", totalRemaining))
		isProcessing = false
	})

	schedule.StartBlocking()
}

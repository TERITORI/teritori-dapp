package airtable

import (
	"context"
	"strings"
	"sync"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/mehanizm/airtable"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

// FIXME: hide key

const airtableAPIKey = "keyNTJ1BbH31oTuwQ"
const airtableBaseId = "appetXQzVoElrsJs5"
const airtableLaunchpadTableId = "tbla2ZD8MtljtvHKt"
const refreshDelay = 5 * time.Minute

type UpcomingLaunchesProvider interface {
	UpcomingLaunches() chan *marketplacepb.Collection
}

type upcomingLaunchesCache struct {
	mu               *sync.RWMutex
	upcomingLaunches []*marketplacepb.Collection
}

func NewUpcomingLaunchesProvider(ctx context.Context, logger *zap.Logger) UpcomingLaunchesProvider {
	cache := &upcomingLaunchesCache{
		mu: &sync.RWMutex{},
	}
	go func() {
		for {
			select {
			case <-ctx.Done():
				logger.Info("stopping upcoming launches refresh")
				return
			default:
			}
			func() {
				newLaunches, err := fetchUpcomingLaunches(logger)
				if (err) != nil {
					logger.Error("failed to fetch upcoming launches", zap.Error(err))
					return
				}
				cache.mu.Lock()
				cache.upcomingLaunches = newLaunches
				cache.mu.Unlock()
			}()
			time.Sleep(refreshDelay)
		}
	}()
	return cache
}

func (ulc *upcomingLaunchesCache) UpcomingLaunches() chan *marketplacepb.Collection {
	ch := make(chan *marketplacepb.Collection)
	ulc.mu.RLock()
	uls := ulc.upcomingLaunches
	ulc.mu.RUnlock()
	go func() {
		defer close(ch)
		for _, ul := range uls {
			ch <- ul
		}
	}()
	return ch
}

func fetchUpcomingLaunches(logger *zap.Logger) ([]*marketplacepb.Collection, error) {
	client := airtable.NewClient(airtableAPIKey)

	table := client.GetTable(airtableBaseId, airtableLaunchpadTableId)

	recordsReq := table.GetRecords()
	records, err := recordsReq.Do()
	if err != nil {
		return nil, errors.Wrap(err, "failed to fetch records")
	}

	var upcomingLaunches []*marketplacepb.Collection
	for _, record := range records.Records {
		collectionName, ok := record.Fields["CollectionName"].(string)
		if !ok {
			logger.Error("bad collection name type", zap.String("record", record.ID))
			continue
		}

		creatorName, ok := record.Fields["CreatorName"].(string)
		if !ok {
			logger.Error("bad creator name type", zap.String("record", record.ID))
			continue
		}

		isCertified, ok := record.Fields["IsCertified"].(string)
		if !ok {
			logger.Error("bad certified type", zap.String("record", record.ID))
			continue
		}

		pfpArray, ok := record.Fields["CollectionPFP"].([]interface{})
		if !ok {
			logger.Error("bad pfp array type", zap.String("record", record.ID))
			continue
		}
		if len(pfpArray) == 0 {
			logger.Error("empty pfp array", zap.String("record", record.ID))
			continue
		}

		pfp, ok := pfpArray[0].(map[string]interface{})
		if !ok {
			logger.Error("bad pfp type", zap.String("record", record.ID))
			continue
		}

		imageURI, ok := pfp["url"].(string)
		if !ok {
			logger.Error("bad pfp url type", zap.String("record", record.ID))
			continue
		}

		upcomingLaunches = append(upcomingLaunches, &marketplacepb.Collection{
			ImageUri:       imageURI,
			CollectionName: collectionName,
			CreatorName:    creatorName,
			Verified:       strings.ToLower(isCertified) == "yes",
		})
	}
	return upcomingLaunches, nil
}

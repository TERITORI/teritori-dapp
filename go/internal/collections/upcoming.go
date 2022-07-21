package collections

import (
	"context"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/mehanizm/airtable"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

// FIXME: hide key

const airtableAPIKey = "keyNTJ1BbH31oTuwQ"
const airtableBaseId = "appetXQzVoElrsJs5"
const airtableLaunchpadTableId = "tbla2ZD8MtljtvHKt"

func NewUpcomingLaunchesProvider(ctx context.Context, logger *zap.Logger) CollectionsProvider {
	fetch := func() ([]*marketplacepb.Collection, error) {
		return fetchUpcomingLaunches(logger)
	}
	return newCachedCollectionsProvider(ctx, fetch, logger)
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

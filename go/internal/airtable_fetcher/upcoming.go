package airtable_fetcher

import (
	"net/url"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/mehanizm/airtable"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func (c *Client) FetchUpcomingLaunches(logger *zap.Logger) ([]*marketplacepb.Collection, error) {
	client := airtable.NewClient(c.config.APIKey)

	table := client.GetTable(c.config.BaseID, c.config.LaunchpadTableID)

	params := make(url.Values)
	params.Set("sort[0][field]", "MintDate")
	params.Set("sort[0][direction]", "asc")
	params.Set("filterByFormula", "{Show}")
	records, err := table.GetRecordsWithParams(params)
	if err != nil {
		return nil, errors.Wrap(err, "failed to fetch records")
	}

	var upcomingLaunches []*marketplacepb.Collection
	for _, record := range records.Records {
		collectionName, ok := record.Fields["CollectionName"].(string)
		if !ok {
			continue
		}

		creatorName, ok := record.Fields["CreatorName"].(string)
		if !ok {
			continue
		}

		websiteUrl, ok := record.Fields["WebsiteURL"].(string)
		if !ok {
			websiteUrl = ""
		}

		twitterUrl, ok := record.Fields["TwitterURL"].(string)
		if !ok {
			twitterUrl = ""
		}

		pfpArray, ok := record.Fields["CollectionPFP"].([]interface{})
		if !ok {
			continue
		}
		if len(pfpArray) == 0 {
			continue
		}

		pfp, ok := pfpArray[0].(map[string]interface{})
		if !ok {
			continue
		}

		imageURI, ok := pfp["url"].(string)
		if !ok {
			continue
		}

		upcomingLaunches = append(upcomingLaunches, &marketplacepb.Collection{
			ImageUri:       imageURI,
			CollectionName: collectionName,
			CreatorName:    creatorName,
			TwitterUrl:     twitterUrl,
			WebsiteUrl:     websiteUrl,
		})
	}
	return upcomingLaunches, nil
}

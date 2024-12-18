package marketing

import (
	"net/url"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketingpb"
	"github.com/mehanizm/airtable"
	"github.com/pkg/errors"
)

// TODO: Fetch data withou airtable

func (c *Client) FetchBanners(testnet bool) ([]*marketingpb.Banner, error) {
	client := airtable.NewClient(c.config.APIKey)

	table := client.GetTable(c.config.BaseID, c.config.BannersTableID)

	params := make(url.Values)
	params.Set("view", c.config.BannersViewID)
	if testnet {
		params.Set("filterByFormula", "{Status} = 'TESTNET LIVE'")
	} else {
		params.Set("filterByFormula", "{Status} = 'MAINNET (LIVE PRODUCTION)'")
	}

	records, err := table.GetRecordsWithParams(params)
	if err != nil {
		return nil, errors.Wrap(err, "failed to fetch records")
	}

	banners := []*marketingpb.Banner(nil)
	for _, record := range records.Records {
		image, ok := record.Fields["Image"].(string)
		if !ok {
			continue
		}
		link, ok := record.Fields["Link"].(string)
		if !ok {
			continue
		}
		banners = append(banners, &marketingpb.Banner{
			Image: image,
			Url:   link,
		})
	}

	return banners, nil
}

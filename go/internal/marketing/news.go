package marketing

import (
	"fmt"
	"net/url"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketingpb"
	"github.com/mehanizm/airtable"
	"github.com/pkg/errors"
)

// TODO: Fetch data withou airtable

func (c *Client) FetchNews(testnet bool) ([]*marketingpb.News, error) {
	client := airtable.NewClient(c.config.APIKey)

	table := client.GetTable(c.config.BaseID, c.config.NewsTableID)

	params := make(url.Values)
	params.Set("view", c.config.NewsViewID)
	if testnet {
		params.Set("filterByFormula", "{Status} = 'TESTNET LIVE'")
	} else {
		params.Set("filterByFormula", "{Status} = 'MAINNET (LIVE PRODUCTION)'")
	}

	records, err := table.GetRecordsWithParams(params)
	if err != nil {
		return nil, errors.Wrap(err, "failed to fetch records")
	}

	news := []*marketingpb.News(nil)
	for _, record := range records.Records {
		title, ok := record.Fields["title"].(string)
		if !ok {
			continue
		}

		subtitle, ok := record.Fields["subtitle"].(string)
		if !ok {
			continue
		}

		image, ok := record.Fields["image"].(string)
		if !ok {
			continue
		}

		text, ok := record.Fields["text"].(string)
		if !ok {
			continue
		}

		actions := []*marketingpb.Action(nil)
		for i := 1; i < 3; i++ {
			buttonLabel, ok := record.Fields[fmt.Sprintf("button%dLabel", i)].(string)
			if !ok {
				continue
			}
			buttonLink, ok := record.Fields[fmt.Sprintf("button%dLink", i)].(string)
			if !ok {
				continue
			}
			actions = append(actions, &marketingpb.Action{
				Label: buttonLabel,
				Url:   buttonLink,
			})
		}

		news = append(news, &marketingpb.News{
			Title:    title,
			Subtitle: subtitle,
			Image:    image,
			Text:     text,
			Actions:  actions,
		})
	}

	return news, nil
}

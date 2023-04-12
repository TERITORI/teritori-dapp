package airtable_fetcher

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/mehanizm/airtable"
	"github.com/pkg/errors"
)

func (c *Client) FetchAppsGroups() ([]*marketplacepb.DAppGroup, error) {
	client := airtable.NewClient(c.config.APIKey)

	table := client.GetTable(c.config.DAppStoreBaseID, c.config.dAppGroupsTableID)

	records, err := table.GetRecords().
		FromView("Grid view").Do()

	if err != nil {
		return nil, errors.Wrap(err, "failed to fetch DAppGroup records")
	}

	dAppGroup := []*marketplacepb.DAppGroup(nil)
	for _, record := range records.Records {

		id, ok := record.Fields["id"].(string)
		if !ok {
			continue
		}

		groupName, ok := record.Fields["title"].(string)
		if !ok {
			continue
		}

		icon, ok := record.Fields["icon"].([]interface{})[0].(map[string]interface{})["url"].(string)
		if !ok {
			continue
		}

		optionsRecord, ok := record.Fields["options"].([]interface{})
		if !ok {
			continue
		}
		//options := make([]string, len(optionsRecord))
		options := []string(nil)
		for i := 0; i < len(optionsRecord); i++ {
			options = append(options, optionsRecord[i].(string))
		}

		dAppGroup = append(dAppGroup, &marketplacepb.DAppGroup{
			Id:        id,
			GroupName: groupName,
			Icon:      icon,
			Options:   options,
		})
	}

	return dAppGroup, nil
}

func (c *Client) FetchApps() ([]*marketplacepb.DApp, error) {
	client := airtable.NewClient(c.config.APIKey)

	table := client.GetTable(c.config.DAppStoreBaseID, c.config.dAppTableID)

	records, err := table.GetRecords().
		FromView("Grid view").Do()

	if err != nil {
		return nil, errors.Wrap(err, "failed to fetch DApp records")
	}

	dApps := []*marketplacepb.DApp(nil)
	for _, record := range records.Records {
		id, ok := record.Fields["id"].(string)
		if !ok {
			continue
		}
		title, ok := record.Fields["title"].(string)
		if !ok {
			continue
		}
		description, ok := record.Fields["description"].(string)
		if !ok {
			continue
		}
		icon, ok := record.Fields["icon"].([]interface{})[0].(map[string]interface{})["url"].(string)
		if !ok {
			continue
		}
		route, ok := record.Fields["route"].(string)
		if !ok {
			continue
		}
		groupKey, ok := record.Fields["dAppsGroup"].([]interface{})[0].(string)
		if !ok {
			continue
		}
		selectedByDefault, ok := record.Fields["selectedByDefault"]
		if !ok {
			selectedByDefault = false
		}
		alwaysOn, ok := record.Fields["alwaysOn"]
		if !ok {
			alwaysOn = false
		}
		dApps = append(dApps, &marketplacepb.DApp{
			Id:                id,
			Title:             title,
			Description:       description,
			Icon:              icon,
			Route:             route,
			GroupKey:          groupKey,
			LinkingId:         record.ID,
			SelectedByDefault: selectedByDefault.(bool),
			AlwaysOn:          alwaysOn.(bool),
		})
	}

	return dApps, nil
}

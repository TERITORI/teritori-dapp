package airtable_fetcher

type Client struct {
	config ClientConfig
}

type ClientConfig struct {
	APIKey           string
	BaseID           string
	LaunchpadTableID string
	BannersTableID   string
	BannersViewID    string
	NewsTableID      string
	NewsViewID       string
}

func NewClient(apiKey string) *Client {
	return &Client{config: ClientConfig{
		APIKey:           apiKey,
		BaseID:           "appetXQzVoElrsJs5",
		LaunchpadTableID: "tbla2ZD8MtljtvHKt",
		BannersTableID:   "tblUXvHaNCABlq8zg",
		BannersViewID:    "viwHEB0KsHyF7EuUQ",
		NewsTableID:      "tblOlJKlbNsSpdAVq",
		NewsViewID:       "viwzEqf2inBThqoFY",
	}}
}

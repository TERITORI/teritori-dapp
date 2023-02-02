package p2e

const THE_RIOT_GAME_ID = "riot-game"

type Season struct {
	ID         string
	GameID     string
	Denom      string
	Decimals   int32
	TotalPrize int32
	BossName   string
	BossImage  string
	TopN       int32 //  Ony send rewards to top N
	StartsAt   string
	EndsAt     string
}

// TODO: We hardcode this right now but should defined in dynamic way in the future (airtable, db...)
// BossHp is in Days
var THE_RIOT_SEASONS = []Season{
	// Season 1
	{
		ID:         "Season 1",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 1_800_000,
		BossName:   "Philipp Rustov",
		BossImage:  "",
		TopN:       500,
		StartsAt:   "2022-12-01T00:00:00",
		EndsAt:     "2023-01-31T00:00:00",
	},
	// Pre-Season 2
	{
		ID:         "Pre-Season 2",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 0,
		BossName:   `== $*=|'¤?")à-£_%`,
		BossImage:  "https://bafkreideajx2dscsgyhnowpm4cavr5vd6pf5no6es326ziul7u2xuot3je.ipfs.nftstorage.link/",
		TopN:       0,
		StartsAt:   "2023-01-31T00:00:00",
		EndsAt:     "2023-01-31T01:00:00",
	},
	// Season 2
	{
		ID:         "Season 2",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 1_710_000,
		BossName:   "Ursula Delahaye",
		BossImage:  "https://bafybeigidzbfvy6t2a3cjff4zc2e6kk36uml5nn6acyuxaiwyvuuq6ww3a.ipfs.nftstorage.link/",
		TopN:       500,
		StartsAt:   "2023-01-31T01:00:00",
		EndsAt:     "2023-02-31T01:00:00",
	},

	// {ID: "Season 3", GameID: THE_RIOT_GAME_ID, TotalPrize: 1_620_000, Denom: "tori", Decimals: 6, BossDefaultName: "Boss", BossHp: 30, TopN: 500},
	// {ID: "Season 4", GameID: THE_RIOT_GAME_ID, TotalPrize: 1_170_000, Denom: "tori", Decimals: 6, BossDefaultName: "Boss", BossHp: 30, TopN: 500},
	// {ID: "Season 5", GameID: THE_RIOT_GAME_ID, TotalPrize: 720_000, Denom: "tori", Decimals: 6, BossDefaultName: "Boss", BossHp: 30, TopN: 500},
	// {ID: "Season 6", GameID: THE_RIOT_GAME_ID, TotalPrize: 630_000, Denom: "tori", Decimals: 6, BossDefaultName: "Philipp Rustov 6", BossHp: 30, TopN: 500},
	// {ID: "Season 7", GameID: THE_RIOT_GAME_ID, TotalPrize: 540_000, Denom: "tori", Decimals: 6, BossDefaultName: "Philipp Rustov 7", BossHp: 30, TopN: 500},
	// {ID: "Season 8", GameID: THE_RIOT_GAME_ID, TotalPrize: 450_000, Denom: "tori", Decimals: 6, BossDefaultName: "Philipp Rustov 8", BossHp: 30, TopN: 500},
	// {ID: "Season 9", GameID: THE_RIOT_GAME_ID, TotalPrize: 360_000, Denom: "tori", Decimals: 6, BossDefaultName: "Philipp Rustov 9", BossHp: 30, TopN: 500},
}

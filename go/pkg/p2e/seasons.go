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
	IsPre      bool
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
		EndsAt:     "2023-01-24T00:00:00",
	},
	// Pre-Season 2
	{
		ID:        "Pre-Season 2",
		GameID:    THE_RIOT_GAME_ID,
		BossName:  `== $*=|'¤?")à-£_%`,
		BossImage: "https://bafkreideajx2dscsgyhnowpm4cavr5vd6pf5no6es326ziul7u2xuot3je.ipfs.nftstorage.link/",
		StartsAt:  "2023-01-24T00:00:00",
		EndsAt:    "2023-02-05T00:00:00",
		IsPre:     true,
	},
	// Season 2
	{
		ID:         "Season 2",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 300_000,
		BossName:   "Ursula Delahaye",
		BossImage:  "https://bafybeigidzbfvy6t2a3cjff4zc2e6kk36uml5nn6acyuxaiwyvuuq6ww3a.ipfs.nftstorage.link/",
		TopN:       500,
		StartsAt:   "2023-02-05T00:00:00",
		EndsAt:     "2023-02-15T00:00:00",
	},
	// Pre-Season 3
	{
		ID:        "Pre-Season 3",
		GameID:    THE_RIOT_GAME_ID,
		BossName:  `== $*=|'¤?")à-£_%`,
		BossImage: "https://bafkreideajx2dscsgyhnowpm4cavr5vd6pf5no6es326ziul7u2xuot3je.ipfs.nftstorage.link/",
		StartsAt:  "2023-02-15T00:00:00",
		EndsAt:    "2023-12-30T00:00:00",
		IsPre:     true,
	},
}

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
		EndsAt:    "2023-02-20T00:00:00",
		IsPre:     true,
	},
	// Season 3
	{
		ID:         "Season 3",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 1_200_000,
		BossName:   "Justin Trado",
		BossImage:  "https://bafybeidxomcyjsr2iach6ms5ceaj53znjrnx5xlo5qnoldbswcfwocg75i.ipfs.nftstorage.link/",
		TopN:       500,
		StartsAt:   "2023-02-20T00:00:00",
		EndsAt:     "2023-03-22T00:00:00",
	},
	// Pre-Season 4
	{
		ID:        "Pre-Season 4",
		GameID:    THE_RIOT_GAME_ID,
		BossName:  `== $*=|'¤?")à-£_%`,
		BossImage: "https://bafkreideajx2dscsgyhnowpm4cavr5vd6pf5no6es326ziul7u2xuot3je.ipfs.nftstorage.link/",
		StartsAt:  "2023-03-22T00:00:00",
		EndsAt:    "2023-03-28T00:00:00",
		IsPre:     true,
	},
	// Season 4
	{
		ID:         "Season 4",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 280_000,
		BossName:   "Ursula Delahaye",
		BossImage:  "https://bafybeieaacwfeglbfqp376owdsjmpolz4uvfkjeji4rr2ck4merxg4r4sa.ipfs.nftstorage.link/",
		TopN:       500,
		StartsAt:   "2023-03-28T00:00:00",
		EndsAt:     "2023-04-04T00:00:00",
	},
	// Pre-Season 4b
	{
		ID:        "Pre-Season 4b",
		GameID:    THE_RIOT_GAME_ID,
		BossName:  `== $*=|'¤?")à-£_%`,
		BossImage: "https://bafkreideajx2dscsgyhnowpm4cavr5vd6pf5no6es326ziul7u2xuot3je.ipfs.nftstorage.link/",
		StartsAt:  "2023-04-04T00:00:00",
		EndsAt:    "2023-04-10T00:00:00",
		IsPre:     true,
	},
	// Season 4b
	{
		ID:         "Season 4b",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 1_200_000,
		BossName:   "Ursula Delahaye",
		BossImage:  "https://bafybeieaacwfeglbfqp376owdsjmpolz4uvfkjeji4rr2ck4merxg4r4sa.ipfs.nftstorage.link/",
		TopN:       500,
		StartsAt:   "2023-04-10T00:00:00",
		EndsAt:     "2023-05-10T00:00:00",
	},
	// Pre-Season 5
	{
		ID:        "Pre-Season 5",
		GameID:    THE_RIOT_GAME_ID,
		BossName:  `== $*=|'¤?")à-£_%`,
		BossImage: "https://bafkreideajx2dscsgyhnowpm4cavr5vd6pf5no6es326ziul7u2xuot3je.ipfs.nftstorage.link/",
		StartsAt:  "2023-05-10T00:00:00",
		EndsAt:    "2023-05-30T00:00:00",
		IsPre:     true,
	},
	// Season 5
	{
		ID:         "Season 5",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 1_000_000,
		BossName:   "Big George",
		BossImage:  "https://bafybeiacz7z2kqoskbtixovgzzdwiuhpfc7z4tac37qpxhjxyyljbp7v6i.ipfs.nftstorage.link/",
		TopN:       500,
		StartsAt:   "2023-05-30T00:00:00",
		EndsAt:     "2023-06-29T00:00:00",
	},
	// Pre-Season 6
	{
		ID:        "Pre-Season 6",
		GameID:    THE_RIOT_GAME_ID,
		BossName:  `== $*=|'¤?")à-£_%`,
		BossImage: "https://bafybeiacz7z2kqoskbtixovgzzdwiuhpfc7z4tac37qpxhjxyyljbp7v6i.ipfs.nftstorage.link/",
		StartsAt:  "2023-06-29T00:00:00",
		EndsAt:    "2023-08-09T00:00:00",
		IsPre:     true,
	},
  // Season 6
	{
		ID:         "Season 6",
		GameID:     THE_RIOT_GAME_ID,
		Denom:      "tori",
		Decimals:   6,
		TotalPrize: 1_000_000,
		BossName:   "Didier Schmidt",
		BossImage:  "https://bafybeib76uipog5hwot3lo5nrtrzrna2x3irtkiozmbmp6bazvaomwfa7e.ipfs.nftstorage.link/",
		TopN:       500,
		StartsAt:   "2023-08-09T00:00:00",
		EndsAt:     "2023-09-08T00:00:00",
	},
  // Pre-Season 7
  {
    ID:        "Pre-Season 7",
    GameID:    THE_RIOT_GAME_ID,
    BossName:  `== $*=|'¤?")à-£_%`,
    BossImage: "https://bafybeiacz7z2kqoskbtixovgzzdwiuhpfc7z4tac37qpxhjxyyljbp7v6i.ipfs.nftstorage.link/",
    StartsAt:  "2023-09-08T00:00:00",
    EndsAt:    "2023-12-10T00:00:00",
    IsPre:     true,
  },
}

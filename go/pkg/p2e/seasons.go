package p2e

const THE_RIOT_GAME_ID = "riot-game"

type Season struct {
	ID         string
	GameID     string
	Denom      string
	Decimals   int32
	TotalPrize int32
	BossName   string
	BossHp     int32
	TopN       int32 //  Ony send rewards to top N
}

// TODO: We hardcode this right now but should defined in dynamic way in the future (airtable, db...)
// BossHp is in Days
var THE_RIOT_SEASONS = []Season{
	Season{ID: "Season 1", GameID: THE_RIOT_GAME_ID, TotalPrize: 1_800_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov", BossHp: 30, TopN: 500},
	Season{ID: "Season 2", GameID: THE_RIOT_GAME_ID, TotalPrize: 1_710_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov 2", BossHp: 30, TopN: 500},
	Season{ID: "Season 3", GameID: THE_RIOT_GAME_ID, TotalPrize: 1_620_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov 3", BossHp: 30, TopN: 500},
	Season{ID: "Season 4", GameID: THE_RIOT_GAME_ID, TotalPrize: 1_170_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov 4", BossHp: 30, TopN: 500},
	Season{ID: "Season 5", GameID: THE_RIOT_GAME_ID, TotalPrize: 720_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov 5", BossHp: 30, TopN: 500},
	Season{ID: "Season 6", GameID: THE_RIOT_GAME_ID, TotalPrize: 630_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov 6", BossHp: 30, TopN: 500},
	Season{ID: "Season 7", GameID: THE_RIOT_GAME_ID, TotalPrize: 540_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov 7", BossHp: 30, TopN: 500},
	Season{ID: "Season 8", GameID: THE_RIOT_GAME_ID, TotalPrize: 450_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov 8", BossHp: 30, TopN: 500},
	Season{ID: "Season 9", GameID: THE_RIOT_GAME_ID, TotalPrize: 360_000, Denom: "tori", Decimals: 6, BossName: "Philipp Rustov 9", BossHp: 30, TopN: 500},
}

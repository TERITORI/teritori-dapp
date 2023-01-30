package p2e

import (
	"fmt"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/pkg/errors"
)

var (
	COEF = sdk.NewDec(1).Add(sdk.NewDecWithPrec(15, 4)) // 1.0015
)

func GetAllSeasons() []Season {
	return THE_RIOT_SEASONS
}

// returns: season, time passed in days, error
func GetSeasonByTime(gameStartedAt string, givenTime time.Time) (Season, float64, error) {
	layout := "2006-01-02"
	startedAt, err := time.Parse(layout, gameStartedAt)

	if err != nil {
		return Season{}, 0, errors.Wrap(err, "failed to parsed game started time")
	}

	passedDuration := givenTime.Sub(startedAt)

	if passedDuration.Milliseconds() <= 0 {
		return Season{}, 0, errors.New("game has not started yet")
	}

	passedHours := passedDuration.Hours()
	totalHoursFromStart := float64(0)

	for _, season := range GetAllSeasons() {
		totalHoursFromStart += float64(season.BossHp * 24)
		if passedHours <= totalHoursFromStart {
			return season, (totalHoursFromStart - passedHours) / 24, nil
		}
	}

	return Season{}, 0, errors.New("game has ended")
}

// returns: season, time passed in days, error
func GetCurrentSeason(gameStartedAt string) (Season, float64, error) {
	return GetSeasonByTime(gameStartedAt, time.Now().UTC())
}

func GetSeasonById(seasonId string) (Season, error) {
	for _, season := range GetAllSeasons() {
		if seasonId == season.ID {
			return season, nil
		}
	}

	// Not found
	return Season{}, errors.New(fmt.Sprintf("failed to find season by id :%s", seasonId))
}

func GetDailyRewardsConfigBySeason(seasonId string) (sdk.DecCoins, error) {
	season, err := GetSeasonById(seasonId)

	if err != nil {
		return nil, err
	}

	seasonRewards, err := GetRewardsConfigBySeason(season.ID)
	if err != nil {
		return nil, err
	}

	var dailyRewards sdk.DecCoins
	for _, reward := range seasonRewards {
		amount := reward.QuoInt64(int64(season.BossHp))

		// Contract take utori so we need convert tori => utori
		dailyAmountInt := sdk.NewIntWithDecimal(amount.RoundInt64(), int(season.Decimals))
		dailyCoin := sdk.NewDecCoin(season.Denom, dailyAmountInt)
		dailyRewards = append(dailyRewards, dailyCoin)
	}

	return dailyRewards, nil
}

func GetRewardsConfigBySeason(seasonId string) ([]sdk.Dec, error) {
	targetSeason, err := GetSeasonById(seasonId)
	if err != nil {
		return nil, err
	}

	allSeasons := GetAllSeasons()
	if len(allSeasons) == 0 {
		return nil, errors.New("failed to get seasons data")
	}
	baseSeason := allSeasons[0]

	seasonPool := sdk.NewDec(int64(targetSeason.TotalPrize))
	basePool := sdk.NewDec(int64(baseSeason.TotalPrize))

	seasonCoef := seasonPool.Quo(basePool)
	baseRewardsConfig := getBaseRewardsConfig()

	seasonRewards := make([]sdk.Dec, len(baseRewardsConfig))
	for i, baseReward := range baseRewardsConfig {
		seasonRewards[i] = baseReward.Mul(seasonCoef)
	}

	return seasonRewards, nil
}

// Rewards for base season
func getBaseRewardsConfig() []sdk.Dec {
	rankRewardInts := []int64{
		55_000,
		45_000,
		42_000,
		35_000,
		30_000,
		27_500,
		25_000,
		22_500,
		20_000,
		17_500,
		15_000,
		12_500,
		10_000,
		9_000,
		7_750,
		4_750,
		4_500,
		4_250,
		4_170,
		4_152,
	}

	top500Prize := sdk.NewDec(2_000)

	var top21_500 []sdk.Dec
	for i := 20; i < 500; i++ {
		prize := top500Prize.Mul(COEF.Power(uint64(i - 20)))
		top21_500 = append([]sdk.Dec{prize}, top21_500...)
	}

	var rankRewards []sdk.Dec
	for _, rewardInt := range rankRewardInts {
		rankRewards = append(rankRewards, sdk.NewDec(rewardInt))
	}

	rankRewards = append(rankRewards, top21_500...)

	return rankRewards
}

package p2e

import (
	"fmt"
	"math"
	"time"

	"github.com/pkg/errors"
)

const COEF = 1.0015

type Season struct {
	ID         int32
	TotalPrize int32
	BossName   string
	BossHp     int32
}

// BossHp is in Days
var SEASONS = []Season{
	Season{ID: 1, TotalPrize: 1_800_000, BossName: "Philipp Rustov", BossHp: 30},
	Season{ID: 2, TotalPrize: 1_710_000, BossName: "Philipp Rustov 2", BossHp: 30},
	Season{ID: 3, TotalPrize: 1_620_000, BossName: "Philipp Rustov 3", BossHp: 30},
	Season{ID: 4, TotalPrize: 1_170_000, BossName: "Philipp Rustov 4", BossHp: 30},
	Season{ID: 5, TotalPrize: 720_000, BossName: "Philipp Rustov 5", BossHp: 30},
	Season{ID: 6, TotalPrize: 630_000, BossName: "Philipp Rustov 6", BossHp: 30},
	Season{ID: 7, TotalPrize: 540_000, BossName: "Philipp Rustov 7", BossHp: 30},
	Season{ID: 8, TotalPrize: 450_000, BossName: "Philipp Rustov 8", BossHp: 30},
	Season{ID: 9, TotalPrize: 360_000, BossName: "Philipp Rustov 9", BossHp: 30},
}

func GetAllSeasons() []Season {
	return SEASONS
}

func GetCurrentSeason(firstSeasonStartedAt string) (Season, float64, error) {
	layout := "2006-01-02"
	startedAt, err := time.Parse(layout, firstSeasonStartedAt)

	if err != nil {
		return Season{}, 0, errors.Wrap(err, "failed to parsed riot started at time")
	}

	now := time.Now().UTC()
	passedDuration := now.Sub(startedAt)

	if passedDuration.Milliseconds() <= 0 {
		return Season{}, 0, errors.New("game has not started yet")
	}

	passedHours := passedDuration.Hours()
	totalHoursFromStart := float64(0)

	for _, season := range SEASONS {
		totalHoursFromStart += float64(season.BossHp * 24)
		if passedHours <= totalHoursFromStart {
			return season, (totalHoursFromStart - passedHours) / 24, nil
		}
	}

	return Season{}, 0, errors.New("game has ended")
}

func findSeasonById(seasonId int32) (Season, error) {
	for _, season := range SEASONS {
		if seasonId == season.ID {
			return season, nil
		}
	}

	// Not found
	return Season{}, errors.New(fmt.Sprintf("failed to find season by id :%d", seasonId))
}

func GetCurrentRewardsConfig(startedAtStr string) ([]float64, error) {
	currentSeason, _, err := GetCurrentSeason(startedAtStr)
	if err != nil {
		return nil, err
	}

	rewardsConfig, err := GetRewardsConfigBySeason(currentSeason.ID)
	if err != nil {
		return nil, err
	}

	return rewardsConfig, nil
}

func GetRewardsConfigBySeason(seasonId int32) ([]float64, error) {
	var targetSeason Season
	var firstSeason Season

	targetSeason, err := findSeasonById(seasonId)
	if err != nil {
		return nil, err
	}

	firstSeason, err2 := findSeasonById(1)
	if err2 != nil {
		return nil, err2
	}

	seasonCoef := float64(targetSeason.TotalPrize) / float64(firstSeason.TotalPrize)
	baseRewardsConfig := getBaseRewardsConfig()

	seasonRewards := make([]float64, len(baseRewardsConfig))
	for i, baseReward := range baseRewardsConfig {
		seasonRewards[i] = baseReward * seasonCoef
	}
	return seasonRewards, nil
}

// Rewards for first season
func getBaseRewardsConfig() []float64 {
	rankRewards := []float64{
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

	top500Prize := float64(2_000)

	var top21_500 []float64
	for i := 20; i < 500; i++ {
		prizeFloat := top500Prize * math.Pow(COEF, float64(i-20))
		prizeInt := math.Round(prizeFloat)
		top21_500 = append([]float64{prizeInt}, top21_500...)
	}

	rankRewards = append(rankRewards, top21_500...)

	return rankRewards
}

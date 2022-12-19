package main

import (
	"fmt"
	"math"

	"github.com/pkg/errors"
)

const COEF = 1.0015

var MONTHLY_REWARDS = map[string]float64{
	"2022-12": 1_800_000.00,
	"2023-01": 1_710_000.00,
	"2023-02": 1_620_000.00,
	"2023-03": 1_170_000.00,
	"2023-04": 720_000.00,
	"2023-05": 630_000.00,
	"2023-06": 540_000.00,
	"2023-07": 450_000.00,
	"2023-08": 360_000.00,
}

func GetRankRewardsByMonth(month string) ([]float64, error) {
	monthlyRewards, ok := MONTHLY_REWARDS[month]

	if ok {
		monthlyCoef := monthlyRewards / MONTHLY_REWARDS["2022-12"]
		baseRewards := getBaseRankRewards()

		monthlyRewards := make([]float64, len(baseRewards))
		for i, baseReward := range baseRewards {
			monthlyRewards[i] = baseReward * monthlyCoef
		}
		return monthlyRewards, nil
	}

	return nil, errors.New(fmt.Sprintf("failed to get rewards for month: %s", month))
}

// Rank rewards for December
func getBaseRankRewards() []float64 {
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

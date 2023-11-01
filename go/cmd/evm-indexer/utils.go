package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"

	pbsubstreams "github.com/streamingfast/substreams/pb/sf/substreams/v1"
)

func readBlockRange(module *pbsubstreams.Module, input string) (start int64, stop uint64, err error) {
	if input == "" {
		input = "-1"
	}

	before, after, found := strings.Cut(input, ":")

	beforeRelative := strings.HasPrefix(before, "+")
	beforeInt64, err := strconv.ParseInt(strings.TrimPrefix(before, "+"), 0, 64)
	if err != nil {
		return 0, 0, fmt.Errorf("invalid block number value %q: %w", before, err)
	}

	afterRelative := false
	afterInt64 := int64(0)
	if found {
		afterRelative = strings.HasPrefix(after, "+")
		afterInt64, err = strconv.ParseInt(after, 0, 64)
		if err != nil {
			return 0, 0, fmt.Errorf("invalid block number value %q: %w", after, err)
		}
	}

	// If there is no `:` we assume it's a stop block value right away
	if !found {
		start = int64(module.InitialBlock)
		stop = uint64(resolveBlockNumber(beforeInt64, 0, beforeRelative, uint64(start)))
	} else {
		start = resolveBlockNumber(beforeInt64, int64(module.InitialBlock), beforeRelative, module.InitialBlock)
		stop = uint64(resolveBlockNumber(afterInt64, 0, afterRelative, uint64(start)))
	}

	return
}

func resolveBlockNumber(value int64, ifMinus1 int64, relative bool, against uint64) int64 {
	if !relative {
		if value < 0 {
			return ifMinus1
		}

		return value
	}

	return int64(against) + value
}

func toEnvName(flagName string) string {
	return strings.ToUpper(strings.Replace(flagName, "-", "_", -1))
}

func mustGetEnv(flagName string) string {
	envName := toEnvName(flagName)
	envVal := os.Getenv(envName)
	if envVal == "" {
		panic(fmt.Sprintf("missing value for --%s", flagName))
	}
	return envVal
}

func MustGetFlagString(flagName string) string {
	flagVal := viper.GetString("sink-" + flagName)
	if flagVal == "" {
		flagVal = mustGetEnv(flagName)
	}
	return flagVal
}

func MustGetFlagUint64(flagName string) uint64 {
	flagVal := MustGetFlagString(flagName)
	flagValUint64, err := strconv.ParseUint(flagVal, 10, 64)
	if err != nil {
		panic(fmt.Sprintf("failed to parse Uint64 for %s", flagVal))
	}
	return flagValUint64
}

func MustLoadEnv() {
	globalEnv := ".env"
	err := godotenv.Load(globalEnv)
	if err != nil {
		zlog.Info(fmt.Sprintf("failed to load env files: %s", err))
	}

	// Dont panic here, if we cannot load env from file, then maybe env var are already injected in env
}

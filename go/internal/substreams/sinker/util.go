package sinker

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
)

func getLocalABI(path string) string {
	abiFile, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer abiFile.Close()

	result, err := io.ReadAll(abiFile)
	if err != nil {
		panic(err)
	}
	return string(result)
}

// parseNumber parses a number and indicates whether the number is relative, meaning it starts with a +
func parseNumber(number string) (int64, bool, error) {
	numberIsRelative := strings.HasPrefix(number, "+")
	numberInt64, err := strconv.ParseInt(strings.TrimPrefix(number, "+"), 0, 64)
	if err != nil {
		return 0, false, fmt.Errorf("invalid block number value: %w", err)
	}
	return numberInt64, numberIsRelative, nil
}

func resolveBlockNumber(value int64, defaultIfNegative uint64, relative bool, against uint64) uint64 {
	if !relative {
		if value < 0 {
			return defaultIfNegative
		}
		return uint64(value)
	}
	return uint64(int64(against) + value)
}

func mustLoadABI(abiPath string) abi.ABI {
	ABI, err := abi.JSON(
		strings.NewReader(getLocalABI(abiPath)),
	)
	if err != nil {
		panic("failed to load squad staking ABI")
	}
	return ABI
}

func isSameAddress(addr1 string, addr2 string) bool {
	return strings.EqualFold(addr1, addr2)
}

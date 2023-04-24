package sinker

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/pkg/errors"
	"github.com/streamingfast/bstream"
	pbsubstreams "github.com/streamingfast/substreams/pb/sf/substreams/v1"
)

// parseNumber parses a number and indicates whether the number is relative, meaning it starts with a +
func parseNumber(number string) (int64, bool, error) {
	numberIsRelative := strings.HasPrefix(number, "+")
	numberInt64, err := strconv.ParseInt(strings.TrimPrefix(number, "+"), 0, 64)
	if err != nil {
		return 0, false, fmt.Errorf("invalid block number value: %w", err)
	}
	return numberInt64, numberIsRelative, nil
}

func resolveBlockRange(blockRangeInput string, outputModule *pbsubstreams.Module) (*bstream.Range, error) {
	if blockRangeInput == "" {
		blockRangeInput = "-1"
	}

	before, after, hasTwoNumbers := strings.Cut(blockRangeInput, ":")

	beforeInt64, beforeIsRelative, err := parseNumber(before)
	if err != nil {
		return nil, fmt.Errorf("parse number %q: %w", before, err)
	}

	afterIsRelative := false
	afterInt64 := int64(0)
	if hasTwoNumbers {
		afterInt64, afterIsRelative, err = parseNumber(after)
		if err != nil {
			return nil, fmt.Errorf("parse number %q: %w", after, err)
		}

	}

	// If there is no `:` we assume it's a stop block value right away
	if !hasTwoNumbers {
		if beforeInt64 < 1 {
			return bstream.NewOpenRange(outputModule.InitialBlock), nil
		}
		start := outputModule.InitialBlock
		stop := resolveBlockNumber(beforeInt64, 0, beforeIsRelative, start)
		return bstream.NewRangeExcludingEnd(start, stop), nil
	}

	start := resolveBlockNumber(beforeInt64, outputModule.InitialBlock, beforeIsRelative, outputModule.InitialBlock)
	if afterInt64 == -1 {
		return bstream.NewOpenRange(start), nil
	}
	return bstream.NewRangeExcludingEnd(start, resolveBlockNumber(afterInt64, 0, afterIsRelative, start)), nil
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
		strings.NewReader(GetLocalABI(abiPath)),
	)
	if err != nil {
		panic("failed to load squad staking ABI")
	}
	return ABI
}

func isSameAddress(addr1 string, addr2 string) bool {
	return strings.EqualFold(addr1, addr2)
}

func ParseMethod(contractABI *abi.ABI, callData []byte) (*abi.Method, error) {
	methodSigData := callData[:4]
	method, err := contractABI.MethodById(methodSigData)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse method name")
	}
	return method, nil
}

func DecodeCallData(contractABI *abi.ABI, data []byte) (*abi.Method, []byte, map[string]interface{}) {
	// The first 4 bytes of the t represent the ID of the method in the ABI
	// https://docs.soliditylang.org/en/v0.5.3/abi-spec.html#function-selector
	methodSigData := data[:4]
	method, err := contractABI.MethodById(methodSigData)
	if err != nil {
		panic(err)
	}

	inputsSigData := data[4:]
	inputsMap := make(map[string]interface{})
	if err := method.Inputs.UnpackIntoMap(inputsMap, inputsSigData); err != nil {
		panic(err)
	}

	te, err := method.Inputs.Unpack(inputsSigData)
	if err != nil {
		panic(err)
	}

	fmt.Println(te, "===========================")

	return method, data, inputsMap
}

package contractutil

import (
	"context"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"flag"

	"github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/pkg/errors"
)

func GetQueryClientCtx(chainId string, rpcEndpoint string) client.Context {
	clientCtx := client.Context{}.
		WithChainID(chainId).
		WithOutputFormat("text")

	clientCtx = SetClient(clientCtx, rpcEndpoint)

	return clientCtx
}

func asciiDecodeString(s string) ([]byte, error) {
	return []byte(s), nil
}

type argumentDecoder struct {
	// dec is the default decoder
	dec                func(string) ([]byte, error)
	asciiF, hexF, b64F bool
}

func newArgDecoder(def func(string) ([]byte, error)) *argumentDecoder {
	return &argumentDecoder{dec: def}
}

func (a *argumentDecoder) RegisterFlags(f *flag.FlagSet, argName string) {
	f.BoolVar(&a.asciiF, "ascii", false, "ascii encoded "+argName)
	f.BoolVar(&a.hexF, "hex", false, "hex encoded "+argName)
	f.BoolVar(&a.b64F, "b64", false, "base64 encoded "+argName)
}

func (a *argumentDecoder) DecodeString(s string) ([]byte, error) {
	found := -1
	for i, v := range []*bool{&a.asciiF, &a.hexF, &a.b64F} {
		if !*v {
			continue
		}
		if found != -1 {
			return nil, errors.New("multiple decoding flags used")
		}
		found = i
	}
	switch found {
	case 0:
		return asciiDecodeString(s)
	case 1:
		return hex.DecodeString(s)
	case 2:
		return base64.StdEncoding.DecodeString(s)
	default:
		return a.dec(s)
	}
}

func QueryWasm(contract string, queryMsg string, chainId string, rpcEndpoint string) []byte {
	InitConfig()

	clientCtx := GetQueryClientCtx(chainId, rpcEndpoint)

	decoder := newArgDecoder(asciiDecodeString)
	queryData, err := decoder.DecodeString(queryMsg)
	if err != nil {
		panic(errors.Wrap(err, "failed to decode query"))
	}
	if !json.Valid(queryData) {
		panic(errors.Wrap(err, "data must be json"))
	}

	queryClient := types.NewQueryClient(clientCtx)
	res, err := queryClient.SmartContractState(
		context.Background(),
		&types.QuerySmartContractStateRequest{
			Address:   contract,
			QueryData: queryData,
		},
	)
	if err != nil {
		panic(errors.Wrap(err, "failed to query"))
	}

	return res.Data
}

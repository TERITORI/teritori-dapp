package contractutil

import (
	"context"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"flag"
	"os"
	"path/filepath"

	"github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/cosmos/cosmos-sdk/client"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authTypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/pkg/errors"
)

func GetQueryClientCtx(sender string, chainId string, rpcEndpoint string) client.Context {
	fromAccAddress, err := sdk.AccAddressFromBech32(sender)
	if err != nil {
		panic(errors.Wrap(err, "failed to parse sender address"))
	}

	clientCtx := client.Context{}.
		WithFromAddress(fromAccAddress).
		WithChainID(chainId).
		WithOutputFormat("text")

	clientCtx = SetClient(clientCtx, rpcEndpoint)

	return clientCtx
}

func GetClientCtx(sender string, mnemonic string, chainId string, keyName string, rpcEndpoint string) client.Context {
	encodingConfig := InitEncoding()

	fromAccAddress, err := sdk.AccAddressFromBech32(sender)
	if err != nil {
		panic(errors.Wrap(err, "failed to parse sender address"))
	}

	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		panic(errors.Wrap(err, "failed to get user home dir"))
	}
	homeDir := filepath.Join(userHomeDir, ".teritorid")

	clientCtx := client.Context{}.
		WithFromAddress(fromAccAddress).
		WithChainID(chainId).
		WithCodec(encodingConfig.Marshaler).
		WithInterfaceRegistry(encodingConfig.InterfaceRegistry).
		WithInput(os.Stdin).
		WithOutput(nil).
		WithOutputFormat("text").
		WithHeight(0).
		WithHomeDir(homeDir).
		WithFrom(keyName).
		WithBroadcastMode("sync").
		WithFromName(keyName).
		WithSignModeStr("").
		WithUseLedger(false).
		WithSimulation(false).
		WithGenerateOnly(false).
		WithOffline(false).
		WithSkipConfirmation(true).
		WithAccountRetriever(authTypes.AccountRetriever{}).
		WithNodeURI(rpcEndpoint).
		WithLegacyAmino(encodingConfig.Amino).
		WithTxConfig(encodingConfig.TxConfig).
		WithViper("")

	clientCtx = SetKeyring(clientCtx, keyName, mnemonic)
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

func QueryWasm(sender string, contract string, queryMsg string, chainId string, rpcEndpoint string) []byte {
	InitConfig()

	clientCtx := GetQueryClientCtx(sender, chainId, rpcEndpoint)

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

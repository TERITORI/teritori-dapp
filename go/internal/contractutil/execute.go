package contractutil

import (
	"os"
	"path/filepath"

	"github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/tx"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/tx/signing"
	authTypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/pkg/errors"
)

func GetExecClientCtx(sender string, mnemonic string, chainId string, keyName string, rpcEndpoint string) client.Context {
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
		WithOutputFormat("text").
		WithHomeDir(homeDir).
		WithFrom(keyName).
		WithBroadcastMode("sync").
		WithFromName(keyName).
		WithSkipConfirmation(true).
		WithAccountRetriever(authTypes.AccountRetriever{}).
		WithNodeURI(rpcEndpoint).
		WithLegacyAmino(encodingConfig.Amino).
		WithTxConfig(encodingConfig.TxConfig)

	clientCtx = SetKeyring(clientCtx, keyName, mnemonic)
	clientCtx = SetClient(clientCtx, rpcEndpoint)

	return clientCtx
}

func GetExecMsg(sender string, contract string, execMsg string, funds sdk.Coins) types.MsgExecuteContract {
	msg := types.MsgExecuteContract{
		Sender:   sender,
		Contract: contract,
		Funds:    funds,
		Msg:      []byte(execMsg),
	}
	if err := msg.ValidateBasic(); err != nil {
		panic(errors.Wrap(err, "failed to build execute message"))
	}
	return msg
}

func GetExecTxFactory(
	clientCtx client.Context,
	chainId string,
	memo string,
	fees string,
	gasPrices string,
	gasAdjustment float64,
) tx.Factory {
	txf := tx.Factory{}.
		WithKeybase(clientCtx.Keyring).
		WithTxConfig(clientCtx.TxConfig).
		WithAccountRetriever(clientCtx.AccountRetriever).
		WithAccountNumber(0).
		WithSequence(0).
		WithGas(0).
		WithTimeoutHeight(0).
		WithGasAdjustment(gasAdjustment).
		WithChainID(chainId).
		WithMemo(memo).
		WithFees(fees).
		WithGasPrices(gasPrices).
		WithSignMode(signing.SignMode_SIGN_MODE_UNSPECIFIED).
		WithSimulateAndExecute(true)
	return txf
}

func ExecuteWasm(
	sender string,
	mnemonic string,
	contract string,
	execMsg string,
	funds sdk.Coins,
	chainId string,
	rpcEndpoint string,
	keyName string,
	memo string,
	fees string,
	gasPrices string,
	gasAdjustment float64,
) {
	const KEY_NAME = "__MemoryKeyName__"

	// Set default values
	if keyName == "" {
		keyName = KEY_NAME
	}

	InitConfig("tori")

	msg := GetExecMsg(sender, contract, execMsg, funds)
	clientCtx := GetExecClientCtx(sender, mnemonic, chainId, keyName, rpcEndpoint)
	txFactory := GetExecTxFactory(clientCtx, chainId, memo, fees, gasPrices, gasAdjustment)

	txErr := tx.BroadcastTx(clientCtx, txFactory, &msg)
	if txErr != nil {
		panic(errors.Wrap(txErr, "failed to generate/broadcast tx"))
	}

}

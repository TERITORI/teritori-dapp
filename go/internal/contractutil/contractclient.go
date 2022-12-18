package contractutil

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/tx/signing"
	authTypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/pkg/errors"
	"github.com/tendermint/tendermint/rpc/client/http"
)

const KEY_NAME = "__MemoryKeyName__"
const HD_PATH = "m/44'/118'/0'/0/0"
const ALGO_NAME = "secp256k1"

type ContractClient struct {
	ChainId             string
	Bech32PrefixAccAddr string
	RpcEndpoint         string
	Fees                string
	GasPrices           string
	GasAdjustment       float64
	Memo                string
	ExecClientCtx       client.Context
	QueryClientCtx      client.Context
	ExecTxFactory       tx.Factory
}

func (cc *ContractClient) InitConfig() {
	config := sdk.GetConfig()

	var (
		Bech32PrefixAccPub   = cc.Bech32PrefixAccAddr + "pub"
		Bech32PrefixValAddr  = cc.Bech32PrefixAccAddr + "valoper"
		Bech32PrefixValPub   = cc.Bech32PrefixAccAddr + "valoperpub"
		Bech32PrefixConsAddr = cc.Bech32PrefixAccAddr + "valcons"
		Bech32PrefixConsPub  = cc.Bech32PrefixAccAddr + "valconspub"
	)

	config.SetBech32PrefixForAccount(cc.Bech32PrefixAccAddr, Bech32PrefixAccPub)
	config.SetBech32PrefixForValidator(Bech32PrefixValAddr, Bech32PrefixValPub)
	config.SetBech32PrefixForConsensusNode(Bech32PrefixConsAddr, Bech32PrefixConsPub)
}

func (cc *ContractClient) GetKeyring(mnemonic string) (keyring.Keyring, error) {
	kb := keyring.NewInMemory(cc.ExecClientCtx.KeyringOptions...)
	keyringAlgos, _ := kb.SupportedAlgorithms()
	algo, algoErr := keyring.NewSigningAlgoFromString(ALGO_NAME, keyringAlgos)
	if algoErr != nil {
		return nil, errors.Wrap(algoErr, "failed to create algo")
	}

	_, accErr := kb.NewAccount(KEY_NAME, mnemonic, "", HD_PATH, algo)
	if accErr != nil {
		return nil, errors.Wrap(accErr, "failed to get account from mnemonic")
	}

	return kb, nil
}

func (cc *ContractClient) GetClient() (*http.HTTP, error) {
	client, err := client.NewClientFromNode(cc.RpcEndpoint)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get client from node")
	}
	return client, nil
}

func (cc *ContractClient) InitExecTxFactory(memo string) {
	cc.ExecTxFactory = tx.Factory{}.
		WithKeybase(cc.ExecClientCtx.Keyring).
		WithTxConfig(cc.ExecClientCtx.TxConfig).
		WithAccountRetriever(cc.ExecClientCtx.AccountRetriever).
		WithGasAdjustment(cc.GasAdjustment).
		WithChainID(cc.ChainId).
		WithFees(cc.Fees).
		WithGasPrices(cc.GasPrices).
		WithMemo(memo).
		WithSignMode(signing.SignMode_SIGN_MODE_UNSPECIFIED)
}

func (cc *ContractClient) InitQueryClientCtx() error {
	rpcClient, err := cc.GetClient()
	if err != nil {
		return errors.Wrap(err, "failed to get rpc client")
	}

	cc.QueryClientCtx = client.Context{}.
		WithChainID(cc.ChainId).
		WithClient(rpcClient)

	return nil
}

func (cc *ContractClient) InitExecClientCtx(sender string, mnemonic string) error {
	encodingConfig := InitEncoding()

	fromAccAddress, err := sdk.AccAddressFromBech32(sender)
	if err != nil {
		return errors.Wrap(err, "failed to parse sender address")
	}

	keyring, err := cc.GetKeyring(mnemonic)
	if err != nil {
		return errors.Wrap(err, "failed to get keyring")
	}

	rpcClient, err := cc.GetClient()
	if err != nil {
		return errors.Wrap(err, "failed to get rpc client")
	}

	cc.ExecClientCtx = client.Context{}.
		WithFromAddress(fromAccAddress).
		WithChainID(cc.ChainId).
		WithNodeURI(cc.RpcEndpoint).
		WithFrom(KEY_NAME).
		WithFromName(KEY_NAME).
		WithBroadcastMode("sync").
		WithSkipConfirmation(true).
		WithAccountRetriever(authTypes.AccountRetriever{}).
		WithLegacyAmino(encodingConfig.Amino).
		WithTxConfig(encodingConfig.TxConfig).
		WithCodec(encodingConfig.Marshaler).
		WithInterfaceRegistry(encodingConfig.InterfaceRegistry).
		WithKeyring(keyring).
		WithClient(rpcClient)

	return nil
}

func (cc *ContractClient) BuildExecMsg(sender string, contract string, execMsg string, funds sdk.Coins) (*types.MsgExecuteContract, error) {
	msg := types.MsgExecuteContract{
		Sender:   sender,
		Contract: contract,
		Funds:    funds,
		Msg:      []byte(execMsg),
	}
	if err := msg.ValidateBasic(); err != nil {
		return nil, errors.Wrap(err, "ValidateBasic error")
	}
	return &msg, nil
}

func (cc *ContractClient) BroadcastTx(msgs ...sdk.Msg) (*sdk.TxResponse, error) {
	txf, err := prepareFactory(cc.ExecClientCtx, cc.ExecTxFactory)
	if err != nil {
		return nil, err
	}

	_, adjusted, err := tx.CalculateGas(cc.ExecClientCtx, txf, msgs...)
	if err != nil {
		return nil, err
	}

	txf = txf.WithGas(adjusted)

	unsignedTx, err := tx.BuildUnsignedTx(txf, msgs...)
	if err != nil {
		return nil, err
	}

	unsignedTx.SetFeeGranter(cc.ExecClientCtx.GetFeeGranterAddress())
	err = tx.Sign(txf, cc.ExecClientCtx.GetFromName(), unsignedTx, true)
	if err != nil {
		return nil, err
	}

	txBytes, err := cc.ExecClientCtx.TxConfig.TxEncoder()(unsignedTx.GetTx())
	if err != nil {
		return nil, err
	}

	// broadcast to a Tendermint node
	return cc.ExecClientCtx.BroadcastTx(txBytes)
}

func (cc *ContractClient) ExecuteWasm(sender string, mnemonic string, contract string, execMsg string, funds sdk.Coins, memo string) (*sdk.TxResponse, error) {
	cc.InitConfig()
	if err := cc.InitExecClientCtx(sender, mnemonic); err != nil {
		return nil, errors.Wrap(err, "failed to build client context")
	}
	cc.InitExecTxFactory(memo)

	msg, err := cc.BuildExecMsg(sender, contract, execMsg, funds)
	if err != nil {
		return nil, errors.Wrap(err, "failed to build exec message")
	}

	txResponse, err := cc.BroadcastTx(msg)

	if err != nil {
		return nil, errors.Wrap(err, "failed to broadcast tx")
	}

	if txResponse.RawLog != "[]" {
		return nil, errors.New(fmt.Sprintf("failed to broadcast tx: %s", txResponse.RawLog))
	}

	return txResponse, nil
}

func (cc *ContractClient) QueryWasm(contract string, queryMsg string) (map[string]interface{}, error) {
	cc.InitConfig()
	cc.InitQueryClientCtx()

	decoder := newArgDecoder(asciiDecodeString)
	queryData, err := decoder.DecodeString(queryMsg)

	if err != nil {
		return nil, errors.Wrap(err, "failed to decode query")
	}

	if !json.Valid(queryData) {
		return nil, errors.Wrap(err, "data must be json")
	}

	queryClient := types.NewQueryClient(cc.QueryClientCtx)
	res, err := queryClient.SmartContractState(
		context.Background(),
		&types.QuerySmartContractStateRequest{
			Address:   contract,
			QueryData: queryData,
		},
	)
	if err != nil {
		return nil, errors.Wrap(err, "failed to query")
	}

	data := make(map[string]any)
	if json.Unmarshal(res.Data, &data) != nil {
		return nil, errors.Wrap(err, "failed to parse response data")
	}
	return data, nil
}

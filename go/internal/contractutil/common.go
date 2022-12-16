package contractutil

import (
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	"github.com/pkg/errors"
)

func SetKeyring(clientCtx client.Context, keyName string, mnemonic string) client.Context {
	const HD_PATH = "m/44'/118'/0'/0/0"
	const ALGO = "secp256k1"

	kb := keyring.NewInMemory(clientCtx.KeyringOptions...)
	keyringAlgos, _ := kb.SupportedAlgorithms()
	algo, algoErr := keyring.NewSigningAlgoFromString(ALGO, keyringAlgos)
	if algoErr != nil {
		panic(errors.Wrap(algoErr, "failed to create algo"))
	}

	_, accErr := kb.NewAccount(keyName, mnemonic, "", HD_PATH, algo)
	if accErr != nil {
		panic(errors.Wrap(accErr, "failed to create account"))
	}

	clientCtx = clientCtx.WithKeyring(kb)
	return clientCtx
}

func SetClient(clientCtx client.Context, rpcEndpoint string) client.Context {
	client, err := client.NewClientFromNode(rpcEndpoint)
	if err != nil {
		panic(err)
	}
	clientCtx = clientCtx.WithClient(client)
	return clientCtx
}

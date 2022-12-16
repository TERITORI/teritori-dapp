package contractutil

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func InitConfig(bech32PrefixAccAddr string) sdk.Config {
	config := sdk.GetConfig()

	Bech32PrefixAccAddr := bech32PrefixAccAddr

	var (
		Bech32PrefixAccPub   = Bech32PrefixAccAddr + "pub"
		Bech32PrefixValAddr  = Bech32PrefixAccAddr + "valoper"
		Bech32PrefixValPub   = Bech32PrefixAccAddr + "valoperpub"
		Bech32PrefixConsAddr = Bech32PrefixAccAddr + "valcons"
		Bech32PrefixConsPub  = Bech32PrefixAccAddr + "valconspub"
	)

	config.SetBech32PrefixForAccount(Bech32PrefixAccAddr, Bech32PrefixAccPub)
	config.SetBech32PrefixForValidator(Bech32PrefixValAddr, Bech32PrefixValPub)
	config.SetBech32PrefixForConsensusNode(Bech32PrefixConsAddr, Bech32PrefixConsPub)

	return *config
}

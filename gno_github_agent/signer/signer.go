package signer

import (
	"fmt"

	"github.com/gnolang/gno/gno.land/pkg/gnoclient"
	"github.com/gnolang/gno/gno.land/pkg/sdk/vm"
	rpcclient "github.com/gnolang/gno/tm2/pkg/bft/rpc/client"
	"github.com/gnolang/gno/tm2/pkg/crypto/keys"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Signer struct {
	db        *gorm.DB
	logger    *zap.SugaredLogger
	keyInfo   keys.Info
	gnoclient *gnoclient.Client
	realmPath string
}

func New(db *gorm.DB,
	logger *zap.SugaredLogger,
	mnemonic, chainID,
	rpcAddr,
	realmPath string,
) *Signer {
	signer, err := gnoclient.SignerFromBip39(mnemonic, chainID, "", 0, 0)
	if err != nil {
		panic(err)
	}

	keyInfo, err := signer.Info()
	if err != nil {
		panic(err)
	}

	// Initialize the RPC client
	rpc, err := rpcclient.NewHTTPClient(rpcAddr)
	if err != nil {
		panic(err)
	}

	// Initialize the gnoclient
	client := gnoclient.Client{
		Signer:    signer,
		RPCClient: rpc,
	}

	return &Signer{
		db:        db,
		logger:    logger,
		keyInfo:   keyInfo,
		realmPath: realmPath,
		gnoclient: &client,
	}
}

func (s *Signer) CallVerify(address string) error {
	acc, _, err := s.gnoclient.QueryAccount(s.keyInfo.GetAddress())
	if err != nil {
		return fmt.Errorf("failed to query account: %w", err)
	}

	baseCfg := gnoclient.BaseTxCfg{
		GasFee:         "1000000ugnot",
		GasWanted:      3000000,
		AccountNumber:  acc.GetAccountNumber(),
		SequenceNumber: acc.GetSequence(),
		Memo:           "ghverify-agent",
	}

	arg := "ingest," + address + ",OK"

	_, err = s.gnoclient.Call(baseCfg, vm.MsgCall{
		Caller:  s.keyInfo.GetAddress(),
		Send:    nil,
		PkgPath: s.realmPath,
		Func:    "GnorkleEntrypoint",
		Args:    []string{arg},
	})
	if err != nil {
		return fmt.Errorf("failed to call gnoclient: %s", err.Error())
	}

	return nil
}

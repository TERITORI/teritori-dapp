package multisig

import (
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/multisigpb"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type UserMultisig struct {
	MultisigChainID string `gorm:"primaryKey"`
	UserAddress     string `gorm:"primaryKey"`
	MultisigAddress string `gorm:"primaryKey"`
	Multisig        Multisig
	CreatedAt       time.Time `gorm:"index"`
	UpdatedAt       time.Time
	Joined          bool `gorm:"index"`
	Name            string
}

type Multisig struct {
	ChainID      string `gorm:"primaryKey"`
	Address      string `gorm:"primaryKey"`
	CreatedAt    time.Time
	Threshold    uint32
	MembersCount uint32
	PubKeyJSON   string
	Users        []UserMultisig
}

type Transaction struct {
	ID              uint `gorm:"primaryKey"` // TODO: replace with proto-hash
	MsgsJSON        datatypes.JSON
	FeeJSON         string
	MultisigChainID string
	MultisigAddress string
	Multisig        Multisig
	AccountNumber   uint32    // TODO: check if need ensure unique, can we have two multisig with same address but different account number, maybe it needs to have a combined unique index with sequence
	Sequence        uint32    // TODO: ensure unique for multisig
	FinalHash       *string   `gorm:"uniqueIndex"`
	CreatedAt       time.Time `gorm:"index"`
	UpdatedAt       time.Time
	CreatorAddress  string
	Signatures      []Signature
	Type            string `gorm:"index"`
}

type Signature struct {
	Signature     string
	TransactionID uint `gorm:"primaryKey"`
	Transaction   Transaction
	BodyBytes     []byte // it's weird to store this here, but it did not find another way to generate the correct body bytes in client yet
	CreatedAt     time.Time
	UserAddress   string `gorm:"primaryKey"`
}

func transactionsQuery(db *gorm.DB, userAddress string, chainId string, multisigAddress string, executionState multisigpb.ExecutionState, types []string) *gorm.DB {
	// we can't use .Joins(...) on signatures because it does not expect a slice
	query := db.Model(&Transaction{}).
		Joins("Multisig").
		Joins("JOIN user_multisigs ON user_multisigs.multisig_address = Multisig.address AND user_multisigs.multisig_chain_id = Multisig.chain_id AND user_multisigs.user_address = ?", userAddress).
		Preload("Signatures")

	query = query.Where("user_multisigs.user_address = ?", userAddress)

	if chainId != "" {
		query = query.Where("transactions.multisig_chain_id = ?", chainId)
	}

	if multisigAddress == "" {
		query = query.Where("user_multisigs.joined = ?", true)
	} else {
		query = query.Where("transactions.multisig_address = ?", multisigAddress)
	}

	if executionState != multisigpb.ExecutionState_EXECUTION_STATE_UNSPECIFIED {
		if executionState == multisigpb.ExecutionState_EXECUTION_STATE_EXECUTED {
			query = query.Where("transactions.final_hash IS NOT NULL")
		} else {
			query = query.Where("transactions.final_hash IS NULL")
		}
	}

	if len(types) > 0 {
		query = query.Where("transactions.type IN ?", types)
	}

	return query
}

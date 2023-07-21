package multisig

import (
	"bytes"
	"context"
	"crypto/ed25519"
	srand "crypto/rand"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/multisigpb"
	"github.com/cosmos/cosmos-sdk/codec/legacy"
	"github.com/cosmos/cosmos-sdk/crypto/keys/multisig"
	"github.com/cosmos/cosmos-sdk/types/bech32"
	"github.com/pkg/errors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const universalBech32Prefix = "user"

type multisigService struct {
	multisigpb.UnimplementedMultisigServiceServer

	publicKey      ed25519.PublicKey
	privateKey     ed25519.PrivateKey
	tokensDuration time.Duration
	db             *gorm.DB
}

func NewMultisigService(tokensDuration time.Duration, dbPath string) (multisigpb.MultisigServiceServer, error) {
	publicKey, privateKey, err := ed25519.GenerateKey(srand.Reader)
	if err != nil {
		return nil, errors.Wrap(err, "failed to generate key")
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, errors.Wrap(err, "failed to open db")
	}
	if err := db.AutoMigrate(&Token{}, &Multisig{}, &UserMultisig{}, &Transaction{}); err != nil {
		return nil, errors.Wrap(err, "failed to migrate db")
	}

	return &multisigService{
		publicKey:      publicKey,
		privateKey:     privateKey,
		tokensDuration: tokensDuration,
		db:             db,
	}, nil
}

// Read
func (s *multisigService) Multisigs(_ context.Context, req *multisigpb.MultisigsRequest) (*multisigpb.MultisigsResponse, error) {
	var multisigs []*multisigpb.Multisig

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		userAddress, err := s.authenticate(tx, req.GetAuthToken())
		if err != nil {
			return errors.Wrap(err, "failed to authenticate")
		}

		limit := int(req.Limit)
		if limit == 0 {
			limit = 10
		}

		query := tx
		if req.ChainId != "" {
			query = query.Where("chain_id = ?", req.ChainId)
		}
		if req.GetJoinState() != multisigpb.JoinState_JOIN_STATE_UNSPECIFIED {
			query = query.Where("joined = ?", req.GetJoinState() == multisigpb.JoinState_JOIN_STATE_IN)
		}
		if req.GetStartAfter() != 0 {
			query = query.Where("created_at < ?", time.UnixMilli(int64(req.GetStartAfter())))
		}
		var userMultisigs []UserMultisig
		if err := query.
			Where("user_address = ?", userAddress).
			Order("created_at DESC").
			Limit(limit).
			Find(&userMultisigs).Error; err != nil {
			return errors.Wrap(err, "failed to find user multisigs")
		}

		for _, ms := range userMultisigs {
			multisigs = append(multisigs, &multisigpb.Multisig{
				ChainId:   ms.ChainID,
				Address:   ms.MultisigAddress,
				CreatedAt: uint32(ms.CreatedAt.UnixMilli()),
				Joined:    ms.Joined,
				Name:      ms.Name,
			})
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return &multisigpb.MultisigsResponse{Multisigs: multisigs}, nil
}

func (s *multisigService) Transactions(_ context.Context, req *multisigpb.TransactionsRequest) (*multisigpb.TransactionsResponse, error) {
	userAddress, err := s.authenticate(s.db, req.GetAuthToken())
	if err != nil {
		return nil, errors.Wrap(err, "failed to authenticate")
	}

	query := s.db
	if req.ChainId != "" {
		query = query.Where("transactions.chain_id = ?", req.ChainId) // FIXME: get from multisig
	}
	if req.MultisigAddress != "" {
		query = query.Where("transactions.multisig_address = ?", req.MultisigAddress)
	}
	if req.GetStartAfter() != 0 {
		query = query.Where("transactions.created_at < ?", time.UnixMilli(int64(req.GetStartAfter())))
	}
	var dbTransactions []Transaction
	if err := query.
		Joins("JOIN user_multisigs ON user_multisigs.multisig_address = transactions.multisig_address AND user_multisigs.user_address = ? AND user_multisigs.joined = ?", userAddress, true).
		Order("transactions.created_at DESC").
		Limit(int(req.Limit)).
		Find(&dbTransactions).Error; err != nil {
		return nil, errors.Wrap(err, "failed to find user multisigs")
	}

	transactions := make([]*multisigpb.Transaction, len(dbTransactions))
	for i, tx := range dbTransactions {
		// FIXME: log error and pass empty user address maybe
		multisigPrefix, _, err := bech32.DecodeAndConvert(tx.MultisigAddress)
		if err != nil {
			return nil, errors.Wrap(err, "failed to decode multisig address")
		}
		_, creatorAddressBytes, err := bech32.DecodeAndConvert(tx.CreatorAddress)
		if err != nil {
			return nil, errors.Wrap(err, "failed to decode user address")
		}
		chainCreatorAddress, err := bech32.ConvertAndEncode(multisigPrefix, creatorAddressBytes)
		if err != nil {
			return nil, errors.Wrap(err, "failed to encode user address")
		}
		finalHash := ""
		if tx.FinalHash != nil {
			finalHash = *tx.FinalHash
		}
		transactions[i] = &multisigpb.Transaction{
			ChainId:         tx.ChainID,
			MultisigAddress: tx.MultisigAddress,
			AccountNumber:   tx.AccountNumber,
			Sequence:        tx.Sequence,
			MsgsJson:        tx.MsgsJSON,
			FeeJson:         tx.FeeJSON,
			FinalHash:       finalHash,
			CreatedAt:       uint32(tx.CreatedAt.UnixMilli()),
			CreatorAddress:  chainCreatorAddress,
		}
	}
	return &multisigpb.TransactionsResponse{Transactions: transactions}, nil
}

func (s *multisigService) TransactionsCounts(_ context.Context, _ *multisigpb.TransactionsCountsRequest) (*multisigpb.TransactionsCountsResponse, error) {
	panic("not implemented") // TODO: Implement
}

// Write
func (s *multisigService) CreateOrJoinMultisig(_ context.Context, req *multisigpb.CreateOrJoinMultisigRequest) (*multisigpb.CreateOrJoinMultisigResponse, error) {
	var created, joined bool

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		userAddress, err := s.authenticate(tx, req.GetAuthToken())
		if err != nil {
			return errors.Wrap(err, "failed to authenticate")
		}

		name := req.GetName()
		chainID := req.GetChainId()
		pubkeyJSON := req.GetMultisigPubkeyJson()

		var ms multisig.LegacyAminoPubKey
		if err := legacy.Cdc.UnmarshalJSON([]byte(pubkeyJSON), &ms); err != nil {
			return errors.Wrap(err, "failed to unmarshal multisig pubkey json")
		}
		multisigAddress, err := bech32.ConvertAndEncode(req.GetBech32Prefix(), ms.Address())
		if err != nil {
			return errors.Wrap(err, "failed to encode multisig address")
		}

		multisigPubKeys := ms.GetPubKeys()
		if int(ms.Threshold) > len(multisigPubKeys) || ms.Threshold == 0 {
			return errors.New("invalid threshold")
		}

		_, userAddressBytes, err := bech32.DecodeAndConvert(userAddress)
		if err != nil {
			return errors.Wrap(err, "failed to decode user address, this should never happen")
		}
		found := false
		for _, pk := range multisigPubKeys {
			pkType := pk.Type()
			if pkType != "secp256k1" {
				return errors.New("invalid member pubkey type '" + pkType + "'")
			}
			memberAddressBytes := pk.Address().Bytes()
			if bytes.Equal(memberAddressBytes, userAddressBytes) {
				found = true
			}
		}
		if !found {
			return errors.New("user address is not a member of the multisig")
		}

		now := time.Now().UTC()

		var multisig Multisig
		if err := tx.First(&multisig, "chain_id = ? AND address = ?", chainID, multisigAddress).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				multisig = Multisig{
					ChainID:    chainID,
					Address:    multisigAddress,
					PubKeyJSON: pubkeyJSON,
					CreatedAt:  now,
				}
				if err := tx.Save(&multisig).Error; err != nil {
					return errors.Wrap(err, "failed to save multisig")
				}
				for _, pk := range multisigPubKeys {
					addrBytes := pk.Address().Bytes()
					userAddress, err := bech32.ConvertAndEncode(universalBech32Prefix, addrBytes)
					if err != nil {
						return errors.Wrap(err, "failed to encode user address")
					}
					var userMultisig UserMultisig
					if err := tx.First(&userMultisig, "chain_id = ? AND user_address = ? AND multisig_address = ?", chainID, userAddress, multisigAddress).Error; err != nil {
						if errors.Is(err, gorm.ErrRecordNotFound) {
							userMultisig = UserMultisig{
								ChainID:         chainID,
								UserAddress:     userAddress,
								MultisigAddress: multisigAddress,
								CreatedAt:       now,
								Joined:          false,
							}
							if err := tx.Save(&userMultisig).Error; err != nil {
								return errors.Wrap(err, "failed to save user multisig")
							}
						} else {
							return errors.Wrap(err, "failed to find user multisig")
						}
					}
				}
				created = true
			} else {
				return errors.Wrap(err, "failed to find multisig")
			}
		}

		var userMultisig UserMultisig
		if err := tx.First(&userMultisig, "chain_id = ? AND user_address = ? AND multisig_address = ?", chainID, userAddress, multisigAddress).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				userMultisig = UserMultisig{
					ChainID:         chainID,
					UserAddress:     userAddress,
					MultisigAddress: multisigAddress,
					CreatedAt:       now,
					Joined:          true,
					Name:            name,
				}
				if err := tx.Save(&userMultisig).Error; err != nil {
					return errors.Wrap(err, "failed to save user multisig")
				}
				joined = true
			} else {
				return errors.Wrap(err, "failed to find user multisig")
			}
			return nil
		}

		if userMultisig.Name == name && userMultisig.Joined {
			return nil
		}
		if !userMultisig.Joined {
			joined = true
		}
		userMultisig.Name = name
		userMultisig.Joined = true
		if err := tx.Save(&userMultisig).Error; err != nil {
			return errors.Wrap(err, "failed to update user multisig")
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return &multisigpb.CreateOrJoinMultisigResponse{Created: created, Joined: joined}, nil
}

func (s *multisigService) LeaveMultisig(_ context.Context, req *multisigpb.LeaveMultisigRequest) (*multisigpb.LeaveMultisigResponse, error) {
	left := false
	found := false
	if err := s.db.Transaction(func(tx *gorm.DB) error {
		userAddress, err := s.authenticate(tx, req.GetAuthToken())
		if err != nil {
			return errors.Wrap(err, "failed to authenticate")
		}

		chainID := req.GetChainId()
		multisigAddress := req.GetMultisigAddress()

		var userMultisig UserMultisig
		if err := tx.First(&userMultisig, "chain_id = ? AND user_address = ? AND multisig_address = ?", chainID, userAddress, multisigAddress).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				found = true
			} else {
				return errors.Wrap(err, "failed to find user multisig")
			}
		}

		if userMultisig.Joined {
			userMultisig.Joined = false
			if err := tx.Save(&userMultisig).Error; err != nil {
				return errors.Wrap(err, "failed to update user multisig")
			}
			left = true
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return &multisigpb.LeaveMultisigResponse{Left: left, Found: found}, nil
}

func (s *multisigService) CreateTransaction(_ context.Context, req *multisigpb.CreateTransactionRequest) (*multisigpb.CreateTransactionResponse, error) {
	userAddress, err := s.authenticate(s.db, req.GetAuthToken())
	if err != nil {
		return nil, errors.Wrap(err, "failed to authenticate")
	}
	if err := s.db.Create(&Transaction{
		ChainID:         req.GetChainId(),
		MultisigAddress: req.GetMultisigAddress(),
		AccountNumber:   req.GetAccountNumber(),
		Sequence:        req.GetSequence(),
		MsgsJSON:        req.GetMsgsJson(),
		FeeJSON:         req.GetFeeJson(),
		CreatorAddress:  userAddress,
	}).Error; err != nil {
		return nil, errors.Wrap(err, "failed to create transaction")
	}
	return &multisigpb.CreateTransactionResponse{}, nil
}

func (s *multisigService) SignTransaction(_ context.Context, _ *multisigpb.SignTransactionRequest) (*multisigpb.SignTransactionResponse, error) {
	panic("not implemented") // TODO: Implement
}

// Auth
func (s *multisigService) GetChallenge(_ context.Context, req *multisigpb.GetChallengeRequest) (*multisigpb.GetChallengeResponse, error) {
	nonce := make([]byte, 32)
	_, err := srand.Read(nonce)
	if err != nil {
		return nil, errors.New("failed to generate nonce")
	}

	signature := ed25519.Sign(s.privateKey, []byte(nonce))

	challenge := base64.RawURLEncoding.EncodeToString(nonce) + " " + base64.RawURLEncoding.EncodeToString(signature)

	return &multisigpb.GetChallengeResponse{
		Challenge: challenge,
	}, nil
}

func (s *multisigService) GetToken(_ context.Context, req *multisigpb.GetTokenRequest) (*multisigpb.GetTokenResponse, error) {
	challenge := req.GetChallenge()
	if challenge == "" {
		return nil, errors.New("missing challenge in request")
	}

	prefix := req.GetUserBech32Prefix()
	if prefix == "" {
		return nil, errors.New("missing user bech32 prefix in request")
	}

	nonce, err := validateChallenge(s.publicKey, challenge)
	if err != nil {
		return nil, errors.Wrap(err, "invalid challenge")
	}

	chainUserAddress, userPublicKey, err := parsePubKeyJSON(req.GetUserPubkeyJson(), prefix)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse user pubkey json")
	}

	signatureBase64 := req.GetChallengeSignature()
	signature, err := base64.StdEncoding.DecodeString(signatureBase64)
	if err != nil {
		return nil, errors.Wrap(err, "failed to decode signature")
	}
	if !userPublicKey.VerifySignature(makeADR36SignDoc([]byte(challenge), chainUserAddress), []byte(signature)) {
		return nil, errors.New("invalid user signature")
	}

	_, addressBytes, err := bech32.DecodeAndConvert(chainUserAddress)
	if err != nil {
		return nil, errors.Wrap(err, "failed to re-decode user address, this should never happen")
	}
	crossChainAddress, err := bech32.ConvertAndEncode(universalBech32Prefix, addressBytes)
	if err != nil {
		return nil, errors.Wrap(err, "failed to re-encode user address, this should never happen")
	}

	token := Token{
		UserAddress: crossChainAddress,
		Nonce:       nonce,
		CreatedAt:   time.Now().UTC(),
		Duration:    s.tokensDuration,
	}

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_address = ?", crossChainAddress).Delete(&Token{}).Error; err != nil {
			return errors.Wrap(err, "failed to delete previous token")
		}

		if err := tx.Save(&token).Error; err != nil {
			return errors.Wrap(err, "failed to save token")
		}

		return nil
	}); err != nil {
		return nil, errors.Wrap(err, "failed to store token")
	}

	return &multisigpb.GetTokenResponse{
		AuthToken: &multisigpb.Token{
			Nonce:     token.Nonce,
			CreatedAt: uint32(token.CreatedAt.UnixMilli()),
			Duration:  uint32(token.Duration.Milliseconds()),
		},
	}, nil
}

var ErrBadToken = errors.New("bad token")

func (s *multisigService) authenticate(tx *gorm.DB, token *multisigpb.Token) (string, error) {
	var dbToken Token
	if err := tx.First(&dbToken, "nonce = ?", token.GetNonce()).Error; err != nil {
		return "", ErrBadToken
	}

	if time.Now().After(dbToken.CreatedAt.Add(dbToken.Duration)) {
		if err := tx.Delete(dbToken); err != nil {
			fmt.Println("failed to delete token:", err) // TODO: use logger
		}
		return "", ErrBadToken
	}

	return dbToken.UserAddress, nil
}

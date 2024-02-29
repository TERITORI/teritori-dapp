package handlers

import (
	"encoding/json"
	"fmt"
	"math/big"
	"strconv"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"

	"github.com/TERITORI/teritori-dapp/go/internal/indexeraction"
	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/pkg/errors"
)

type SquadStakeInput struct {
	Nfts []abiGo.SquadStakingV3NftInfo `json:"nfts"`
}

type ClaimInput struct {
	Token      common.Address `json:"token"`
	Allocation *big.Int       `json:"allocation"`
	Proofs     [][32]byte     `json:"proofs"`
}

func (h *Handler) handleClaim(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	caller := tx.GetInfo().GetFrom()

	var input ClaimInput
	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse claim input")
	}

	var totalClaimed = indexerdb.P2eTotalClaimed{
		UserID:    h.network.UserID(caller),
		NetworkID: h.network.NetworkBase.ID,
	}
	if err := h.dbTransaction.FirstOrCreate(&totalClaimed).Error; err != nil {
		return errors.Wrap(err, "failed to get total claimed")
	}

	var amount *big.Int
	if totalClaimed.Amount == "" {
		amount = big.NewInt(0)
	} else {
		amount = new(big.Int)
		if _, ok := amount.SetString(totalClaimed.Amount, 10); !ok {
			return errors.New("failed to get current claimed amount")
		}
	}

	totalClaimed.Amount = amount.Add(amount, input.Allocation).String()

	if err := h.dbTransaction.Save(&totalClaimed).Error; err != nil {
		return errors.New("failed to update claimed amount")
	}

	return nil
}

func (h *Handler) handleSquadUnstake(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	totalLogs := len(tx.GetReceipt().GetLogs())
	var tokenIDs []string
	var nftContracts []string

	var shifted int
	if h.network.ID == "polygon" || h.network.ID == "polygon-mumbai" {
		shifted = 2
	} else {
		shifted = 1
	}

	// TODO: find a way to decode topics with go ABI
	for _, log := range tx.GetReceipt().GetLogs()[:totalLogs-shifted] {
		tokenID, err := DecodeTopicToInt(log.GetTopics()[3])

		if err != nil {
			return errors.Wrap(err, "failed to parsed event log")
		}

		tokenIDs = append(tokenIDs, strconv.FormatInt(int64(tokenID), 10))
		nftContracts = append(nftContracts, log.GetAddress())
	}

	indexerAction, err := indexeraction.NewIndexerAction(h.network.NetworkBase, h.dbTransaction, h.logger)
	if err != nil {
		return errors.Wrap(err, "failed to get indexeraction")
	}

	if err := indexerAction.SquadUnstake(
		tx.GetInfo().GetTo(),
		tx.GetInfo().GetFrom(),
		tokenIDs,
		nftContracts,
	); err != nil {
		return errors.Wrap(err, "failed to index squadUnStake")
	}

	return nil
}

func (h *Handler) handleSquadStake(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var stakeInput SquadStakeInput
	if err := ArgsToStruct(args, &stakeInput); err != nil {
		return errors.Wrap(err, "failed parse squad stake input")
	}

	var stakeLogEntry *pb.Log

	for _, log := range tx.GetReceipt().GetLogs() {
		if log.GetAddress() == h.network.RiotSquadStakingContractAddress {
			stakeLogEntry = log
		}
	}

	if stakeLogEntry == nil {
		return errors.New("failed to get stake log entry")
	}

	squadStakeEvent := new(abiGo.SquadStakingV3Stake)
	if err := contractABI.UnpackIntoInterface(squadStakeEvent, "Stake", []byte(stakeLogEntry.GetData())); err != nil {
		return err
	}

	var tokenIDs []string
	var nftContracts []string

	for _, nft := range stakeInput.Nfts {
		tokenIDs = append(tokenIDs, strings.ToLower(nft.TokenId.String()))
		nftContracts = append(nftContracts, strings.ToLower(nft.Collection.String()))
	}

	// PATCH: due to change of SquadStakingV3, it takes time to register all metadata into NftRegistry
	// so we calculate duration in the code. Beware that changes from contract (modifity, stamina...) will not affect this calculation
	tokenID0 := tokenIDs[0]
	var firstNFT indexerdb.NFT

	if err := h.indexerDB.
		Select("nfts.*").
		Joins("JOIN teritori_nfts ON teritori_nfts.nft_id = nfts.id").
		Where("teritori_nfts.token_id = ? AND teritori_nfts.network_id = ?", tokenID0, h.network.ID).
		First(&firstNFT).Error; err != nil {
		h.logger.Warn(fmt.Sprintf("unable to find staked NFT: %s on network: %s", tokenID0, h.network.ID))

		// Edge case: If unable to find the firstNFT data then
		// fallback to try to get that data from original network
		var originalNetworkPrefix string
		if h.network.ID == "polygon-mumbai" {
			originalNetworkPrefix = "ethereum-goerli"
		} else if h.network.ID == "polygon" {
			originalNetworkPrefix = "ethereum"
		}

		if originalNetworkPrefix == "" {
			return errors.New("failed to get original network")
		}

		if err := h.indexerDB.
			Select("nfts.*").
			Joins("JOIN teritori_nfts ON teritori_nfts.nft_id = nfts.id").
			Where("teritori_nfts.token_id = ? AND teritori_nfts.network_id = ?", tokenID0, originalNetworkPrefix).
			First(&firstNFT).Error; err != nil {
			return errors.Wrap(err, fmt.Sprintf("fallback: failed to get first staked NFT: %s on network: %s", tokenID0, originalNetworkPrefix))
		} else {
			h.logger.Warn(fmt.Sprintf("found staked NFT: %s on original network: %s", tokenID0, originalNetworkPrefix))
		}
	}

	jsonStr, err := json.Marshal(firstNFT.Attributes)
	if err != nil {
		return errors.Wrap(err, "failed to convert nft attributes => json string")
	}

	// json string => struct
	var dbAttributesAny []indexerdb.AttributeAny
	if err := json.Unmarshal(jsonStr, &dbAttributesAny); err != nil {
		return errors.Wrap(err, "failed to convert nft json string => struct")
	}

	firstNFTStamina := 0
	for _, attribute := range dbAttributesAny {
		attrName := attribute.TraitType

		if attrName != "Stamina" {
			continue
		}

		firstNFTStamina = int(attribute.Value.(float64))
	}

	multipliers := []int{
		0,
		100,
		105,
		125,
		131,
		139,
		161,
	}

	oneHour := 60 * 60
	bonusMultiplier := multipliers[len(tokenIDs)] / 100

	if bonusMultiplier == 0 {
		return errors.New("failed to get bonus multiplier")
	}

	duration := firstNFTStamina * oneHour * bonusMultiplier / 8

	indexerAction, err := indexeraction.NewIndexerAction(h.network.NetworkBase, h.dbTransaction, h.logger)
	if err != nil {
		return errors.Wrap(err, "failed to get indexeraction")
	}

	if err := indexerAction.SquadStake(
		"V3",
		tx.GetInfo().GetTo(),
		tx.GetInfo().GetFrom(),
		squadStakeEvent.StartTime.Uint64(),
		// NOTE: to avoid to register all metadata on NftRegistry, we calculate the endtime on indexer
		// squadStakeEvent.EndTime.Uint64(),
		squadStakeEvent.StartTime.Uint64()+uint64(duration),
		tokenIDs,
		nftContracts,
	); err != nil {
		return errors.Wrap(err, "failed to index squadStake")
	}

	return nil
}

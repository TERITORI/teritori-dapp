package handlers

import (
	"fmt"
	"math/big"
	"strconv"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/pkg/errors"
)

type ExecuteInput struct {
	CommandId     [32]byte `json:"commandId"`
	SourceChain   string   `json:"sourceChain"`
	SourceAddress string   `json:"sourceAddress"`
	Payload       []byte   `json:"payload"`
}

func (h *Handler) handleExecute(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var input ExecuteInput
	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse transfer input")
	}

	tokenID, err := DecodeTopicToInt(tx.Receipt.Logs[1].Data)
	if err != nil {
		// Try to decode from 2nd log entry
		tokenID, err = DecodeTopicToInt(tx.Receipt.Logs[2].Data)

		if err != nil {
			return errors.Wrap(err, "failed to decode tokenID")
		}
	}

	var targetMint string
	var originalCollectionID string
	switch tx.Info.To {
	case h.network.RiotBridgedNFTAddressGen0:
		targetMint = h.network.RiotContractAddressGen0
		originalCollectionID = h.network.RiotOriginalCollectionIdGen0
	case h.network.RiotBridgedNFTAddressGen1:
		targetMint = h.network.RiotContractAddressGen1
		originalCollectionID = h.network.RiotOriginalCollectionIdGen1
	default:
		return errors.New("Unknown NFT address: " + tx.Info.To)
	}

	// NOTE: The collection should exist already at this step
	// Logically, minter should deploy before the NFT can be minted

	// Get source teritori_nft
	var sourceNFT indexerdb.NFT
	sourceNftID := h.network.StringToNFTID(fmt.Sprintf("%s-%d", originalCollectionID, tokenID))
	if err := h.indexerDB.First(&sourceNFT, &indexerdb.NFT{ID: sourceNftID}).Error; err != nil {
		// NOTE: When testing, we bridged from different collections which are not our NFT collection
		// so they have not been indexed, so we will not be able to get the source NFT here. In that case, we just ignore this NFT
		// return errors.Wrap(err, "failed to get source teritori_nft")
		h.logger.Warn(fmt.Sprintf("NFT %d does not exist from source collection, maybe it's related to a test", tokenID))
		return nil
	}

	targetCollectionID := h.network.CollectionID(h.network.RiotContractAddressGen0)
	// Create target nft
	targetNFT := indexerdb.NFT{
		ID:           h.network.GetBase().NftID(targetMint, tokenID),
		Name:         sourceNFT.Name,
		ImageURI:     sourceNFT.ImageURI,
		OwnerID:      h.network.UserID(strings.Split(string(sourceNFT.OwnerID), "-")[1]),
		IsListed:     sourceNFT.IsListed,
		Attributes:   sourceNFT.Attributes,
		CollectionID: targetCollectionID,
		NetworkID:    h.network.ID,
	}

	if err := h.dbTransaction.FirstOrCreate(&targetNFT).Error; err != nil {
		return errors.Wrap(err, "failed to create target nft")
	}

	// 8. Create target teritori_nft
	teritoriNFT := indexerdb.TeritoriNFT{
		NFTID:     string(targetNFT.ID),
		TokenID:   strconv.Itoa(int(tokenID)),
		NetworkID: h.network.ID,
	}
	if err := h.dbTransaction.FirstOrCreate(&teritoriNFT).Error; err != nil {
		return errors.Wrap(err, "failed to create teritori_nft")
	}
	return nil
}

type BridgeNFTInput struct {
	TokenID *big.Int `json:"_tokenId"`
}

func (h *Handler) handleBridgeNFT(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	// Update the bridged NFT locked on
	var input BridgeNFTInput
	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse transfer input")
	}

	var mintAddress string
	var srcNFTAddr string

	switch tx.Info.To {
	case h.network.RiotBridgeAddressGen0:
		mintAddress = h.network.RiotContractAddressGen0
		srcNFTAddr = h.network.RiotNFTAddressGen0
	case h.network.RiotBridgeAddressGen1:
		mintAddress = h.network.RiotContractAddressGen1
		srcNFTAddr = h.network.RiotNFTAddressGen1
	default:
		return errors.New("Unknown Bridge address: " + tx.Info.To)
	}

	// Dont process the bridge where source NFT address is not our NFT collection
	transferedNFTAddress := tx.Receipt.Logs[0].Address
	if transferedNFTAddress != srcNFTAddr {
		return nil
	}

	nftID := h.network.GetBase().NFTID(mintAddress, input.TokenID.String())

	var nft indexerdb.NFT

	if err := h.dbTransaction.First(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
		return errors.Wrap(err, "failed to get nft")
	}

	nft.LockedOn = tx.Info.To

	if err := h.dbTransaction.Save(nft).Error; err != nil {
		return errors.Wrap(err, "failed to update locked on for bridged NFT")
	}

	return nil
}

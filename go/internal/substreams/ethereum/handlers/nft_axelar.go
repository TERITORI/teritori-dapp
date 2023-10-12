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
	"gorm.io/gorm"
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
		return errors.Wrap(err, "failed to decode tokenID")
	}

	var targetMint string
	switch tx.Info.To {
	case h.network.RiotBridgedNFTAddressGen0:
		targetMint = h.network.RiotContractAddressGen0
	case h.network.RiotBridgedNFTAddressGen1:
		targetMint = h.network.RiotContractAddressGen1
	default:
		return errors.New("Unknown NFT address: " + tx.Info.To)
	}

	splittedMint := strings.Split(targetMint, ":")
	sourceMint, sourceNetworkIDPrefix := splittedMint[0], splittedMint[1]
	sourceNetwork, err := h.networkStore.GetNetworkFromIDPrefix(sourceNetworkIDPrefix)
	if err != nil {
		return errors.Wrap(err, "failed to get source network")
	}

	// Check if target collection exists
	var targetTeritoriCollection indexerdb.TeritoriCollection
	if err := h.dbTransaction.First(&targetTeritoriCollection, &indexerdb.TeritoriCollection{MintContractAddress: targetMint}).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.Wrap(err, "failed to get target mint")
		}

		// Target teritori collection does not exist then we create it =========================
		// 1. Get source collection
		var sourceCollection indexerdb.Collection
		if err := h.dbTransaction.First(&sourceCollection, &indexerdb.Collection{ID: sourceNetwork.GetBase().CollectionID(sourceMint)}).Error; err != nil {
			return errors.Wrap(err, "failed to get source collection")
		}

		// 2. Create target collection
		targetCollection := indexerdb.Collection{
			ID:        h.network.GetBase().CollectionID(targetMint),
			NetworkID: h.network.ID,
			Name:      sourceCollection.Name,
			ImageURI:  sourceCollection.ImageURI,
			Time:      sourceCollection.Time,
		}

		if err := h.dbTransaction.FirstOrCreate(&targetCollection).Error; err != nil {
			return errors.Wrap(err, "failed to create target collection")
		}

		// 3. Get the source teritori_collection
		var sourceTeritoriCollection indexerdb.TeritoriCollection
		if err := h.dbTransaction.First(&sourceTeritoriCollection, &indexerdb.TeritoriCollection{CollectionID: sourceCollection.ID}).Error; err != nil {
			return errors.Wrap(err, "failed to get source teritori_collection")
		}

		// 4. Create the source teritori_collection
		targetCollectionID := h.network.GetBase().CollectionID(targetMint)

		targetTeritoriCollection = indexerdb.TeritoriCollection{
			CollectionID:        targetCollectionID,
			MintContractAddress: targetMint,
			NFTContractAddress:  fmt.Sprintf("%s:%s", tx.Info.To, sourceTeritoriCollection.NFTContractAddress),
			CreatorAddress:      fmt.Sprintf("%s:%s", sourceTeritoriCollection.CreatorAddress, sourceNetworkIDPrefix),
		}
		if err := h.dbTransaction.FirstOrCreate(&targetTeritoriCollection).Error; err != nil {
			return errors.Wrap(err, "failed to create bridged collection")
		}

	}

	// 6. Get source teritori_nft
	var sourceNFT indexerdb.NFT
	sourceNftID := sourceNetwork.GetBase().NftID(sourceMint, tokenID)
	if err := h.dbTransaction.First(&sourceNFT, &indexerdb.NFT{ID: sourceNftID}).Error; err != nil {
		return errors.Wrap(err, "failed to get source teritori_nft")
	}

	// 7. Create target teritori_nft
	targetNFT := indexerdb.NFT{
		ID:           h.network.GetBase().NftID(targetMint, tokenID),
		Name:         sourceNFT.Name,
		ImageURI:     sourceNFT.ImageURI,
		OwnerID:      h.network.UserID(strings.Split(string(sourceNFT.OwnerID), "-")[1]),
		IsListed:     sourceNFT.IsListed,
		Attributes:   sourceNFT.Attributes,
		CollectionID: targetTeritoriCollection.CollectionID,
	}

	if err := h.dbTransaction.FirstOrCreate(&targetNFT).Error; err != nil {
		return errors.Wrap(err, "failed to create target nft")
	}

	// 8. Create target teritori_nft
	teritoriNFT := indexerdb.TeritoriNFT{
		NFTID:   string(targetNFT.ID),
		TokenID: strconv.Itoa(int(tokenID)),
	}
	if err := h.dbTransaction.FirstOrCreate(&teritoriNFT).Error; err != nil {
		return errors.Wrap(err, "failed to create teritori_nft")
	}

	h.dbTransaction.Commit()

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
	switch tx.Info.To {
	case h.network.RiotBridgeAddressGen0:
		mintAddress = h.network.RiotContractAddressGen0
	case h.network.RiotBridgeAddressGen1:
		mintAddress = h.network.RiotContractAddressGen1
	default:
		return errors.New("Unknown Bridge address: " + tx.Info.To)
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

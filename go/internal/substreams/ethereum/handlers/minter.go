package handlers

import (
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/davecgh/go-spew/spew"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type MinterMintWithMetadataInput struct {
	MintData []abi_go.TeritoriMinterMintDataWithMetadata `json:"mintData"`
}

type MetaData struct {
	Attributes indexerdb.ArrayJSONB `json:"attributes"`
}

func (h *Handler) handleMintWithMetadata(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var data MinterMintWithMetadataInput
	if err := ArgsToStruct(args, &data); err != nil {
		return errors.Wrap(err, "failed to parse mint data")
	}

	for idx, nftData := range data.MintData {
		// We get owner (user who request mint) from the tx logs
		txLog := tx.Receipt.Logs[idx]
		encodedString := hex.EncodeToString(txLog.Topics[2])
		owner := fmt.Sprintf("0x%s", encodedString[24:])
		ownerID := h.network.UserID(owner)

		tokenID := nftData.TokenId.String()
		collectionID := h.network.CollectionID(tx.Info.To)
		nftID := h.network.NFTID(tx.Info.To, tokenID)

		// Get attributes from URI
		var metaData MetaData
		if err := FetchIPFSJSON(nftData.TokenUri, &metaData); err != nil {
			h.logger.Error("failed to fetch nft metadata", zap.String("metadata-uri", nftData.TokenUri), zap.Error(err))
		}

		nft := indexerdb.NFT{
			ID:           nftID,
			OwnerID:      ownerID,
			Name:         nftData.Extension.Name,
			ImageURI:     nftData.Extension.Image,
			CollectionID: collectionID,
			Attributes:   metaData.Attributes,
			TeritoriNFT: &indexerdb.TeritoriNFT{
				TokenID:   tokenID,
				NetworkID: h.network.ID,
			},
			NetworkID: h.network.ID,
		}

		if err := h.dbTransaction.Create(&nft).Error; err != nil {
			spew.Dump(nft)
			return errors.Wrap(err, "failed to create nft in db")
		}

		// Create mint activity
		if err := h.dbTransaction.Create(&indexerdb.Activity{
			ID:   h.network.ActivityID(tx.Info.Hash, int(txLog.Index)),
			Kind: indexerdb.ActivityKindMint,
			Time: time.Unix(int64(tx.Clock.Timestamp), 0),
			Mint: &indexerdb.Mint{
				// TODO: get price
				BuyerID:   ownerID,
				NetworkID: h.network.ID,
			},
			NFTID:     nftID,
			NetworkID: h.network.ID,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to create mint activity")
		}
	}

	return nil
}

type SetNftInput struct {
	NewNftAddress common.Address `json:"newNftAddress"`
}

func (h *Handler) handleSetNft(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var data SetNftInput
	if err := ArgsToStruct(args, &data); err != nil {
		return errors.Wrap(err, "failed to parse mint data")
	}

	var teritoriCollection indexerdb.TeritoriCollection
	if err := h.dbTransaction.Where("mint_contract_address = ?", tx.Info.To).First(&teritoriCollection).Error; err != nil {
		return errors.Wrap(err, "failed to get collection")
	}

	teritoriCollection.NFTContractAddress = strings.ToLower(data.NewNftAddress.String())

	if err := h.dbTransaction.Save(&teritoriCollection).Error; err != nil {
		return errors.Wrap(err, "failed to update collection nft contract")
	}

	return nil
}

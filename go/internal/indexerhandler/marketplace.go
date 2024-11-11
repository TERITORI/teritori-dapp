package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type AddMsg struct {
	Add struct {
		AddedAddr string `json:"added_addr"`
	} `json:"add"`
}

type RemoveMsg struct {
	Remove struct {
		RemovedAddr string `json:"removed_addr"`
	} `json:"add"`
}

func (h *Handler) handleExecuteAddWhitelistedCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	nftMarketplaceFeature, err := h.config.Network.GetFeatureNFTMarketplace()
	if err != nil {
		if errors.Is(err, networks.ErrFeatureNotFound) {
			return nil
		}
		return errors.Wrap(err, "failed to get FT Marketplace feature")
	}

	contractAddress := execMsg.Contract

	if contractAddress != nftMarketplaceFeature.CwAddressListContractAddress {
		h.logger.Debug("ignored add whitelisted collection for non-matching contract")
		return nil
	}

	var addMsg AddMsg
	if err := json.Unmarshal([]byte(execMsg.Msg), &addMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execMsg.Msg")
	}

	collectionAddress := addMsg.Add.AddedAddr
	if err != nil {
		return errors.Wrap(err, "failed to get collection address")
	}

	if err := h.db.
		Model(&indexerdb.Collection{}).
		Where("id IN (?)", h.db.Table("teritori_collections").
			Select("collection_id").
			Where("nft_contract_address = ?", collectionAddress),
		).
		UpdateColumn("whitelisted", true).
		Error; err != nil {
		return errors.Wrap(err, "failed to update whitelisted to true for collection")
	}

	h.logger.Info("collection whitelisted", zap.String("address", collectionAddress))

	return nil
}

func (h *Handler) handleExecuteRemoveWhitelistedCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	nftMarketplaceFeature, err := h.config.Network.GetFeatureNFTMarketplace()
	if err != nil {
		if errors.Is(err, networks.ErrFeatureNotFound) {
			return nil
		}
		return errors.Wrap(err, "failed to get FT Marketplace feature")
	}

	contractAddress := execMsg.Contract

	if contractAddress != nftMarketplaceFeature.CwAddressListContractAddress {
		h.logger.Debug("ignored remove whitelisted collection for non-matching contract")
		return nil
	}

	var removeMsg RemoveMsg
	if err := json.Unmarshal([]byte(execMsg.Msg), &removeMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execMsg.Msg")
	}

	collectionAddress := removeMsg.Remove.RemovedAddr
	if err != nil {
		return errors.Wrap(err, "failed to get collection address")
	}

	if err := h.db.
		Model(&indexerdb.Collection{}).
		Where("id IN (?)", h.db.Table("teritori_collections").
			Select("collection_id").
			Where("nft_contract_address = ?", collectionAddress),
		).
		UpdateColumn("whitelisted", false).
		Error; err != nil {
		return errors.Wrap(err, "failed to update whitelisted to false for collection")
	}

	h.logger.Info("collection whitelisted", zap.String("address", collectionAddress))

	return nil
}


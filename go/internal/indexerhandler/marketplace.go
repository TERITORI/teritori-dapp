package indexerhandler

import (
	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

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

	collectionAddress, err := e.Events.First("wasm.added_addr")
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

	collectionAddress, err := e.Events.First("wasm.removed_addr")
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

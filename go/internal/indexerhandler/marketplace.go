package indexerhandler

import (
	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func (h *Handler) handleExecuteAddWhitelistedCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	if execMsg.Contract != h.config.Network.VaultContractAddress {
		return nil
	}

	collectionAddress, err := e.Events.First("wasm.added_addr")
	if err != nil {
		return errors.Wrap(err, "failed to get collection address")
	}

	if err := h.db.
		Joins("JOIN teritori_collections ON teritori_collections.collection_id = collections.id").
		Where("teritori_collections.nft_contract_address = ?", collectionAddress).
		UpdateColumn("whitelisted", true).
		Error; err != nil {
		return errors.Wrap(err, "failed to update whitelisted to true for collection")
	}

	h.logger.Info("collection whitelisted", zap.String("address", collectionAddress))

	return nil
}

func (h *Handler) handleExecuteRemoveWhitelistedCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	if execMsg.Contract != h.config.Network.VaultContractAddress {
		return nil
	}

	collectionAddress, err := e.Events.First("wasm.added_addr")
	if err != nil {
		return errors.Wrap(err, "failed to get collection address")
	}

	if err := h.db.
		Joins("JOIN teritori_collections ON teritori_collections.collection_id = collections.id").
		Where("teritori_collections.nft_contract_address = ?", collectionAddress).
		UpdateColumn("whitelisted", false).
		Error; err != nil {
		return errors.Wrap(err, "failed to update whitelisted to false for collection")
	}

	h.logger.Info("collection unwhitelisted", zap.String("address", collectionAddress))

	return nil
}

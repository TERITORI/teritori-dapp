package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/friendsofgo/errors"
	"go.uber.org/zap"
)

func (h *Handler) handleExecuteSubmitCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var jsonData map[string]map[string]interface{}
	if err := json.Unmarshal(execMsg.Msg.Bytes(), &jsonData); err != nil {
		return errors.Wrap(err, "failed to unmarshal json")
	}

	collectionData := jsonData["submit_collection"]["collection"]
	if collectionData == nil {
		return errors.New("failed to get collection data")
	}

	collectionId := e.Events["wasm.collection_id"][0]
	if collectionId == "" {
		return errors.New("failed to get collection id")
	}

	collectionDataJson, err := json.Marshal(collectionData)
	if err != nil {
		return errors.Wrap(err, "failed to marshal collection data")
	}

	project := indexerdb.LaunchpadProject{
		NetworkID:      h.config.Network.ID,
		ProjectID:      collectionId,
		CollectionData: collectionDataJson,
		CreatorID:      h.config.Network.UserID(execMsg.Sender),
		Status:         launchpadpb.Status_STATUS_INCOMPLETE,
	}
	if err := h.db.Create(project).Error; err != nil {
		return errors.Wrap(err, "failed to create project")
	}

	h.logger.Info("submited project", zap.Any("symbol", collectionId))

	return nil
}

func (h *Handler) handleExecuteUpdateMerkleRoot(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var jsonData map[string]map[string]interface{}
	if err := json.Unmarshal(execMsg.Msg.Bytes(), &jsonData); err != nil {
		return errors.Wrap(err, "failed to unmarshal json")
	}

	collectionId := jsonData["update_merkle_root"]["collection_id"]
	if collectionId == "" {
		return errors.New("failed to get collection id")
	}

	merkleRoot := jsonData["update_merkle_root"]["merkle_root"]
	if merkleRoot == "" {
		return errors.New("failed to get merkle root")
	}

	// Update collection_data
	if err := h.db.Exec(`
    UPDATE launchpad_projects 
    SET collection_data = jsonb_set(collection_data, '{metadatas_merkle_root}', to_jsonb(?::text))
    WHERE project_id = ? AND network_id = ?`,
		merkleRoot, collectionId, h.config.Network.ID,
	).Error; err != nil {
		return errors.Wrap(err, "failed to update deployed address in collection_data")
	}

	// Update status
	if err :=
		h.db.
			Model(&indexerdb.LaunchpadProject{}).
			Where("project_id = ?", collectionId).
			Where("network_id = ?", h.config.Network.ID).
			UpdateColumn("status", launchpadpb.Status_STATUS_COMPLETE).
			Error; err != nil {
		return errors.Wrap(err, "failed to update project status to COMPLETE")
	}

	h.logger.Info("updated merkle root", zap.Any("merkleRoot", merkleRoot))

	return nil
}

func (h *Handler) handleExecuteDeployCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var jsonData map[string]map[string]interface{}
	if err := json.Unmarshal(execMsg.Msg.Bytes(), &jsonData); err != nil {
		return errors.Wrap(err, "failed to unmarshal json")
	}
	collectionId, ok := jsonData["deploy_collection"]["collection_id"].(string)
	if !ok || collectionId == "" {
		return errors.New("failed to get collection id or collection id is not a string")
	}

	deployedAddress := e.Events["instantiate._contract_address"][0]
	if deployedAddress == "" {
		return errors.New("failed to get deployed address from reply")
	}

	// Update collection_data
	if err := h.db.Exec(`
    UPDATE launchpad_projects 
    SET collection_data = jsonb_set(collection_data, '{deployed_address}', to_jsonb(?::text))
    WHERE project_id = ? AND network_id = ?`,
		deployedAddress, collectionId, h.config.Network.ID,
	).Error; err != nil {
		return errors.Wrap(err, "failed to update deployed address in collection_data")
	}

	// Update status
	if err := h.db.
		Model(&indexerdb.LaunchpadProject{}).
		Where("project_id = ?", collectionId).
		Where("network_id = ?", h.config.Network.ID).
		UpdateColumn("status", launchpadpb.Status_STATUS_CONFIRMED).
		Error; err != nil {
		return errors.Wrap(err, "failed to update project status to CONFIRMED")
	}

	var project indexerdb.LaunchpadProject
	if err := h.db.Model(&indexerdb.LaunchpadProject{}).
		Where("project_id = ?", collectionId).
		Where("network_id = ?", h.config.Network.ID).
		Scan(&project).Error; err != nil {
		return errors.Wrap(err, "failed to get launchpad_project from database")
	}
	collectionData := project.CollectionData

	// Create usable collection
	// TODO: Use a defined shape for collection_data ?
	var collectionDataJSON map[string]json.RawMessage
	if err := json.Unmarshal(collectionData, &collectionDataJSON); err != nil {
		return errors.Wrap(err, "failed to unmarhsal collection_data")
	}
	var name string
	if raw, ok := collectionDataJSON["name"]; ok {
		if err := json.Unmarshal(raw, &name); err != nil {
			return errors.Wrap(err, "failed to unmarshal name")
		}
	}
	var coverImgUri string
	if raw, ok := collectionDataJSON["cover_img_uri"]; ok {
		if err := json.Unmarshal(raw, &coverImgUri); err != nil {
			return errors.Wrap(err, "failed to unmarshal cover_img_uri")
		}
	}
	var tokensCount uint64
	if raw, ok := collectionDataJSON["tokens_count"]; ok {
		if err := json.Unmarshal(raw, &tokensCount); err != nil {
			return errors.Wrap(err, "failed to unmarshal tokens_count")
		}
	}

	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	networkCollectionId := h.config.Network.CollectionID(deployedAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:                  networkCollectionId,
		NetworkID:           h.config.Network.ID,
		Name:                name,
		ImageURI:            coverImgUri,
		MaxSupply:           int(tokensCount),
		SecondaryDuringMint: true,
		Time:                blockTime,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			NetworkID:           h.config.Network.ID,
			MintContractAddress: deployedAddress,
			NFTContractAddress:  deployedAddress,
			CreatorAddress:      execMsg.Sender,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create teritori collection")
	}

	h.logger.Info("created teritori collection", zap.String("id", string(networkCollectionId)))

	return nil
}

package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/friendsofgo/errors"
)

type SubmitCollectionMsg struct {
	SubmitCollection struct {
		Collection struct {
			Name string `json:"name"`
			Desc string `json:"desc"`
		} `json:"collection"`
	} `json:"submit_collection"`
}

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

	if err := h.db.Exec(`
    UPDATE launchpad_projects 
    SET collection_data = jsonb_set(collection_data, '{metadatas_merkle_root}', to_jsonb(?::text))
    WHERE project_id = ? AND network_id = ?`,
		merkleRoot, collectionId, h.config.Network.ID,
	).Error; err != nil {
		return errors.Wrap(err, "failed to update deployed address in collection_data")
	}

	if err :=
		h.db.
			Model(&indexerdb.LaunchpadProject{}).
			Where("project_id = ?", collectionId).
			Where("network_id = ?", h.config.Network.ID).
			UpdateColumn("status", launchpadpb.Status_STATUS_COMPLETE).
			Error; err != nil {
		return errors.Wrap(err, "failed to update project status to COMPLETE")
	}

	return nil
}

func (h *Handler) handleExecuteDeployCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var jsonData map[string]map[string]interface{}
	if err := json.Unmarshal(execMsg.Msg.Bytes(), &jsonData); err != nil {
		return errors.Wrap(err, "failed to unmarshal json")
	}
	collectionId := jsonData["deploy_collection"]["collection_id"]
	if collectionId == "" {
		return errors.New("failed to get collection id")
	}

	deployedAddress := e.Events["instantiate._contract_address"][0]
	if deployedAddress == "" {
		return errors.New("failed to get deployed address from reply")
	}

	if err := h.db.Exec(`
    UPDATE launchpad_projects 
    SET collection_data = jsonb_set(collection_data, '{deployed_address}', to_jsonb(?::text))
    WHERE project_id = ? AND network_id = ?`,
		deployedAddress, collectionId, h.config.Network.ID,
	).Error; err != nil {
		return errors.Wrap(err, "failed to update deployed address in collection_data")
	}

	if err := h.db.
		Model(&indexerdb.LaunchpadProject{}).
		Where("project_id = ?", collectionId).
		Where("network_id = ?", h.config.Network.ID).
		UpdateColumn("status", launchpadpb.Status_STATUS_CONFIRMED).
		Error; err != nil {
		return errors.Wrap(err, "failed to update project status to CONFIRMED")
	}

	return nil
}

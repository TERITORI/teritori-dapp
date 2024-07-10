package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
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
	}
	if err := h.db.Create(project).Error; err != nil {
		return errors.Wrap(err, "failed to create project")
	}

	return nil
}
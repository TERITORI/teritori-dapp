package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type CreateMusicAlbumMsg struct {
	Identifier string `json:"identifier"`
	Category   uint32 `json:"category"`
	Metadata   string `json:"metadata"`
}

type ExecCreateMusicAlbumMsg struct {
	CreateMusicAlbum CreateMusicAlbumMsg `json:"create_music_album"`
}

func (h *Handler) handleExecuteCreateAlbum(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execCreateMusicAlbumMsg ExecCreateMusicAlbumMsg
	if err := json.Unmarshal(execMsg.Msg, &execCreateMusicAlbumMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute create album msg")
	}

	return h.createMusicAlbum(e, execMsg, &execCreateMusicAlbumMsg.CreateMusicAlbum)
}

func (h *Handler) createMusicAlbum(
	e *Message,
	execMsg *wasmtypes.MsgExecuteContract,
	createMusicAlbumMsg *CreateMusicAlbumMsg,
) error {
	var metadataJSON map[string]interface{}
	if err := json.Unmarshal([]byte(createMusicAlbumMsg.Metadata), &metadataJSON); err != nil {
		return errors.Wrap(err, "failed to unmarshal metadata")
	}

	createdAt, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	musicAlbum := indexerdb.MusicAlbum{
		Identifier: createMusicAlbumMsg.Identifier,
		Category:   createMusicAlbumMsg.Category,
		Metadata:   metadataJSON,
		CreatedBy:  h.config.Network.UserID(execMsg.Sender),
		CreatedAt:  createdAt.Unix(),
	}

	if err := h.db.Create(&musicAlbum).Error; err != nil {
		return errors.Wrap(err, "failed to create music album")
	}
	return nil
}

package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type ExecCreateVideoMsg struct {
	CreateVideo CreateVideoMsg `json:"create_video"`
}
type CreateVideoMsg struct {
	Metadata string `json:"metadata"`
}

func (h *Handler) handleExecuteCreateVideo(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execCreateVideoMsg ExecCreateVideoMsg
	if err := json.Unmarshal(execMsg.Msg, &execCreateVideoMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute create video msg")
	}

	videoIdentifiers := e.Events["wasm.video_identifier"]
	if len(videoIdentifiers) == 0 {
		return errors.New("no video identifier")
	}
	identifier := videoIdentifiers[0]

	createVideo := &execCreateVideoMsg.CreateVideo

	var metadataJSON map[string]interface{}
	if err := json.Unmarshal([]byte(createVideo.Metadata), &metadataJSON); err != nil {
		return nil
	}

	createdAt, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	video := indexerdb.Video{
		Identifier: identifier,
		Metadata:   metadataJSON,
		CreatedBy:  h.config.Network.UserID(execMsg.Sender),
		CreatedAt:  createdAt.Unix(),
		ViewCount:  0,
		LastView:   0,
	}

	if err := h.db.Create(&video).Error; err != nil {
		return errors.Wrap(err, "failed to create video")
	}
	return nil
}

type ExecCreateCommentMsg struct {
	CreateComment CreateCommentMsg `json:"create_comment"`
}
type CreateCommentMsg struct {
	VideoIdentifier string `json:"video_identifier"`
	Comment         string `json:"comment"`
}

func (h *Handler) handleExecuteCreateComment(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execCreateCommentMsg ExecCreateCommentMsg
	if err := json.Unmarshal(execMsg.Msg, &execCreateCommentMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute create comment msg")
	}

  commentIdentifiers := e.Events["wasm.comment_identifier"]
  if len(commentIdentifiers) == 0 {
    return errors.New("no comment identifier")
  }
  identifier := commentIdentifiers[0]

	createComment := &execCreateCommentMsg.CreateComment

	createdAt, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	comment := indexerdb.VideoComment{
	  Identifier: identifier,
		VideoIdentifier: createComment.VideoIdentifier,
		Comment:         createComment.Comment,
		CreatedBy:       h.config.Network.UserID(execMsg.Sender),
		CreatedAt:       createdAt.Unix(),
	}

	if err := h.db.Create(&comment).Error; err != nil {
		return errors.Wrap(err, "failed to create comment")
	}
	return nil
}

type DeleteVideoMsg struct {
	Identifier string `json:"identifier"`
}

type ExecDeleteVideoMsg struct {
	DeleteVideo DeleteVideoMsg `json:"delete_music_album"`
}

func (h *Handler) handleExecuteDeleteVideo(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execDeleteVideoMsg ExecDeleteVideoMsg
	if err := json.Unmarshal(execMsg.Msg, &execDeleteVideoMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute delete video msg")
	}
	deleteVideo := &execDeleteVideoMsg.DeleteVideo

	video := indexerdb.Video{}
	if err := h.db.Where("identifier = ?", deleteVideo.Identifier).First(&video).Error; err != nil {
		return errors.Wrap(err, "failed to get video to delete")
	}
	video.IsDeleted = true

	if err := h.db.Save(&video).Error; err != nil {
		return errors.Wrap(err, "failed to set deleted to video")
	}
	return nil
}

type AddToLibraryMsg struct {
	Identifier string `json:"identifier"`
}

type ExecAddToLibraryMsg struct {
	AddToLibrary AddToLibraryMsg `json:"add_to_library"`
}

func (h *Handler) handleExecuteAddToLibrary(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execAddToLibraryMsg ExecAddToLibraryMsg
	if err := json.Unmarshal(execMsg.Msg, &execAddToLibraryMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute add_to_library msg")
	}
	addToLibraryMsg := &execAddToLibraryMsg.AddToLibrary
	videoLibrary := indexerdb.VideoLibrary{
		Identifier: addToLibraryMsg.Identifier,
		Owner:      h.config.Network.UserID(execMsg.Sender),
	}
	if err := h.db.Create(&videoLibrary).Error; err != nil {
		return errors.Wrap(err, "failed to add to library")
	}
	return nil
}

type RemoveFromLibraryMsg struct {
	Identifier string `json:"identifier"`
}

type ExecRemoveFromLibraryMsg struct {
	RemoveFromLibrary RemoveFromLibraryMsg `json:"remove_from_library"`
}

func (h *Handler) handleExecuteRemoveFromLibrary(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execRemoveFromLibraryMsg ExecRemoveFromLibraryMsg
	if err := json.Unmarshal(execMsg.Msg, &execRemoveFromLibraryMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute remove_from_library msg")
	}
	removeFromLibraryMsg := &execRemoveFromLibraryMsg.RemoveFromLibrary

	videoLibrary := indexerdb.VideoLibrary{
		Identifier: removeFromLibraryMsg.Identifier,
		Owner:      h.config.Network.UserID(execMsg.Sender),
	}

	if err := h.db.Delete(&videoLibrary).Error; err != nil {
		return errors.Wrap(err, "failed to remove from library")
	}
	return nil
}

package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type Reaction struct {
	Identifier string `json:"identifier"`
	Icon       string `json:"icon"`
}

type CreatePostMsg struct {
	Identifier           string `json:"identifier"`
	ParentPostIdentifier string `json:"parent_post_identifier"`
	Category             uint32 `json:"category"`
	Metadata             string `json:"metadata"`
}

type TipPostMsg struct {
	Identifier string `json:"identifier"`
}

type ExecTipPostMsg struct {
	TipPost TipPostMsg `json:"tip_post"`
}

type ExecCreatePostMsg struct {
	CreatePost CreatePostMsg `json:"create_post"`
}

type ExecCreatePostByBotMsg struct {
	CreatePostByBot CreatePostMsg `json:"create_post_by_bot"`
}

type ReactPostMsg struct {
	Identifier string `json:"identifier"`
	Icon       string `json:"icon"`
	Up         bool   `json:"up"`
}

type ExecReactPostMsg struct {
	ReactPost ReactPostMsg `json:"react_post"`
}

type DeletePostMsg struct {
	Identifier string `json:"identifier"`
}

type ExecDeletePostMsg struct {
	DeletePost DeletePostMsg `json:"delete_post"`
}

func removeUserFromList(users []networks.UserID, user networks.UserID) []networks.UserID {
	res := make([]networks.UserID, 0)
	for _, userInList := range users {
		if userInList != user {
			res = append(res, userInList)
		}
	}
	return res
}

func (h *Handler) handleExecuteDeletePost(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execDeletePostMsg ExecDeletePostMsg
	if err := json.Unmarshal(execMsg.Msg, &execDeletePostMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute delete post msg")
	}

	deletePost := execDeletePostMsg.DeletePost

	post := indexerdb.Post{}
	if err := h.db.Where("identifier = ?", deletePost.Identifier).First(&post).Error; err != nil {
		return errors.Wrap(err, "failed to get post to delete")
	}

	post.IsDeleted = true

	if err := h.db.Save(&post).Error; err != nil {
		return errors.Wrap(err, "failed to set deleted to post")
	}

	return nil
}

func (h *Handler) handleExecuteReactPost(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execReactPostMsg ExecReactPostMsg
	if err := json.Unmarshal(execMsg.Msg, &execReactPostMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute react post msg")
	}

	reactPost := execReactPostMsg.ReactPost

	post := indexerdb.Post{}
	if err := h.db.Where("identifier = ?", reactPost.Identifier).First(&post).Error; err != nil {
		return errors.Wrap(err, "failed to get post to react")
	}

	userReactions := post.UserReactions
	var users []networks.UserID
	reactedUsers, found := userReactions[reactPost.Icon]
	if found {
		for _, user := range reactedUsers.([]interface{}) {
			users = append(users, networks.UserID(user.(string)))
		}

	} else {
		users = make([]networks.UserID, 0)
	}
	newReactedUser := h.config.Network.UserID(execMsg.Sender)

	// Smartcontract has validated already data so we do not need to re-validate
	// just add user to list if up == True otherwise remove user
	if reactPost.Up {
		users = append(users, newReactedUser)
	} else {
		users = removeUserFromList(users, newReactedUser)
	}
	if len(users) == 0 {
		delete(userReactions, reactPost.Icon)
	} else {
		userReactions[reactPost.Icon] = users
	}

	post.UserReactions = userReactions

	if err := h.db.Save(&post).Error; err != nil {
		return errors.Wrap(err, "failed to update reactions")
	}

	return nil
}

func (h *Handler) handleExecuteCreatePostByBot(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execCreatePostByBotMsg ExecCreatePostByBotMsg
	if err := json.Unmarshal(execMsg.Msg, &execCreatePostByBotMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute create post by bot msg")
	}

	return h.createPost(e, execMsg, &execCreatePostByBotMsg.CreatePostByBot, true)
}

func (h *Handler) handleExecuteCreatePost(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	if execMsg.Contract != h.config.Network.SocialFeedContractAddress {
		h.logger.Debug("ignored create post for unknown contract", zap.String("tx", e.TxHash), zap.String("contract", execMsg.Contract))
		return nil
	}

	var execCreatePostMsg ExecCreatePostMsg
	if err := json.Unmarshal(execMsg.Msg, &execCreatePostMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute create post msg")
	}

	return h.createPost(e, execMsg, &execCreatePostMsg.CreatePost, false)
}

func (h *Handler) createPost(
	e *Message,
	execMsg *wasmtypes.MsgExecuteContract,
	createPostMsg *CreatePostMsg,
	isBot bool,
) error {
	var metadataJSON map[string]interface{}
	if err := json.Unmarshal([]byte(createPostMsg.Metadata), &metadataJSON); err != nil {
		return errors.Wrap(err, "failed to unmarshal metadata")
	}

	createdAt, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	post := indexerdb.Post{
		Identifier:           createPostMsg.Identifier,
		ParentPostIdentifier: createPostMsg.ParentPostIdentifier,
		Category:             createPostMsg.Category,
		Metadata:             metadataJSON,
		UserReactions:        map[string]interface{}{},
		AuthorId:             h.config.Network.UserID(execMsg.Sender),
		CreatedAt:            createdAt.Unix(),
		IsBot:                isBot,
	}

	if err := h.db.Create(&post).Error; err != nil {
		return errors.Wrap(err, "failed to create post")
	}
	if !isBot {
		h.handleQuests(execMsg, createPostMsg)
	}

	return nil
}

func (h *Handler) handleExecuteTipPost(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execTipPostMsg ExecTipPostMsg
	if err := json.Unmarshal(execMsg.Msg, &execTipPostMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute tip post msg")
	}

	post := indexerdb.Post{
		Identifier: execTipPostMsg.TipPost.Identifier,
	}

	if err := h.db.First(&post).Error; err != nil {
		return errors.Wrap(err, "post not found")
	}

	post.TipAmount += execMsg.Funds[0].Amount.Int64()
	h.db.Save(&post)

	if err := h.db.Save(&post).Error; err != nil {
		return errors.Wrap(err, "failed to update tip amount")
	}

	// complete social_feed_tip_content_creator quest
	if err := h.db.Save(&indexerdb.QuestCompletion{
		UserID:    h.config.Network.UserID(execMsg.Sender),
		QuestID:   "social_feed_tip_content_creator",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save social_feed_tip_content_creator quest completion")
	}
	return nil
}

func (h *Handler) handleQuests(
	execMsg *wasmtypes.MsgExecuteContract,
	createPostMsg *CreatePostMsg,
) error {
	questId := "unknown"
	switch createPostMsg.Category {
	case 1:
		questId = "social_feed_first_comment"
	case 2:
		questId = "social_feed_first_post"
	case 3:
		questId = "social_feed_first_article"
	case 4:
		questId = "social_feed_first_picture"
	case 5:
		questId = "social_feed_first_audio"
	case 6:
		questId = "social_feed_first_video"
	case 7:
		questId = "social_feed_first_ai_generation"
	default:
		questId = "unknown"
	}

	if questId != "unknown" {
		if err := h.db.Save(&indexerdb.QuestCompletion{
			UserID:    h.config.Network.UserID(execMsg.Sender),
			QuestID:   questId,
			Completed: true,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to save quest completion")
		}
	}

	return nil
}

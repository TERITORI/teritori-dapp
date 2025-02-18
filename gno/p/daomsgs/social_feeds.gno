package daomsgs

import (
	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daokit"
)

type CreatePostFunc func(uint64, uint64, uint64, string) uint64

const MsgCreatePostKind = "gno.land/r/teritori/daomsgs.social_feeds.CreatePost"

type MsgCreatePostDaokit struct {
	FeedID   uint64
	ParentID uint64
	Category uint64
	Metadata string
}

func (m *MsgCreatePostDaokit) String() string {
	buf := ""
	buf += ufmt.Sprintf("Create post in feed %d", m.FeedID)
	if m.ParentID != 0 {
		buf += ufmt.Sprintf(" as a reply to post %d", m.ParentID)
	}
	buf += ufmt.Sprintf(" with category %d", m.Category)
	buf += ufmt.Sprintf(" and metadata %s", m.Metadata)
	return buf
}

func NewCreatePostHandler(createPostFunc CreatePostFunc) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgCreatePostKind, func(msg interface{}) {
		message := msg.(*MsgCreatePostDaokit)
		createPostFunc(message.FeedID, message.ParentID, message.Category, message.Metadata)
	})
}

func NewCreatePostMsg(payload *MsgCreatePostDaokit) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgCreatePostKind, payload)
}

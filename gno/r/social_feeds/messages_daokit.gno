package social_feeds

import (
	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daokit"
)

const MsgCreatePostDaokitKind = "gno.land/r/teritori/social_feeds.CreatePost"

type MsgCreatePostDaokit struct {
	FeedID   FeedID
	ParentID PostID
	Category uint64
	Metadata string
}

func (m *MsgCreatePostDaokit) String() string {
	buf := ""
	buf += ufmt.Sprintf("Create post in feed %s", m.FeedID.String())
	if m.ParentID != 0 {
		buf += ufmt.Sprintf(" as a reply to post %s", m.ParentID.String())
	}
	buf += ufmt.Sprintf(" with category %d", m.Category)
	buf += ufmt.Sprintf(" and metadata %s", m.Metadata)
	return buf
}

func NewCreatePostDaokitHandler() daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgCreatePostDaokitKind, func(msg interface{}) {
		message := msg.(*MsgCreatePostDaokit)
		CreatePost(message.FeedID, message.ParentID, message.Category, message.Metadata)
	})
}

func NewCreatePostDaokitMsg(payload *MsgCreatePostDaokit) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgCreatePostDaokitKind, payload)
}

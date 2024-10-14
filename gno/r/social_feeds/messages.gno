package social_feeds

import (
	"strings"

	"gno.land/p/demo/json"
	"gno.land/p/teritori/dao_interfaces"
	"gno.land/p/teritori/jsonutil"
)

// Ban a post
type ExecutableMessageBanPost struct {
	FeedID FeedID
	PostID PostID
	Reason string
}

var _ dao_interfaces.ExecutableMessage = (*ExecutableMessageBanPost)(nil)

func (msg ExecutableMessageBanPost) Type() string {
	return "gno.land/r/teritori/social_feeds.BanPost"
}

func (msg *ExecutableMessageBanPost) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"feedId": jsonutil.IntNode(int(msg.FeedID)),
		"postId": jsonutil.IntNode(int(msg.PostID)),
		"reason": json.StringNode("", msg.Reason),
	})
}

func (msg *ExecutableMessageBanPost) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	msg.FeedID = FeedID(jsonutil.MustInt(obj["feedId"]))
	msg.PostID = PostID(jsonutil.MustInt(obj["postId"]))
	msg.Reason = obj["reason"].MustString()
}

func (msg *ExecutableMessageBanPost) String() string {
	var ss []string
	ss = append(ss, msg.Type())

	feed := getFeed(msg.FeedID)
	s := ""

	if feed != nil {
		s += "Feed: " + feed.name + " (" + feed.id.String() + ")"

		post := feed.GetPost(msg.PostID)
		if post != nil {
			s += "\n Post: " + post.id.String()
		} else {
			s += "\n Post: " + msg.PostID.String() + " (not found)"
		}
	} else {
		s += "Feed: " + msg.FeedID.String() + " (not found)"
	}

	s += "\nReason: " + msg.Reason

	ss = append(ss, s)

	return strings.Join(ss, "\n---\n")
}

type BanPostHandler struct {
}

var _ dao_interfaces.MessageHandler = (*BanPostHandler)(nil)

func NewBanPostHandler() *BanPostHandler {
	return &BanPostHandler{}
}

func (h *BanPostHandler) Execute(iMsg dao_interfaces.ExecutableMessage) {
	msg := iMsg.(*ExecutableMessageBanPost)
	BanPost(msg.FeedID, msg.PostID, msg.Reason)
}

func (h BanPostHandler) Type() string {
	return ExecutableMessageBanPost{}.Type()
}

func (h BanPostHandler) Instantiate() dao_interfaces.ExecutableMessage {
	return &ExecutableMessageBanPost{}
}

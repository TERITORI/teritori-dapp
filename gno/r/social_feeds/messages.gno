package social_feeds

import (
	"strconv"
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

type BanPostHandler struct{}

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

// Create a new post
type ExecutableMessageCreatePost struct {
	FeedID   FeedID
	ParentID PostID
	Category uint64
	Metadata string
}

var _ dao_interfaces.ExecutableMessage = (*ExecutableMessageCreatePost)(nil)

func (msg ExecutableMessageCreatePost) Type() string {
	return "gno.land/r/teritori/social_feeds.CreatePost"
}

func (msg *ExecutableMessageCreatePost) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"feedId":   jsonutil.IntNode(int(msg.FeedID)),
		"parentId": jsonutil.IntNode(int(msg.ParentID)),
		"category": jsonutil.IntNode(int(msg.Category)),
		"metadata": json.StringNode("", msg.Metadata),
	})
}

func (msg *ExecutableMessageCreatePost) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	msg.FeedID = FeedID(jsonutil.MustInt(obj["feedId"]))
	msg.ParentID = PostID(jsonutil.MustInt(obj["parentId"]))
	msg.Category = uint64(jsonutil.MustInt(obj["category"]))
	msg.Metadata = obj["metadata"].MustString()
}

func (msg *ExecutableMessageCreatePost) String() string {
	var ss []string
	ss = append(ss, msg.Type())

	feed := getFeed(msg.FeedID)
	s := ""

	if feed != nil {
		s += "Feed: " + feed.name + " (" + feed.id.String() + ")"
		s += "\nParent: " + msg.ParentID.String()
		s += "\nCategory: " + strconv.Itoa(int(msg.Category))
		s += "\nMetadata: " + msg.Metadata
	} else {
		s += "Feed: " + msg.FeedID.String() + " (not found)"
	}

	ss = append(ss, s)

	return strings.Join(ss, "\n---\n")
}

type CreatePostHandler struct{}

var _ dao_interfaces.MessageHandler = (*CreatePostHandler)(nil)

func NewCreatePostHandler() *CreatePostHandler {
	return &CreatePostHandler{}
}

func (h *CreatePostHandler) Execute(iMsg dao_interfaces.ExecutableMessage) {
	msg := iMsg.(*ExecutableMessageCreatePost)
	CreatePost(msg.FeedID, msg.ParentID, msg.Category, msg.Metadata)
}

func (h CreatePostHandler) Type() string {
	return ExecutableMessageCreatePost{}.Type()
}

func (h CreatePostHandler) Instantiate() dao_interfaces.ExecutableMessage {
	return &ExecutableMessageCreatePost{}
}

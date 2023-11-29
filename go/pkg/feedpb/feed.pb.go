// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        (unknown)
// source: feed/v1/feed.proto

package feedpb

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type IPFSKeyRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	UserId string `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
}

func (x *IPFSKeyRequest) Reset() {
	*x = IPFSKeyRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_feed_v1_feed_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *IPFSKeyRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IPFSKeyRequest) ProtoMessage() {}

func (x *IPFSKeyRequest) ProtoReflect() protoreflect.Message {
	mi := &file_feed_v1_feed_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IPFSKeyRequest.ProtoReflect.Descriptor instead.
func (*IPFSKeyRequest) Descriptor() ([]byte, []int) {
	return file_feed_v1_feed_proto_rawDescGZIP(), []int{0}
}

func (x *IPFSKeyRequest) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

type IPFSKeyResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Jwt string `protobuf:"bytes,1,opt,name=jwt,proto3" json:"jwt,omitempty"`
}

func (x *IPFSKeyResponse) Reset() {
	*x = IPFSKeyResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_feed_v1_feed_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *IPFSKeyResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IPFSKeyResponse) ProtoMessage() {}

func (x *IPFSKeyResponse) ProtoReflect() protoreflect.Message {
	mi := &file_feed_v1_feed_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IPFSKeyResponse.ProtoReflect.Descriptor instead.
func (*IPFSKeyResponse) Descriptor() ([]byte, []int) {
	return file_feed_v1_feed_proto_rawDescGZIP(), []int{1}
}

func (x *IPFSKeyResponse) GetJwt() string {
	if x != nil {
		return x.Jwt
	}
	return ""
}

type Reaction struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Icon     string `protobuf:"bytes,1,opt,name=icon,proto3" json:"icon,omitempty"`
	Count    uint32 `protobuf:"varint,2,opt,name=count,proto3" json:"count,omitempty"`
	OwnState bool   `protobuf:"varint,3,opt,name=own_state,json=ownState,proto3" json:"own_state,omitempty"`
}

func (x *Reaction) Reset() {
	*x = Reaction{}
	if protoimpl.UnsafeEnabled {
		mi := &file_feed_v1_feed_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Reaction) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Reaction) ProtoMessage() {}

func (x *Reaction) ProtoReflect() protoreflect.Message {
	mi := &file_feed_v1_feed_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Reaction.ProtoReflect.Descriptor instead.
func (*Reaction) Descriptor() ([]byte, []int) {
	return file_feed_v1_feed_proto_rawDescGZIP(), []int{2}
}

func (x *Reaction) GetIcon() string {
	if x != nil {
		return x.Icon
	}
	return ""
}

func (x *Reaction) GetCount() uint32 {
	if x != nil {
		return x.Count
	}
	return 0
}

func (x *Reaction) GetOwnState() bool {
	if x != nil {
		return x.OwnState
	}
	return false
}

type Post struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Category             uint32      `protobuf:"varint,1,opt,name=category,proto3" json:"category,omitempty"`
	IsDeleted            bool        `protobuf:"varint,2,opt,name=is_deleted,json=isDeleted,proto3" json:"is_deleted,omitempty"`
	Identifier           string      `protobuf:"bytes,3,opt,name=identifier,proto3" json:"identifier,omitempty"`
	Metadata             string      `protobuf:"bytes,4,opt,name=metadata,proto3" json:"metadata,omitempty"`
	ParentPostIdentifier string      `protobuf:"bytes,5,opt,name=parent_post_identifier,json=parentPostIdentifier,proto3" json:"parent_post_identifier,omitempty"`
	SubPostLength        uint32      `protobuf:"varint,6,opt,name=sub_post_length,json=subPostLength,proto3" json:"sub_post_length,omitempty"`
	AuthorId             string      `protobuf:"bytes,7,opt,name=author_id,json=authorId,proto3" json:"author_id,omitempty"`
	CreatedAt            int64       `protobuf:"varint,8,opt,name=created_at,json=createdAt,proto3" json:"created_at,omitempty"`
	TipAmount            int64       `protobuf:"varint,10,opt,name=tip_amount,json=tipAmount,proto3" json:"tip_amount,omitempty"`
	Reactions            []*Reaction `protobuf:"bytes,9,rep,name=reactions,proto3" json:"reactions,omitempty"`
}

func (x *Post) Reset() {
	*x = Post{}
	if protoimpl.UnsafeEnabled {
		mi := &file_feed_v1_feed_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Post) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Post) ProtoMessage() {}

func (x *Post) ProtoReflect() protoreflect.Message {
	mi := &file_feed_v1_feed_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Post.ProtoReflect.Descriptor instead.
func (*Post) Descriptor() ([]byte, []int) {
	return file_feed_v1_feed_proto_rawDescGZIP(), []int{3}
}

func (x *Post) GetCategory() uint32 {
	if x != nil {
		return x.Category
	}
	return 0
}

func (x *Post) GetIsDeleted() bool {
	if x != nil {
		return x.IsDeleted
	}
	return false
}

func (x *Post) GetIdentifier() string {
	if x != nil {
		return x.Identifier
	}
	return ""
}

func (x *Post) GetMetadata() string {
	if x != nil {
		return x.Metadata
	}
	return ""
}

func (x *Post) GetParentPostIdentifier() string {
	if x != nil {
		return x.ParentPostIdentifier
	}
	return ""
}

func (x *Post) GetSubPostLength() uint32 {
	if x != nil {
		return x.SubPostLength
	}
	return 0
}

func (x *Post) GetAuthorId() string {
	if x != nil {
		return x.AuthorId
	}
	return ""
}

func (x *Post) GetCreatedAt() int64 {
	if x != nil {
		return x.CreatedAt
	}
	return 0
}

func (x *Post) GetTipAmount() int64 {
	if x != nil {
		return x.TipAmount
	}
	return 0
}

func (x *Post) GetReactions() []*Reaction {
	if x != nil {
		return x.Reactions
	}
	return nil
}

type PostFilter struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	User       string   `protobuf:"bytes,1,opt,name=user,proto3" json:"user,omitempty"`
	Mentions   []string `protobuf:"bytes,2,rep,name=mentions,proto3" json:"mentions,omitempty"`
	Categories []uint32 `protobuf:"varint,3,rep,packed,name=categories,proto3" json:"categories,omitempty"`
	Hashtags   []string `protobuf:"bytes,4,rep,name=hashtags,proto3" json:"hashtags,omitempty"`
	FollowedBy string   `protobuf:"bytes,5,opt,name=followed_by,json=followedBy,proto3" json:"followed_by,omitempty"`
}

func (x *PostFilter) Reset() {
	*x = PostFilter{}
	if protoimpl.UnsafeEnabled {
		mi := &file_feed_v1_feed_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PostFilter) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PostFilter) ProtoMessage() {}

func (x *PostFilter) ProtoReflect() protoreflect.Message {
	mi := &file_feed_v1_feed_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PostFilter.ProtoReflect.Descriptor instead.
func (*PostFilter) Descriptor() ([]byte, []int) {
	return file_feed_v1_feed_proto_rawDescGZIP(), []int{4}
}

func (x *PostFilter) GetUser() string {
	if x != nil {
		return x.User
	}
	return ""
}

func (x *PostFilter) GetMentions() []string {
	if x != nil {
		return x.Mentions
	}
	return nil
}

func (x *PostFilter) GetCategories() []uint32 {
	if x != nil {
		return x.Categories
	}
	return nil
}

func (x *PostFilter) GetHashtags() []string {
	if x != nil {
		return x.Hashtags
	}
	return nil
}

func (x *PostFilter) GetFollowedBy() string {
	if x != nil {
		return x.FollowedBy
	}
	return ""
}

type PostsRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Filter      *PostFilter `protobuf:"bytes,1,opt,name=filter,proto3" json:"filter,omitempty"`
	Limit       uint32      `protobuf:"varint,2,opt,name=limit,proto3" json:"limit,omitempty"`
	Offset      uint32      `protobuf:"varint,3,opt,name=offset,proto3" json:"offset,omitempty"`
	QueryUserId string      `protobuf:"bytes,4,opt,name=query_user_id,json=queryUserId,proto3" json:"query_user_id,omitempty"`
}

func (x *PostsRequest) Reset() {
	*x = PostsRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_feed_v1_feed_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PostsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PostsRequest) ProtoMessage() {}

func (x *PostsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_feed_v1_feed_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PostsRequest.ProtoReflect.Descriptor instead.
func (*PostsRequest) Descriptor() ([]byte, []int) {
	return file_feed_v1_feed_proto_rawDescGZIP(), []int{5}
}

func (x *PostsRequest) GetFilter() *PostFilter {
	if x != nil {
		return x.Filter
	}
	return nil
}

func (x *PostsRequest) GetLimit() uint32 {
	if x != nil {
		return x.Limit
	}
	return 0
}

func (x *PostsRequest) GetOffset() uint32 {
	if x != nil {
		return x.Offset
	}
	return 0
}

func (x *PostsRequest) GetQueryUserId() string {
	if x != nil {
		return x.QueryUserId
	}
	return ""
}

type PostsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Posts []*Post `protobuf:"bytes,1,rep,name=posts,proto3" json:"posts,omitempty"`
}

func (x *PostsResponse) Reset() {
	*x = PostsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_feed_v1_feed_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PostsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PostsResponse) ProtoMessage() {}

func (x *PostsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_feed_v1_feed_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PostsResponse.ProtoReflect.Descriptor instead.
func (*PostsResponse) Descriptor() ([]byte, []int) {
	return file_feed_v1_feed_proto_rawDescGZIP(), []int{6}
}

func (x *PostsResponse) GetPosts() []*Post {
	if x != nil {
		return x.Posts
	}
	return nil
}

var File_feed_v1_feed_proto protoreflect.FileDescriptor

var file_feed_v1_feed_proto_rawDesc = []byte{
	0x0a, 0x12, 0x66, 0x65, 0x65, 0x64, 0x2f, 0x76, 0x31, 0x2f, 0x66, 0x65, 0x65, 0x64, 0x2e, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x12, 0x07, 0x66, 0x65, 0x65, 0x64, 0x2e, 0x76, 0x31, 0x22, 0x29, 0x0a,
	0x0e, 0x49, 0x50, 0x46, 0x53, 0x4b, 0x65, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12,
	0x17, 0x0a, 0x07, 0x75, 0x73, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x22, 0x23, 0x0a, 0x0f, 0x49, 0x50, 0x46, 0x53,
	0x4b, 0x65, 0x79, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x10, 0x0a, 0x03, 0x6a,
	0x77, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x6a, 0x77, 0x74, 0x22, 0x51, 0x0a,
	0x08, 0x52, 0x65, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x12, 0x0a, 0x04, 0x69, 0x63, 0x6f,
	0x6e, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x69, 0x63, 0x6f, 0x6e, 0x12, 0x14, 0x0a,
	0x05, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0d, 0x52, 0x05, 0x63, 0x6f,
	0x75, 0x6e, 0x74, 0x12, 0x1b, 0x0a, 0x09, 0x6f, 0x77, 0x6e, 0x5f, 0x73, 0x74, 0x61, 0x74, 0x65,
	0x18, 0x03, 0x20, 0x01, 0x28, 0x08, 0x52, 0x08, 0x6f, 0x77, 0x6e, 0x53, 0x74, 0x61, 0x74, 0x65,
	0x22, 0xe7, 0x02, 0x0a, 0x04, 0x50, 0x6f, 0x73, 0x74, 0x12, 0x1a, 0x0a, 0x08, 0x63, 0x61, 0x74,
	0x65, 0x67, 0x6f, 0x72, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0d, 0x52, 0x08, 0x63, 0x61, 0x74,
	0x65, 0x67, 0x6f, 0x72, 0x79, 0x12, 0x1d, 0x0a, 0x0a, 0x69, 0x73, 0x5f, 0x64, 0x65, 0x6c, 0x65,
	0x74, 0x65, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x08, 0x52, 0x09, 0x69, 0x73, 0x44, 0x65, 0x6c,
	0x65, 0x74, 0x65, 0x64, 0x12, 0x1e, 0x0a, 0x0a, 0x69, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69,
	0x65, 0x72, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x69, 0x64, 0x65, 0x6e, 0x74, 0x69,
	0x66, 0x69, 0x65, 0x72, 0x12, 0x1a, 0x0a, 0x08, 0x6d, 0x65, 0x74, 0x61, 0x64, 0x61, 0x74, 0x61,
	0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x6d, 0x65, 0x74, 0x61, 0x64, 0x61, 0x74, 0x61,
	0x12, 0x34, 0x0a, 0x16, 0x70, 0x61, 0x72, 0x65, 0x6e, 0x74, 0x5f, 0x70, 0x6f, 0x73, 0x74, 0x5f,
	0x69, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x18, 0x05, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x14, 0x70, 0x61, 0x72, 0x65, 0x6e, 0x74, 0x50, 0x6f, 0x73, 0x74, 0x49, 0x64, 0x65, 0x6e,
	0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x12, 0x26, 0x0a, 0x0f, 0x73, 0x75, 0x62, 0x5f, 0x70, 0x6f,
	0x73, 0x74, 0x5f, 0x6c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x18, 0x06, 0x20, 0x01, 0x28, 0x0d, 0x52,
	0x0d, 0x73, 0x75, 0x62, 0x50, 0x6f, 0x73, 0x74, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x12, 0x1b,
	0x0a, 0x09, 0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x07, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x08, 0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x49, 0x64, 0x12, 0x1d, 0x0a, 0x0a, 0x63,
	0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x18, 0x08, 0x20, 0x01, 0x28, 0x03, 0x52,
	0x09, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x41, 0x74, 0x12, 0x1d, 0x0a, 0x0a, 0x74, 0x69,
	0x70, 0x5f, 0x61, 0x6d, 0x6f, 0x75, 0x6e, 0x74, 0x18, 0x0a, 0x20, 0x01, 0x28, 0x03, 0x52, 0x09,
	0x74, 0x69, 0x70, 0x41, 0x6d, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x2f, 0x0a, 0x09, 0x72, 0x65, 0x61,
	0x63, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x18, 0x09, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x11, 0x2e, 0x66,
	0x65, 0x65, 0x64, 0x2e, 0x76, 0x31, 0x2e, 0x52, 0x65, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x52,
	0x09, 0x72, 0x65, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x22, 0x99, 0x01, 0x0a, 0x0a, 0x50,
	0x6f, 0x73, 0x74, 0x46, 0x69, 0x6c, 0x74, 0x65, 0x72, 0x12, 0x12, 0x0a, 0x04, 0x75, 0x73, 0x65,
	0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x75, 0x73, 0x65, 0x72, 0x12, 0x1a, 0x0a,
	0x08, 0x6d, 0x65, 0x6e, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x18, 0x02, 0x20, 0x03, 0x28, 0x09, 0x52,
	0x08, 0x6d, 0x65, 0x6e, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x12, 0x1e, 0x0a, 0x0a, 0x63, 0x61, 0x74,
	0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x18, 0x03, 0x20, 0x03, 0x28, 0x0d, 0x52, 0x0a, 0x63,
	0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x12, 0x1a, 0x0a, 0x08, 0x68, 0x61, 0x73,
	0x68, 0x74, 0x61, 0x67, 0x73, 0x18, 0x04, 0x20, 0x03, 0x28, 0x09, 0x52, 0x08, 0x68, 0x61, 0x73,
	0x68, 0x74, 0x61, 0x67, 0x73, 0x12, 0x1f, 0x0a, 0x0b, 0x66, 0x6f, 0x6c, 0x6c, 0x6f, 0x77, 0x65,
	0x64, 0x5f, 0x62, 0x79, 0x18, 0x05, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x66, 0x6f, 0x6c, 0x6c,
	0x6f, 0x77, 0x65, 0x64, 0x42, 0x79, 0x22, 0x8d, 0x01, 0x0a, 0x0c, 0x50, 0x6f, 0x73, 0x74, 0x73,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x2b, 0x0a, 0x06, 0x66, 0x69, 0x6c, 0x74, 0x65,
	0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x13, 0x2e, 0x66, 0x65, 0x65, 0x64, 0x2e, 0x76,
	0x31, 0x2e, 0x50, 0x6f, 0x73, 0x74, 0x46, 0x69, 0x6c, 0x74, 0x65, 0x72, 0x52, 0x06, 0x66, 0x69,
	0x6c, 0x74, 0x65, 0x72, 0x12, 0x14, 0x0a, 0x05, 0x6c, 0x69, 0x6d, 0x69, 0x74, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x0d, 0x52, 0x05, 0x6c, 0x69, 0x6d, 0x69, 0x74, 0x12, 0x16, 0x0a, 0x06, 0x6f, 0x66,
	0x66, 0x73, 0x65, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0d, 0x52, 0x06, 0x6f, 0x66, 0x66, 0x73,
	0x65, 0x74, 0x12, 0x22, 0x0a, 0x0d, 0x71, 0x75, 0x65, 0x72, 0x79, 0x5f, 0x75, 0x73, 0x65, 0x72,
	0x5f, 0x69, 0x64, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0b, 0x71, 0x75, 0x65, 0x72, 0x79,
	0x55, 0x73, 0x65, 0x72, 0x49, 0x64, 0x22, 0x34, 0x0a, 0x0d, 0x50, 0x6f, 0x73, 0x74, 0x73, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x23, 0x0a, 0x05, 0x70, 0x6f, 0x73, 0x74, 0x73,
	0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x66, 0x65, 0x65, 0x64, 0x2e, 0x76, 0x31,
	0x2e, 0x50, 0x6f, 0x73, 0x74, 0x52, 0x05, 0x70, 0x6f, 0x73, 0x74, 0x73, 0x32, 0x83, 0x01, 0x0a,
	0x0b, 0x46, 0x65, 0x65, 0x64, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x36, 0x0a, 0x05,
	0x50, 0x6f, 0x73, 0x74, 0x73, 0x12, 0x15, 0x2e, 0x66, 0x65, 0x65, 0x64, 0x2e, 0x76, 0x31, 0x2e,
	0x50, 0x6f, 0x73, 0x74, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x16, 0x2e, 0x66,
	0x65, 0x65, 0x64, 0x2e, 0x76, 0x31, 0x2e, 0x50, 0x6f, 0x73, 0x74, 0x73, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x3c, 0x0a, 0x07, 0x49, 0x50, 0x46, 0x53, 0x4b, 0x65, 0x79, 0x12,
	0x17, 0x2e, 0x66, 0x65, 0x65, 0x64, 0x2e, 0x76, 0x31, 0x2e, 0x49, 0x50, 0x46, 0x53, 0x4b, 0x65,
	0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x18, 0x2e, 0x66, 0x65, 0x65, 0x64, 0x2e,
	0x76, 0x31, 0x2e, 0x49, 0x50, 0x46, 0x53, 0x4b, 0x65, 0x79, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x42, 0x0a, 0x5a, 0x08, 0x2e, 0x2f, 0x66, 0x65, 0x65, 0x64, 0x70, 0x62, 0x62, 0x06,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_feed_v1_feed_proto_rawDescOnce sync.Once
	file_feed_v1_feed_proto_rawDescData = file_feed_v1_feed_proto_rawDesc
)

func file_feed_v1_feed_proto_rawDescGZIP() []byte {
	file_feed_v1_feed_proto_rawDescOnce.Do(func() {
		file_feed_v1_feed_proto_rawDescData = protoimpl.X.CompressGZIP(file_feed_v1_feed_proto_rawDescData)
	})
	return file_feed_v1_feed_proto_rawDescData
}

var file_feed_v1_feed_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_feed_v1_feed_proto_goTypes = []interface{}{
	(*IPFSKeyRequest)(nil),  // 0: feed.v1.IPFSKeyRequest
	(*IPFSKeyResponse)(nil), // 1: feed.v1.IPFSKeyResponse
	(*Reaction)(nil),        // 2: feed.v1.Reaction
	(*Post)(nil),            // 3: feed.v1.Post
	(*PostFilter)(nil),      // 4: feed.v1.PostFilter
	(*PostsRequest)(nil),    // 5: feed.v1.PostsRequest
	(*PostsResponse)(nil),   // 6: feed.v1.PostsResponse
}
var file_feed_v1_feed_proto_depIdxs = []int32{
	2, // 0: feed.v1.Post.reactions:type_name -> feed.v1.Reaction
	4, // 1: feed.v1.PostsRequest.filter:type_name -> feed.v1.PostFilter
	3, // 2: feed.v1.PostsResponse.posts:type_name -> feed.v1.Post
	5, // 3: feed.v1.FeedService.Posts:input_type -> feed.v1.PostsRequest
	0, // 4: feed.v1.FeedService.IPFSKey:input_type -> feed.v1.IPFSKeyRequest
	6, // 5: feed.v1.FeedService.Posts:output_type -> feed.v1.PostsResponse
	1, // 6: feed.v1.FeedService.IPFSKey:output_type -> feed.v1.IPFSKeyResponse
	5, // [5:7] is the sub-list for method output_type
	3, // [3:5] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_feed_v1_feed_proto_init() }
func file_feed_v1_feed_proto_init() {
	if File_feed_v1_feed_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_feed_v1_feed_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*IPFSKeyRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_feed_v1_feed_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*IPFSKeyResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_feed_v1_feed_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Reaction); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_feed_v1_feed_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Post); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_feed_v1_feed_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PostFilter); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_feed_v1_feed_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PostsRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_feed_v1_feed_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PostsResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_feed_v1_feed_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_feed_v1_feed_proto_goTypes,
		DependencyIndexes: file_feed_v1_feed_proto_depIdxs,
		MessageInfos:      file_feed_v1_feed_proto_msgTypes,
	}.Build()
	File_feed_v1_feed_proto = out.File
	file_feed_v1_feed_proto_rawDesc = nil
	file_feed_v1_feed_proto_goTypes = nil
	file_feed_v1_feed_proto_depIdxs = nil
}

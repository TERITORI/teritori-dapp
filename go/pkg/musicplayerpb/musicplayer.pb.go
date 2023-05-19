// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1-devel
// 	protoc        v3.12.4
// source: api/musicplayer/v1/musicplayer.proto

package musicplayerpb

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

type GetAlbumListRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *GetAlbumListRequest) Reset() {
	*x = GetAlbumListRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetAlbumListRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAlbumListRequest) ProtoMessage() {}

func (x *GetAlbumListRequest) ProtoReflect() protoreflect.Message {
	mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAlbumListRequest.ProtoReflect.Descriptor instead.
func (*GetAlbumListRequest) Descriptor() ([]byte, []int) {
	return file_api_musicplayer_v1_musicplayer_proto_rawDescGZIP(), []int{0}
}

type MusicAlbumInfo struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Identifier    string `protobuf:"bytes,1,opt,name=identifier,proto3" json:"identifier,omitempty"`
	Metadata      string `protobuf:"bytes,2,opt,name=metadata,proto3" json:"metadata,omitempty"`
	CreatedBy string `protobuf:"bytes,3,opt,name=createdBy,proto3" json:"createdBy,omitempty"`
}

func (x *MusicAlbumInfo) Reset() {
	*x = MusicAlbumInfo{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *MusicAlbumInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*MusicAlbumInfo) ProtoMessage() {}

func (x *MusicAlbumInfo) ProtoReflect() protoreflect.Message {
	mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use MusicAlbumInfo.ProtoReflect.Descriptor instead.
func (*MusicAlbumInfo) Descriptor() ([]byte, []int) {
	return file_api_musicplayer_v1_musicplayer_proto_rawDescGZIP(), []int{1}
}

func (x *MusicAlbumInfo) GetIdentifier() string {
	if x != nil {
		return x.Identifier
	}
	return ""
}

func (x *MusicAlbumInfo) GetMetadata() string {
	if x != nil {
		return x.Metadata
	}
	return ""
}

func (x *MusicAlbumInfo) GetCreatedUserId() string {
	if x != nil {
		return x.CreatedBy
	}
	return ""
}

type GetAlbumListResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	MusicAlbums []*MusicAlbumInfo `protobuf:"bytes,1,rep,name=musicAlbums,proto3" json:"musicAlbums,omitempty"`
}

func (x *GetAlbumListResponse) Reset() {
	*x = GetAlbumListResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetAlbumListResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAlbumListResponse) ProtoMessage() {}

func (x *GetAlbumListResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAlbumListResponse.ProtoReflect.Descriptor instead.
func (*GetAlbumListResponse) Descriptor() ([]byte, []int) {
	return file_api_musicplayer_v1_musicplayer_proto_rawDescGZIP(), []int{2}
}

func (x *GetAlbumListResponse) GetMusicAlbums() []*MusicAlbumInfo {
	if x != nil {
		return x.MusicAlbums
	}
	return nil
}

type GetAlbumRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Identifier string `protobuf:"bytes,1,opt,name=identifier,proto3" json:"identifier,omitempty"`
}

func (x *GetAlbumRequest) Reset() {
	*x = GetAlbumRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetAlbumRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAlbumRequest) ProtoMessage() {}

func (x *GetAlbumRequest) ProtoReflect() protoreflect.Message {
	mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAlbumRequest.ProtoReflect.Descriptor instead.
func (*GetAlbumRequest) Descriptor() ([]byte, []int) {
	return file_api_musicplayer_v1_musicplayer_proto_rawDescGZIP(), []int{3}
}

func (x *GetAlbumRequest) GetIdentifier() string {
	if x != nil {
		return x.Identifier
	}
	return ""
}

type GetAlbumResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	MusicAlbum *MusicAlbumInfo `protobuf:"bytes,1,opt,name=musicAlbum,proto3" json:"musicAlbum,omitempty"`
}

func (x *GetAlbumResponse) Reset() {
	*x = GetAlbumResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetAlbumResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAlbumResponse) ProtoMessage() {}

func (x *GetAlbumResponse) ProtoReflect() protoreflect.Message {
	mi := &file_api_musicplayer_v1_musicplayer_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAlbumResponse.ProtoReflect.Descriptor instead.
func (*GetAlbumResponse) Descriptor() ([]byte, []int) {
	return file_api_musicplayer_v1_musicplayer_proto_rawDescGZIP(), []int{4}
}

func (x *GetAlbumResponse) GetMusicAlbum() *MusicAlbumInfo {
	if x != nil {
		return x.MusicAlbum
	}
	return nil
}

var File_api_musicplayer_v1_musicplayer_proto protoreflect.FileDescriptor

var file_api_musicplayer_v1_musicplayer_proto_rawDesc = []byte{
	0x0a, 0x24, 0x61, 0x70, 0x69, 0x2f, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c, 0x61, 0x79, 0x65,
	0x72, 0x2f, 0x76, 0x31, 0x2f, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c, 0x61, 0x79, 0x65, 0x72,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0e, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c, 0x61,
	0x79, 0x65, 0x72, 0x2e, 0x76, 0x31, 0x22, 0x15, 0x0a, 0x13, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x62,
	0x75, 0x6d, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22, 0x72, 0x0a,
	0x0e, 0x4d, 0x75, 0x73, 0x69, 0x63, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x49, 0x6e, 0x66, 0x6f, 0x12,
	0x1e, 0x0a, 0x0a, 0x69, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x0a, 0x69, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x12,
	0x1a, 0x0a, 0x08, 0x6d, 0x65, 0x74, 0x61, 0x64, 0x61, 0x74, 0x61, 0x18, 0x02, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x08, 0x6d, 0x65, 0x74, 0x61, 0x64, 0x61, 0x74, 0x61, 0x12, 0x24, 0x0a, 0x0d, 0x63,
	0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x55, 0x73, 0x65, 0x72, 0x49, 0x64, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0d, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x55, 0x73, 0x65, 0x72, 0x49,
	0x64, 0x22, 0x58, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x4c, 0x69, 0x73,
	0x74, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x40, 0x0a, 0x0b, 0x6d, 0x75, 0x73,
	0x69, 0x63, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x1e,
	0x2e, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c, 0x61, 0x79, 0x65, 0x72, 0x2e, 0x76, 0x31, 0x2e,
	0x4d, 0x75, 0x73, 0x69, 0x63, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x0b,
	0x6d, 0x75, 0x73, 0x69, 0x63, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x73, 0x22, 0x31, 0x0a, 0x0f, 0x47,
	0x65, 0x74, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x1e,
	0x0a, 0x0a, 0x69, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0a, 0x69, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x22, 0x52,
	0x0a, 0x10, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x12, 0x3e, 0x0a, 0x0a, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x41, 0x6c, 0x62, 0x75, 0x6d,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1e, 0x2e, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c,
	0x61, 0x79, 0x65, 0x72, 0x2e, 0x76, 0x31, 0x2e, 0x4d, 0x75, 0x73, 0x69, 0x63, 0x41, 0x6c, 0x62,
	0x75, 0x6d, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x0a, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x41, 0x6c, 0x62,
	0x75, 0x6d, 0x32, 0xbe, 0x01, 0x0a, 0x12, 0x4d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c, 0x61, 0x79,
	0x65, 0x72, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x59, 0x0a, 0x0c, 0x47, 0x65, 0x74,
	0x41, 0x6c, 0x62, 0x75, 0x6d, 0x4c, 0x69, 0x73, 0x74, 0x12, 0x23, 0x2e, 0x6d, 0x75, 0x73, 0x69,
	0x63, 0x70, 0x6c, 0x61, 0x79, 0x65, 0x72, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x6c,
	0x62, 0x75, 0x6d, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x24,
	0x2e, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c, 0x61, 0x79, 0x65, 0x72, 0x2e, 0x76, 0x31, 0x2e,
	0x47, 0x65, 0x74, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x4d, 0x0a, 0x08, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x62, 0x75, 0x6d,
	0x12, 0x1f, 0x2e, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c, 0x61, 0x79, 0x65, 0x72, 0x2e, 0x76,
	0x31, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x20, 0x2e, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c, 0x61, 0x79, 0x65, 0x72, 0x2e,
	0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x6c, 0x62, 0x75, 0x6d, 0x52, 0x65, 0x73, 0x70, 0x6f,
	0x6e, 0x73, 0x65, 0x42, 0x11, 0x5a, 0x0f, 0x2e, 0x2f, 0x6d, 0x75, 0x73, 0x69, 0x63, 0x70, 0x6c,
	0x61, 0x79, 0x65, 0x72, 0x70, 0x62, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_api_musicplayer_v1_musicplayer_proto_rawDescOnce sync.Once
	file_api_musicplayer_v1_musicplayer_proto_rawDescData = file_api_musicplayer_v1_musicplayer_proto_rawDesc
)

func file_api_musicplayer_v1_musicplayer_proto_rawDescGZIP() []byte {
	file_api_musicplayer_v1_musicplayer_proto_rawDescOnce.Do(func() {
		file_api_musicplayer_v1_musicplayer_proto_rawDescData = protoimpl.X.CompressGZIP(file_api_musicplayer_v1_musicplayer_proto_rawDescData)
	})
	return file_api_musicplayer_v1_musicplayer_proto_rawDescData
}

var file_api_musicplayer_v1_musicplayer_proto_msgTypes = make([]protoimpl.MessageInfo, 5)
var file_api_musicplayer_v1_musicplayer_proto_goTypes = []interface{}{
	(*GetAlbumListRequest)(nil),  // 0: musicplayer.v1.GetAlbumListRequest
	(*MusicAlbumInfo)(nil),       // 1: musicplayer.v1.MusicAlbumInfo
	(*GetAlbumListResponse)(nil), // 2: musicplayer.v1.GetAlbumListResponse
	(*GetAlbumRequest)(nil),      // 3: musicplayer.v1.GetAlbumRequest
	(*GetAlbumResponse)(nil),     // 4: musicplayer.v1.GetAlbumResponse
}
var file_api_musicplayer_v1_musicplayer_proto_depIdxs = []int32{
	1, // 0: musicplayer.v1.GetAlbumListResponse.musicAlbums:type_name -> musicplayer.v1.MusicAlbumInfo
	1, // 1: musicplayer.v1.GetAlbumResponse.musicAlbum:type_name -> musicplayer.v1.MusicAlbumInfo
	0, // 2: musicplayer.v1.MusicplayerService.GetAlbumList:input_type -> musicplayer.v1.GetAlbumListRequest
	3, // 3: musicplayer.v1.MusicplayerService.GetAlbum:input_type -> musicplayer.v1.GetAlbumRequest
	2, // 4: musicplayer.v1.MusicplayerService.GetAlbumList:output_type -> musicplayer.v1.GetAlbumListResponse
	4, // 5: musicplayer.v1.MusicplayerService.GetAlbum:output_type -> musicplayer.v1.GetAlbumResponse
	4, // [4:6] is the sub-list for method output_type
	2, // [2:4] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_api_musicplayer_v1_musicplayer_proto_init() }
func file_api_musicplayer_v1_musicplayer_proto_init() {
	if File_api_musicplayer_v1_musicplayer_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_api_musicplayer_v1_musicplayer_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetAlbumListRequest); i {
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
		file_api_musicplayer_v1_musicplayer_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*MusicAlbumInfo); i {
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
		file_api_musicplayer_v1_musicplayer_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetAlbumListResponse); i {
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
		file_api_musicplayer_v1_musicplayer_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetAlbumRequest); i {
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
		file_api_musicplayer_v1_musicplayer_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetAlbumResponse); i {
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
			RawDescriptor: file_api_musicplayer_v1_musicplayer_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   5,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_api_musicplayer_v1_musicplayer_proto_goTypes,
		DependencyIndexes: file_api_musicplayer_v1_musicplayer_proto_depIdxs,
		MessageInfos:      file_api_musicplayer_v1_musicplayer_proto_msgTypes,
	}.Build()
	File_api_musicplayer_v1_musicplayer_proto = out.File
	file_api_musicplayer_v1_musicplayer_proto_rawDesc = nil
	file_api_musicplayer_v1_musicplayer_proto_goTypes = nil
	file_api_musicplayer_v1_musicplayer_proto_depIdxs = nil
}
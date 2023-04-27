// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        (unknown)
// source: block_txs.proto

package pb

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

type BlockTxs struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Txs []*Tx `protobuf:"bytes,1,rep,name=txs,proto3" json:"txs,omitempty"`
}

func (x *BlockTxs) Reset() {
	*x = BlockTxs{}
	if protoimpl.UnsafeEnabled {
		mi := &file_block_txs_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *BlockTxs) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*BlockTxs) ProtoMessage() {}

func (x *BlockTxs) ProtoReflect() protoreflect.Message {
	mi := &file_block_txs_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use BlockTxs.ProtoReflect.Descriptor instead.
func (*BlockTxs) Descriptor() ([]byte, []int) {
	return file_block_txs_proto_rawDescGZIP(), []int{0}
}

func (x *BlockTxs) GetTxs() []*Tx {
	if x != nil {
		return x.Txs
	}
	return nil
}

type Info struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	From       string `protobuf:"bytes,1,opt,name=from,proto3" json:"from,omitempty"`
	To         string `protobuf:"bytes,2,opt,name=to,proto3" json:"to,omitempty"`
	Hash       string `protobuf:"bytes,3,opt,name=hash,proto3" json:"hash,omitempty"`
	Value      string `protobuf:"bytes,4,opt,name=value,proto3" json:"value,omitempty"`
	ReturnData []byte `protobuf:"bytes,5,opt,name=return_data,json=returnData,proto3" json:"return_data,omitempty"`
	Input      []byte `protobuf:"bytes,6,opt,name=input,proto3" json:"input,omitempty"`
}

func (x *Info) Reset() {
	*x = Info{}
	if protoimpl.UnsafeEnabled {
		mi := &file_block_txs_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Info) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Info) ProtoMessage() {}

func (x *Info) ProtoReflect() protoreflect.Message {
	mi := &file_block_txs_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Info.ProtoReflect.Descriptor instead.
func (*Info) Descriptor() ([]byte, []int) {
	return file_block_txs_proto_rawDescGZIP(), []int{1}
}

func (x *Info) GetFrom() string {
	if x != nil {
		return x.From
	}
	return ""
}

func (x *Info) GetTo() string {
	if x != nil {
		return x.To
	}
	return ""
}

func (x *Info) GetHash() string {
	if x != nil {
		return x.Hash
	}
	return ""
}

func (x *Info) GetValue() string {
	if x != nil {
		return x.Value
	}
	return ""
}

func (x *Info) GetReturnData() []byte {
	if x != nil {
		return x.ReturnData
	}
	return nil
}

func (x *Info) GetInput() []byte {
	if x != nil {
		return x.Input
	}
	return nil
}

type Log struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Address string   `protobuf:"bytes,1,opt,name=address,proto3" json:"address,omitempty"`
	Data    []byte   `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
	Index   uint32   `protobuf:"varint,3,opt,name=index,proto3" json:"index,omitempty"`
	Topics  [][]byte `protobuf:"bytes,4,rep,name=topics,proto3" json:"topics,omitempty"`
}

func (x *Log) Reset() {
	*x = Log{}
	if protoimpl.UnsafeEnabled {
		mi := &file_block_txs_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Log) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Log) ProtoMessage() {}

func (x *Log) ProtoReflect() protoreflect.Message {
	mi := &file_block_txs_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Log.ProtoReflect.Descriptor instead.
func (*Log) Descriptor() ([]byte, []int) {
	return file_block_txs_proto_rawDescGZIP(), []int{2}
}

func (x *Log) GetAddress() string {
	if x != nil {
		return x.Address
	}
	return ""
}

func (x *Log) GetData() []byte {
	if x != nil {
		return x.Data
	}
	return nil
}

func (x *Log) GetIndex() uint32 {
	if x != nil {
		return x.Index
	}
	return 0
}

func (x *Log) GetTopics() [][]byte {
	if x != nil {
		return x.Topics
	}
	return nil
}

type Call struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Caller     string `protobuf:"bytes,1,opt,name=caller,proto3" json:"caller,omitempty"`
	Address    string `protobuf:"bytes,2,opt,name=address,proto3" json:"address,omitempty"`
	Value      string `protobuf:"bytes,3,opt,name=value,proto3" json:"value,omitempty"`
	ReturnData []byte `protobuf:"bytes,4,opt,name=return_data,json=returnData,proto3" json:"return_data,omitempty"`
	Input      []byte `protobuf:"bytes,5,opt,name=input,proto3" json:"input,omitempty"`
	Logs       []*Log `protobuf:"bytes,6,rep,name=logs,proto3" json:"logs,omitempty"`
}

func (x *Call) Reset() {
	*x = Call{}
	if protoimpl.UnsafeEnabled {
		mi := &file_block_txs_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Call) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Call) ProtoMessage() {}

func (x *Call) ProtoReflect() protoreflect.Message {
	mi := &file_block_txs_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Call.ProtoReflect.Descriptor instead.
func (*Call) Descriptor() ([]byte, []int) {
	return file_block_txs_proto_rawDescGZIP(), []int{3}
}

func (x *Call) GetCaller() string {
	if x != nil {
		return x.Caller
	}
	return ""
}

func (x *Call) GetAddress() string {
	if x != nil {
		return x.Address
	}
	return ""
}

func (x *Call) GetValue() string {
	if x != nil {
		return x.Value
	}
	return ""
}

func (x *Call) GetReturnData() []byte {
	if x != nil {
		return x.ReturnData
	}
	return nil
}

func (x *Call) GetInput() []byte {
	if x != nil {
		return x.Input
	}
	return nil
}

func (x *Call) GetLogs() []*Log {
	if x != nil {
		return x.Logs
	}
	return nil
}

type Clock struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Number    uint64 `protobuf:"varint,2,opt,name=number,proto3" json:"number,omitempty"`
	Timestamp uint64 `protobuf:"varint,3,opt,name=timestamp,proto3" json:"timestamp,omitempty"`
}

func (x *Clock) Reset() {
	*x = Clock{}
	if protoimpl.UnsafeEnabled {
		mi := &file_block_txs_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Clock) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Clock) ProtoMessage() {}

func (x *Clock) ProtoReflect() protoreflect.Message {
	mi := &file_block_txs_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Clock.ProtoReflect.Descriptor instead.
func (*Clock) Descriptor() ([]byte, []int) {
	return file_block_txs_proto_rawDescGZIP(), []int{4}
}

func (x *Clock) GetNumber() uint64 {
	if x != nil {
		return x.Number
	}
	return 0
}

func (x *Clock) GetTimestamp() uint64 {
	if x != nil {
		return x.Timestamp
	}
	return 0
}

type Receipt struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Logs []*Log `protobuf:"bytes,1,rep,name=logs,proto3" json:"logs,omitempty"`
}

func (x *Receipt) Reset() {
	*x = Receipt{}
	if protoimpl.UnsafeEnabled {
		mi := &file_block_txs_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Receipt) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Receipt) ProtoMessage() {}

func (x *Receipt) ProtoReflect() protoreflect.Message {
	mi := &file_block_txs_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Receipt.ProtoReflect.Descriptor instead.
func (*Receipt) Descriptor() ([]byte, []int) {
	return file_block_txs_proto_rawDescGZIP(), []int{5}
}

func (x *Receipt) GetLogs() []*Log {
	if x != nil {
		return x.Logs
	}
	return nil
}

type Tx struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Calls   []*Call  `protobuf:"bytes,1,rep,name=calls,proto3" json:"calls,omitempty"`
	Info    *Info    `protobuf:"bytes,2,opt,name=info,proto3" json:"info,omitempty"`
	Clock   *Clock   `protobuf:"bytes,3,opt,name=clock,proto3" json:"clock,omitempty"`
	Receipt *Receipt `protobuf:"bytes,4,opt,name=receipt,proto3" json:"receipt,omitempty"`
}

func (x *Tx) Reset() {
	*x = Tx{}
	if protoimpl.UnsafeEnabled {
		mi := &file_block_txs_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Tx) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Tx) ProtoMessage() {}

func (x *Tx) ProtoReflect() protoreflect.Message {
	mi := &file_block_txs_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Tx.ProtoReflect.Descriptor instead.
func (*Tx) Descriptor() ([]byte, []int) {
	return file_block_txs_proto_rawDescGZIP(), []int{6}
}

func (x *Tx) GetCalls() []*Call {
	if x != nil {
		return x.Calls
	}
	return nil
}

func (x *Tx) GetInfo() *Info {
	if x != nil {
		return x.Info
	}
	return nil
}

func (x *Tx) GetClock() *Clock {
	if x != nil {
		return x.Clock
	}
	return nil
}

func (x *Tx) GetReceipt() *Receipt {
	if x != nil {
		return x.Receipt
	}
	return nil
}

var File_block_txs_proto protoreflect.FileDescriptor

var file_block_txs_proto_rawDesc = []byte{
	0x0a, 0x0f, 0x62, 0x6c, 0x6f, 0x63, 0x6b, 0x5f, 0x74, 0x78, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x12, 0x20, 0x74, 0x65, 0x72, 0x69, 0x74, 0x6f, 0x72, 0x69, 0x2e, 0x73, 0x75, 0x62, 0x73,
	0x74, 0x72, 0x65, 0x61, 0x6d, 0x73, 0x2e, 0x62, 0x6c, 0x6f, 0x63, 0x6b, 0x5f, 0x74, 0x78, 0x73,
	0x2e, 0x76, 0x31, 0x22, 0x42, 0x0a, 0x08, 0x42, 0x6c, 0x6f, 0x63, 0x6b, 0x54, 0x78, 0x73, 0x12,
	0x36, 0x0a, 0x03, 0x74, 0x78, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x24, 0x2e, 0x74,
	0x65, 0x72, 0x69, 0x74, 0x6f, 0x72, 0x69, 0x2e, 0x73, 0x75, 0x62, 0x73, 0x74, 0x72, 0x65, 0x61,
	0x6d, 0x73, 0x2e, 0x62, 0x6c, 0x6f, 0x63, 0x6b, 0x5f, 0x74, 0x78, 0x73, 0x2e, 0x76, 0x31, 0x2e,
	0x54, 0x78, 0x52, 0x03, 0x74, 0x78, 0x73, 0x22, 0x8b, 0x01, 0x0a, 0x04, 0x49, 0x6e, 0x66, 0x6f,
	0x12, 0x12, 0x0a, 0x04, 0x66, 0x72, 0x6f, 0x6d, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04,
	0x66, 0x72, 0x6f, 0x6d, 0x12, 0x0e, 0x0a, 0x02, 0x74, 0x6f, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x02, 0x74, 0x6f, 0x12, 0x12, 0x0a, 0x04, 0x68, 0x61, 0x73, 0x68, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x04, 0x68, 0x61, 0x73, 0x68, 0x12, 0x14, 0x0a, 0x05, 0x76, 0x61, 0x6c, 0x75,
	0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x12, 0x1f,
	0x0a, 0x0b, 0x72, 0x65, 0x74, 0x75, 0x72, 0x6e, 0x5f, 0x64, 0x61, 0x74, 0x61, 0x18, 0x05, 0x20,
	0x01, 0x28, 0x0c, 0x52, 0x0a, 0x72, 0x65, 0x74, 0x75, 0x72, 0x6e, 0x44, 0x61, 0x74, 0x61, 0x12,
	0x14, 0x0a, 0x05, 0x69, 0x6e, 0x70, 0x75, 0x74, 0x18, 0x06, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x05,
	0x69, 0x6e, 0x70, 0x75, 0x74, 0x22, 0x61, 0x0a, 0x03, 0x4c, 0x6f, 0x67, 0x12, 0x18, 0x0a, 0x07,
	0x61, 0x64, 0x64, 0x72, 0x65, 0x73, 0x73, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x61,
	0x64, 0x64, 0x72, 0x65, 0x73, 0x73, 0x12, 0x12, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x61, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x0c, 0x52, 0x04, 0x64, 0x61, 0x74, 0x61, 0x12, 0x14, 0x0a, 0x05, 0x69, 0x6e,
	0x64, 0x65, 0x78, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0d, 0x52, 0x05, 0x69, 0x6e, 0x64, 0x65, 0x78,
	0x12, 0x16, 0x0a, 0x06, 0x74, 0x6f, 0x70, 0x69, 0x63, 0x73, 0x18, 0x04, 0x20, 0x03, 0x28, 0x0c,
	0x52, 0x06, 0x74, 0x6f, 0x70, 0x69, 0x63, 0x73, 0x22, 0xc0, 0x01, 0x0a, 0x04, 0x43, 0x61, 0x6c,
	0x6c, 0x12, 0x16, 0x0a, 0x06, 0x63, 0x61, 0x6c, 0x6c, 0x65, 0x72, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x06, 0x63, 0x61, 0x6c, 0x6c, 0x65, 0x72, 0x12, 0x18, 0x0a, 0x07, 0x61, 0x64, 0x64,
	0x72, 0x65, 0x73, 0x73, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x61, 0x64, 0x64, 0x72,
	0x65, 0x73, 0x73, 0x12, 0x14, 0x0a, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x12, 0x1f, 0x0a, 0x0b, 0x72, 0x65, 0x74,
	0x75, 0x72, 0x6e, 0x5f, 0x64, 0x61, 0x74, 0x61, 0x18, 0x04, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x0a,
	0x72, 0x65, 0x74, 0x75, 0x72, 0x6e, 0x44, 0x61, 0x74, 0x61, 0x12, 0x14, 0x0a, 0x05, 0x69, 0x6e,
	0x70, 0x75, 0x74, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x05, 0x69, 0x6e, 0x70, 0x75, 0x74,
	0x12, 0x39, 0x0a, 0x04, 0x6c, 0x6f, 0x67, 0x73, 0x18, 0x06, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x25,
	0x2e, 0x74, 0x65, 0x72, 0x69, 0x74, 0x6f, 0x72, 0x69, 0x2e, 0x73, 0x75, 0x62, 0x73, 0x74, 0x72,
	0x65, 0x61, 0x6d, 0x73, 0x2e, 0x62, 0x6c, 0x6f, 0x63, 0x6b, 0x5f, 0x74, 0x78, 0x73, 0x2e, 0x76,
	0x31, 0x2e, 0x4c, 0x6f, 0x67, 0x52, 0x04, 0x6c, 0x6f, 0x67, 0x73, 0x22, 0x3d, 0x0a, 0x05, 0x43,
	0x6c, 0x6f, 0x63, 0x6b, 0x12, 0x16, 0x0a, 0x06, 0x6e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x04, 0x52, 0x06, 0x6e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x12, 0x1c, 0x0a, 0x09,
	0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x18, 0x03, 0x20, 0x01, 0x28, 0x04, 0x52,
	0x09, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x22, 0x44, 0x0a, 0x07, 0x52, 0x65,
	0x63, 0x65, 0x69, 0x70, 0x74, 0x12, 0x39, 0x0a, 0x04, 0x6c, 0x6f, 0x67, 0x73, 0x18, 0x01, 0x20,
	0x03, 0x28, 0x0b, 0x32, 0x25, 0x2e, 0x74, 0x65, 0x72, 0x69, 0x74, 0x6f, 0x72, 0x69, 0x2e, 0x73,
	0x75, 0x62, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x73, 0x2e, 0x62, 0x6c, 0x6f, 0x63, 0x6b, 0x5f,
	0x74, 0x78, 0x73, 0x2e, 0x76, 0x31, 0x2e, 0x4c, 0x6f, 0x67, 0x52, 0x04, 0x6c, 0x6f, 0x67, 0x73,
	0x22, 0x82, 0x02, 0x0a, 0x02, 0x54, 0x78, 0x12, 0x3c, 0x0a, 0x05, 0x63, 0x61, 0x6c, 0x6c, 0x73,
	0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x26, 0x2e, 0x74, 0x65, 0x72, 0x69, 0x74, 0x6f, 0x72,
	0x69, 0x2e, 0x73, 0x75, 0x62, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x73, 0x2e, 0x62, 0x6c, 0x6f,
	0x63, 0x6b, 0x5f, 0x74, 0x78, 0x73, 0x2e, 0x76, 0x31, 0x2e, 0x43, 0x61, 0x6c, 0x6c, 0x52, 0x05,
	0x63, 0x61, 0x6c, 0x6c, 0x73, 0x12, 0x3a, 0x0a, 0x04, 0x69, 0x6e, 0x66, 0x6f, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x0b, 0x32, 0x26, 0x2e, 0x74, 0x65, 0x72, 0x69, 0x74, 0x6f, 0x72, 0x69, 0x2e, 0x73,
	0x75, 0x62, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x73, 0x2e, 0x62, 0x6c, 0x6f, 0x63, 0x6b, 0x5f,
	0x74, 0x78, 0x73, 0x2e, 0x76, 0x31, 0x2e, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x04, 0x69, 0x6e, 0x66,
	0x6f, 0x12, 0x3d, 0x0a, 0x05, 0x63, 0x6c, 0x6f, 0x63, 0x6b, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x27, 0x2e, 0x74, 0x65, 0x72, 0x69, 0x74, 0x6f, 0x72, 0x69, 0x2e, 0x73, 0x75, 0x62, 0x73,
	0x74, 0x72, 0x65, 0x61, 0x6d, 0x73, 0x2e, 0x62, 0x6c, 0x6f, 0x63, 0x6b, 0x5f, 0x74, 0x78, 0x73,
	0x2e, 0x76, 0x31, 0x2e, 0x43, 0x6c, 0x6f, 0x63, 0x6b, 0x52, 0x05, 0x63, 0x6c, 0x6f, 0x63, 0x6b,
	0x12, 0x43, 0x0a, 0x07, 0x72, 0x65, 0x63, 0x65, 0x69, 0x70, 0x74, 0x18, 0x04, 0x20, 0x01, 0x28,
	0x0b, 0x32, 0x29, 0x2e, 0x74, 0x65, 0x72, 0x69, 0x74, 0x6f, 0x72, 0x69, 0x2e, 0x73, 0x75, 0x62,
	0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x73, 0x2e, 0x62, 0x6c, 0x6f, 0x63, 0x6b, 0x5f, 0x74, 0x78,
	0x73, 0x2e, 0x76, 0x31, 0x2e, 0x52, 0x65, 0x63, 0x65, 0x69, 0x70, 0x74, 0x52, 0x07, 0x72, 0x65,
	0x63, 0x65, 0x69, 0x70, 0x74, 0x42, 0x09, 0x5a, 0x07, 0x2e, 0x2f, 0x70, 0x62, 0x3b, 0x70, 0x62,
	0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_block_txs_proto_rawDescOnce sync.Once
	file_block_txs_proto_rawDescData = file_block_txs_proto_rawDesc
)

func file_block_txs_proto_rawDescGZIP() []byte {
	file_block_txs_proto_rawDescOnce.Do(func() {
		file_block_txs_proto_rawDescData = protoimpl.X.CompressGZIP(file_block_txs_proto_rawDescData)
	})
	return file_block_txs_proto_rawDescData
}

var file_block_txs_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_block_txs_proto_goTypes = []interface{}{
	(*BlockTxs)(nil), // 0: teritori.substreams.block_txs.v1.BlockTxs
	(*Info)(nil),     // 1: teritori.substreams.block_txs.v1.Info
	(*Log)(nil),      // 2: teritori.substreams.block_txs.v1.Log
	(*Call)(nil),     // 3: teritori.substreams.block_txs.v1.Call
	(*Clock)(nil),    // 4: teritori.substreams.block_txs.v1.Clock
	(*Receipt)(nil),  // 5: teritori.substreams.block_txs.v1.Receipt
	(*Tx)(nil),       // 6: teritori.substreams.block_txs.v1.Tx
}
var file_block_txs_proto_depIdxs = []int32{
	6, // 0: teritori.substreams.block_txs.v1.BlockTxs.txs:type_name -> teritori.substreams.block_txs.v1.Tx
	2, // 1: teritori.substreams.block_txs.v1.Call.logs:type_name -> teritori.substreams.block_txs.v1.Log
	2, // 2: teritori.substreams.block_txs.v1.Receipt.logs:type_name -> teritori.substreams.block_txs.v1.Log
	3, // 3: teritori.substreams.block_txs.v1.Tx.calls:type_name -> teritori.substreams.block_txs.v1.Call
	1, // 4: teritori.substreams.block_txs.v1.Tx.info:type_name -> teritori.substreams.block_txs.v1.Info
	4, // 5: teritori.substreams.block_txs.v1.Tx.clock:type_name -> teritori.substreams.block_txs.v1.Clock
	5, // 6: teritori.substreams.block_txs.v1.Tx.receipt:type_name -> teritori.substreams.block_txs.v1.Receipt
	7, // [7:7] is the sub-list for method output_type
	7, // [7:7] is the sub-list for method input_type
	7, // [7:7] is the sub-list for extension type_name
	7, // [7:7] is the sub-list for extension extendee
	0, // [0:7] is the sub-list for field type_name
}

func init() { file_block_txs_proto_init() }
func file_block_txs_proto_init() {
	if File_block_txs_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_block_txs_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*BlockTxs); i {
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
		file_block_txs_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Info); i {
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
		file_block_txs_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Log); i {
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
		file_block_txs_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Call); i {
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
		file_block_txs_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Clock); i {
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
		file_block_txs_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Receipt); i {
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
		file_block_txs_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Tx); i {
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
			RawDescriptor: file_block_txs_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_block_txs_proto_goTypes,
		DependencyIndexes: file_block_txs_proto_depIdxs,
		MessageInfos:      file_block_txs_proto_msgTypes,
	}.Build()
	File_block_txs_proto = out.File
	file_block_txs_proto_rawDesc = nil
	file_block_txs_proto_goTypes = nil
	file_block_txs_proto_depIdxs = nil
}

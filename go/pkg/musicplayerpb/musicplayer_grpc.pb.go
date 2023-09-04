// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             (unknown)
// source: musicplayer/v1/musicplayer.proto

package musicplayerpb

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// MusicplayerServiceClient is the client API for MusicplayerService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type MusicplayerServiceClient interface {
	GetAllAlbumList(ctx context.Context, in *GetAllAlbumListRequest, opts ...grpc.CallOption) (*GetAllAlbumListResponse, error)
	GetUserAlbumList(ctx context.Context, in *GetUserAlbumListRequest, opts ...grpc.CallOption) (*GetUserAlbumListResponse, error)
	GetAlbum(ctx context.Context, in *GetAlbumRequest, opts ...grpc.CallOption) (*GetAlbumResponse, error)
	GetAlbumIdListForLibrary(ctx context.Context, in *GetAlbumIdListForLibraryRequest, opts ...grpc.CallOption) (*GetAlbumIdListForLibraryResponse, error)
	GetOtherAlbumList(ctx context.Context, in *GetOtherAlbumListRequest, opts ...grpc.CallOption) (*GetOtherAlbumListResponse, error)
}

type musicplayerServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewMusicplayerServiceClient(cc grpc.ClientConnInterface) MusicplayerServiceClient {
	return &musicplayerServiceClient{cc}
}

func (c *musicplayerServiceClient) GetAllAlbumList(ctx context.Context, in *GetAllAlbumListRequest, opts ...grpc.CallOption) (*GetAllAlbumListResponse, error) {
	out := new(GetAllAlbumListResponse)
	err := c.cc.Invoke(ctx, "/musicplayer.v1.MusicplayerService/GetAllAlbumList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *musicplayerServiceClient) GetUserAlbumList(ctx context.Context, in *GetUserAlbumListRequest, opts ...grpc.CallOption) (*GetUserAlbumListResponse, error) {
	out := new(GetUserAlbumListResponse)
	err := c.cc.Invoke(ctx, "/musicplayer.v1.MusicplayerService/GetUserAlbumList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *musicplayerServiceClient) GetAlbum(ctx context.Context, in *GetAlbumRequest, opts ...grpc.CallOption) (*GetAlbumResponse, error) {
	out := new(GetAlbumResponse)
	err := c.cc.Invoke(ctx, "/musicplayer.v1.MusicplayerService/GetAlbum", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *musicplayerServiceClient) GetAlbumIdListForLibrary(ctx context.Context, in *GetAlbumIdListForLibraryRequest, opts ...grpc.CallOption) (*GetAlbumIdListForLibraryResponse, error) {
	out := new(GetAlbumIdListForLibraryResponse)
	err := c.cc.Invoke(ctx, "/musicplayer.v1.MusicplayerService/GetAlbumIdListForLibrary", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *musicplayerServiceClient) GetOtherAlbumList(ctx context.Context, in *GetOtherAlbumListRequest, opts ...grpc.CallOption) (*GetOtherAlbumListResponse, error) {
	out := new(GetOtherAlbumListResponse)
	err := c.cc.Invoke(ctx, "/musicplayer.v1.MusicplayerService/GetOtherAlbumList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// MusicplayerServiceServer is the server API for MusicplayerService service.
// All implementations must embed UnimplementedMusicplayerServiceServer
// for forward compatibility
type MusicplayerServiceServer interface {
	GetAllAlbumList(context.Context, *GetAllAlbumListRequest) (*GetAllAlbumListResponse, error)
	GetUserAlbumList(context.Context, *GetUserAlbumListRequest) (*GetUserAlbumListResponse, error)
	GetAlbum(context.Context, *GetAlbumRequest) (*GetAlbumResponse, error)
	GetAlbumIdListForLibrary(context.Context, *GetAlbumIdListForLibraryRequest) (*GetAlbumIdListForLibraryResponse, error)
	GetOtherAlbumList(context.Context, *GetOtherAlbumListRequest) (*GetOtherAlbumListResponse, error)
	mustEmbedUnimplementedMusicplayerServiceServer()
}

// UnimplementedMusicplayerServiceServer must be embedded to have forward compatible implementations.
type UnimplementedMusicplayerServiceServer struct {
}

func (UnimplementedMusicplayerServiceServer) GetAllAlbumList(context.Context, *GetAllAlbumListRequest) (*GetAllAlbumListResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAllAlbumList not implemented")
}
func (UnimplementedMusicplayerServiceServer) GetUserAlbumList(context.Context, *GetUserAlbumListRequest) (*GetUserAlbumListResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetUserAlbumList not implemented")
}
func (UnimplementedMusicplayerServiceServer) GetAlbum(context.Context, *GetAlbumRequest) (*GetAlbumResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAlbum not implemented")
}
func (UnimplementedMusicplayerServiceServer) GetAlbumIdListForLibrary(context.Context, *GetAlbumIdListForLibraryRequest) (*GetAlbumIdListForLibraryResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAlbumIdListForLibrary not implemented")
}
func (UnimplementedMusicplayerServiceServer) GetOtherAlbumList(context.Context, *GetOtherAlbumListRequest) (*GetOtherAlbumListResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetOtherAlbumList not implemented")
}
func (UnimplementedMusicplayerServiceServer) mustEmbedUnimplementedMusicplayerServiceServer() {}

// UnsafeMusicplayerServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to MusicplayerServiceServer will
// result in compilation errors.
type UnsafeMusicplayerServiceServer interface {
	mustEmbedUnimplementedMusicplayerServiceServer()
}

func RegisterMusicplayerServiceServer(s grpc.ServiceRegistrar, srv MusicplayerServiceServer) {
	s.RegisterService(&MusicplayerService_ServiceDesc, srv)
}

func _MusicplayerService_GetAllAlbumList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAllAlbumListRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MusicplayerServiceServer).GetAllAlbumList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/musicplayer.v1.MusicplayerService/GetAllAlbumList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MusicplayerServiceServer).GetAllAlbumList(ctx, req.(*GetAllAlbumListRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MusicplayerService_GetUserAlbumList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetUserAlbumListRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MusicplayerServiceServer).GetUserAlbumList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/musicplayer.v1.MusicplayerService/GetUserAlbumList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MusicplayerServiceServer).GetUserAlbumList(ctx, req.(*GetUserAlbumListRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MusicplayerService_GetAlbum_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAlbumRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MusicplayerServiceServer).GetAlbum(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/musicplayer.v1.MusicplayerService/GetAlbum",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MusicplayerServiceServer).GetAlbum(ctx, req.(*GetAlbumRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MusicplayerService_GetAlbumIdListForLibrary_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAlbumIdListForLibraryRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MusicplayerServiceServer).GetAlbumIdListForLibrary(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/musicplayer.v1.MusicplayerService/GetAlbumIdListForLibrary",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MusicplayerServiceServer).GetAlbumIdListForLibrary(ctx, req.(*GetAlbumIdListForLibraryRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MusicplayerService_GetOtherAlbumList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetOtherAlbumListRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MusicplayerServiceServer).GetOtherAlbumList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/musicplayer.v1.MusicplayerService/GetOtherAlbumList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MusicplayerServiceServer).GetOtherAlbumList(ctx, req.(*GetOtherAlbumListRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// MusicplayerService_ServiceDesc is the grpc.ServiceDesc for MusicplayerService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var MusicplayerService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "musicplayer.v1.MusicplayerService",
	HandlerType: (*MusicplayerServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetAllAlbumList",
			Handler:    _MusicplayerService_GetAllAlbumList_Handler,
		},
		{
			MethodName: "GetUserAlbumList",
			Handler:    _MusicplayerService_GetUserAlbumList_Handler,
		},
		{
			MethodName: "GetAlbum",
			Handler:    _MusicplayerService_GetAlbum_Handler,
		},
		{
			MethodName: "GetAlbumIdListForLibrary",
			Handler:    _MusicplayerService_GetAlbumIdListForLibrary_Handler,
		},
		{
			MethodName: "GetOtherAlbumList",
			Handler:    _MusicplayerService_GetOtherAlbumList_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "musicplayer/v1/musicplayer.proto",
}

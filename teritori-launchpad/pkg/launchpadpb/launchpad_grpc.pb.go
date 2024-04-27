// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             (unknown)
// source: launchpad/v1/launchpad.proto

package launchpadpb

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

// LaunchpadServiceClient is the client API for LaunchpadService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type LaunchpadServiceClient interface {
	UploadMetadatas(ctx context.Context, in *UploadMetadatasRequest, opts ...grpc.CallOption) (*UploadMetadatasResponse, error)
	UploadMetadata(ctx context.Context, in *UploadMetadataRequest, opts ...grpc.CallOption) (*UploadMetadataResponse, error)
	CalculateCollectionMerkleRoot(ctx context.Context, in *CalculateCollectionMerkleRootRequest, opts ...grpc.CallOption) (*CalculateCollectionMerkleRootResponse, error)
	TokenMetadata(ctx context.Context, in *TokenMetadataRequest, opts ...grpc.CallOption) (*TokenMetadataResponse, error)
}

type launchpadServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewLaunchpadServiceClient(cc grpc.ClientConnInterface) LaunchpadServiceClient {
	return &launchpadServiceClient{cc}
}

func (c *launchpadServiceClient) UploadMetadatas(ctx context.Context, in *UploadMetadatasRequest, opts ...grpc.CallOption) (*UploadMetadatasResponse, error) {
	out := new(UploadMetadatasResponse)
	err := c.cc.Invoke(ctx, "/launchpad.v1.LaunchpadService/UploadMetadatas", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *launchpadServiceClient) UploadMetadata(ctx context.Context, in *UploadMetadataRequest, opts ...grpc.CallOption) (*UploadMetadataResponse, error) {
	out := new(UploadMetadataResponse)
	err := c.cc.Invoke(ctx, "/launchpad.v1.LaunchpadService/UploadMetadata", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *launchpadServiceClient) CalculateCollectionMerkleRoot(ctx context.Context, in *CalculateCollectionMerkleRootRequest, opts ...grpc.CallOption) (*CalculateCollectionMerkleRootResponse, error) {
	out := new(CalculateCollectionMerkleRootResponse)
	err := c.cc.Invoke(ctx, "/launchpad.v1.LaunchpadService/CalculateCollectionMerkleRoot", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *launchpadServiceClient) TokenMetadata(ctx context.Context, in *TokenMetadataRequest, opts ...grpc.CallOption) (*TokenMetadataResponse, error) {
	out := new(TokenMetadataResponse)
	err := c.cc.Invoke(ctx, "/launchpad.v1.LaunchpadService/TokenMetadata", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// LaunchpadServiceServer is the server API for LaunchpadService service.
// All implementations must embed UnimplementedLaunchpadServiceServer
// for forward compatibility
type LaunchpadServiceServer interface {
	UploadMetadatas(context.Context, *UploadMetadatasRequest) (*UploadMetadatasResponse, error)
	UploadMetadata(context.Context, *UploadMetadataRequest) (*UploadMetadataResponse, error)
	CalculateCollectionMerkleRoot(context.Context, *CalculateCollectionMerkleRootRequest) (*CalculateCollectionMerkleRootResponse, error)
	TokenMetadata(context.Context, *TokenMetadataRequest) (*TokenMetadataResponse, error)
	mustEmbedUnimplementedLaunchpadServiceServer()
}

// UnimplementedLaunchpadServiceServer must be embedded to have forward compatible implementations.
type UnimplementedLaunchpadServiceServer struct {
}

func (UnimplementedLaunchpadServiceServer) UploadMetadatas(context.Context, *UploadMetadatasRequest) (*UploadMetadatasResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UploadMetadatas not implemented")
}
func (UnimplementedLaunchpadServiceServer) UploadMetadata(context.Context, *UploadMetadataRequest) (*UploadMetadataResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UploadMetadata not implemented")
}
func (UnimplementedLaunchpadServiceServer) CalculateCollectionMerkleRoot(context.Context, *CalculateCollectionMerkleRootRequest) (*CalculateCollectionMerkleRootResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CalculateCollectionMerkleRoot not implemented")
}
func (UnimplementedLaunchpadServiceServer) TokenMetadata(context.Context, *TokenMetadataRequest) (*TokenMetadataResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method TokenMetadata not implemented")
}
func (UnimplementedLaunchpadServiceServer) mustEmbedUnimplementedLaunchpadServiceServer() {}

// UnsafeLaunchpadServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to LaunchpadServiceServer will
// result in compilation errors.
type UnsafeLaunchpadServiceServer interface {
	mustEmbedUnimplementedLaunchpadServiceServer()
}

func RegisterLaunchpadServiceServer(s grpc.ServiceRegistrar, srv LaunchpadServiceServer) {
	s.RegisterService(&LaunchpadService_ServiceDesc, srv)
}

func _LaunchpadService_UploadMetadatas_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UploadMetadatasRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(LaunchpadServiceServer).UploadMetadatas(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/launchpad.v1.LaunchpadService/UploadMetadatas",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(LaunchpadServiceServer).UploadMetadatas(ctx, req.(*UploadMetadatasRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _LaunchpadService_UploadMetadata_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UploadMetadataRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(LaunchpadServiceServer).UploadMetadata(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/launchpad.v1.LaunchpadService/UploadMetadata",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(LaunchpadServiceServer).UploadMetadata(ctx, req.(*UploadMetadataRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _LaunchpadService_CalculateCollectionMerkleRoot_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CalculateCollectionMerkleRootRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(LaunchpadServiceServer).CalculateCollectionMerkleRoot(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/launchpad.v1.LaunchpadService/CalculateCollectionMerkleRoot",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(LaunchpadServiceServer).CalculateCollectionMerkleRoot(ctx, req.(*CalculateCollectionMerkleRootRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _LaunchpadService_TokenMetadata_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(TokenMetadataRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(LaunchpadServiceServer).TokenMetadata(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/launchpad.v1.LaunchpadService/TokenMetadata",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(LaunchpadServiceServer).TokenMetadata(ctx, req.(*TokenMetadataRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// LaunchpadService_ServiceDesc is the grpc.ServiceDesc for LaunchpadService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var LaunchpadService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "launchpad.v1.LaunchpadService",
	HandlerType: (*LaunchpadServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "UploadMetadatas",
			Handler:    _LaunchpadService_UploadMetadatas_Handler,
		},
		{
			MethodName: "UploadMetadata",
			Handler:    _LaunchpadService_UploadMetadata_Handler,
		},
		{
			MethodName: "CalculateCollectionMerkleRoot",
			Handler:    _LaunchpadService_CalculateCollectionMerkleRoot_Handler,
		},
		{
			MethodName: "TokenMetadata",
			Handler:    _LaunchpadService_TokenMetadata_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "launchpad/v1/launchpad.proto",
}

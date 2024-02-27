package grpckeycloak

import (
	"context"

	"github.com/Nerzal/gocloak/v13"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

type GRPCKeycloakMiddleware struct {
	keycloak *gocloak.GoCloak
	logger   *zap.Logger
}

func NewGRPCKeycloakMiddleware(url string, logger *zap.Logger) *GRPCKeycloakMiddleware {
	keycloak := gocloak.NewClient(url)
	if logger == nil {
		logger = zap.NewNop()
	}
	return &GRPCKeycloakMiddleware{
		keycloak: keycloak,
		logger:   logger,
	}
}

type keycloakRawUserInfoKeyType struct{}

var keycloakRawUserInfoKey = &keycloakRawUserInfoKeyType{}

func UserInfoFromContext(ctx context.Context) (map[string]interface{}, bool) {
	userInfo, ok := ctx.Value(keycloakRawUserInfoKey).(map[string]interface{})
	return userInfo, ok
}

func (m *GRPCKeycloakMiddleware) UnaryServerInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		m.logger.Error("missing metadata")
		return handler(ctx, req)
	}
	token := md["authorization"]
	if len(token) != 1 {
		m.logger.Error("missing authorization token")
		return handler(ctx, req)
	}
	userInfo, err := m.keycloak.GetRawUserInfo(context.TODO(), token[0], "master")
	if err != nil {
		m.logger.Error("failed to get raw user info", zap.Error(err))
		return handler(ctx, req)
	}
	ctx = context.WithValue(ctx, keycloakRawUserInfoKey, userInfo)
	return handler(ctx, req)
}

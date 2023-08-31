package pathwar

import (
	"context"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/pathwarpb"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type PathwarService struct {
	pathwarpb.UnimplementedPathwarServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
	NetStore  *networks.NetworkStore
}

func NewPathwarService(ctx context.Context, conf *Config) pathwarpb.PathwarServiceServer {
	return &PathwarService{
		conf: conf,
	}
}

func (s *PathwarService) ChallengeValidate(ctx context.Context, req *pathwarpb.ChallengeValidateRequest) (*pathwarpb.ChallengeValidateResponse, error) {

	networkId := req.GetNetworkId()
	println(req.Passphrase)

	if req.Passphrase != "valid" {
		return nil, nil
	}

	return &pathwarpb.ChallengeValidateResponse{
		Msg:       "msg",
		Sig:       "oeu",
		Key:       "qjk",
		NetworkId: networkId,
	}, nil
}

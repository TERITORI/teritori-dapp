package dao

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/daopb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type DAOService struct {
	daopb.UnimplementedDAOServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
	NetStore  *networks.NetworkStore
}

func NewDAOService(ctx context.Context, conf *Config) daopb.DAOServiceServer {
	return &DAOService{
		conf: conf,
	}
}

func (s *DAOService) DAOs(ctx context.Context, req *daopb.DAOsRequest) (*daopb.DAOsResponse, error) {
	db := s.conf.IndexerDB

	memberAddress := req.GetMemberAddress()
	if memberAddress != "" {
		db = db.Joins("JOIN dao_members ON dao_members.dao_network_id = daos.network_id AND dao_members.dao_contract_address = daos.contract_address AND dao_members.member_address = ?", memberAddress)
	}

	networkId := req.GetNetworkId()
	if networkId != "" {
		db = db.Where("daos.network_id = ?", networkId)
	}

	var daos []*indexerdb.DAO
	err := db.Find(&daos).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	pbdaos := make([]*daopb.DAO, len(daos))
	for i, d := range daos {
		network, err := s.conf.NetStore.GetNetwork(d.NetworkID)
		if err != nil {
			s.conf.Logger.Error("failed to get network for dao", zap.String("dao-address", d.ContractAddress), zap.Error(err))
			continue
		}

		pbdaos[i] = &daopb.DAO{
			Id:                string(network.GetBase().UserID(d.ContractAddress)),
			Admin:             d.Admin,
			ContractAddress:   d.ContractAddress,
			Name:              d.Name,
			Description:       d.Description,
			ImageUrl:          d.ImageUrl,
			Quorum:            d.Quorum,
			Threshold:         d.Threshold,
			TokenName:         d.TokenName,
			TokenSymbol:       d.TokenSymbol,
			UnstakingDuration: uint64(d.UnstakingDuration), // FIXME: use same type in db
		}
	}

	return &daopb.DAOsResponse{
		Daos: pbdaos,
	}, nil
}

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

// Control if sender is member of the admin DAO
func (s *DAOService) IsUserLaunchpadAdmin(ctx context.Context, req *daopb.IsUserLaunchpadAdminRequest) (*daopb.IsUserLaunchpadAdminResponse, error) {
	userAddress := req.GetUserAddress()
	daoAdminAddress := "tori129kpfu7krgumuc38hfyxwfluq7eu06rhr3awcztr3a9cgjjcx5hswlqj8v"
	var isUserAuthorized bool
	err := s.conf.IndexerDB.Raw(`SELECT EXISTS (
        SELECT 1
        FROM dao_members dm
        JOIN daos d ON dm.dao_contract_address = d.contract_address
        WHERE d.contract_address = ?
        AND dm.member_address = ?
    ) AS dao_exists;`,
		daoAdminAddress,
		userAddress,
	).Scan(&isUserAuthorized).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}

	return &daopb.IsUserLaunchpadAdminResponse{
		IsUserAdmin: isUserAuthorized,
	}, nil
}

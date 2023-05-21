package dao

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/daopb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type DaoService struct {
	daopb.UnimplementedDaoServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewDaoService(ctx context.Context, conf *Config) daopb.DaoServiceServer {
	return &DaoService{
		conf: conf,
	}
}

func (s *DaoService) DaoList(ctx context.Context, req *daopb.DaoListRequest) (*daopb.DaoListResponse, error) {
	var daos []*indexerdb.Dao
	db := s.conf.IndexerDB
	memberAddress := req.GetMemberAddress()
	if memberAddress != "" {
		db = db.Joins("JOIN dao_members ON dao_members.dao_network_id = daos.network_id AND dao_members.dao_contract_address = daos.contract_address AND dao_members.member_address = ?", memberAddress)
	}
	err := db.Find(&daos).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	pbdaos := make([]*daopb.DaoInfo, len(daos))
	for i, d := range daos {
		pbdaos[i] = &daopb.DaoInfo{
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
	return &daopb.DaoListResponse{
		Daos: pbdaos,
	}, nil
}

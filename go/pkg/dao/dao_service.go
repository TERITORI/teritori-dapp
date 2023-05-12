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
	var daos []*daopb.DaoInfo
	err := s.conf.IndexerDB.Model(&indexerdb.Dao{}).Order("id Desc").Scan(&daos).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &daopb.DaoListResponse{
		Daos: daos,
	}, nil
}

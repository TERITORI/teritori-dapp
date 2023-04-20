package dao

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/daopb"
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
	s.conf.IndexerDB.Model(&indexerdb.Dao{}).Order("id Desc").Scan(&daos)
	return &daopb.DaoListResponse{
		Daos: daos,
	}, nil
}

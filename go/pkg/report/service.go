package report

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/reportpb"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type ReportService struct {
	reportpb.UnimplementedReportServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewReportService(ctx context.Context, conf *Config) reportpb.ReportServiceServer {
	// FIXME: validate config
	return &ReportService{
		conf: conf,
	}
}

func (s *ReportService) Report(req *reportpb.ReportRequest, srv reportpb.ReportService_ReportServer) error {
	desc := req.Desc
	ref_url := req.RefUrl
	s.conf.IndexerDB.Create(&indexerdb.Report{
		Desc:   desc,
		RefUrl: ref_url,
	})
	srv.Send(&reportpb.ReportResponse{
		Result: 0,
	})
	return nil
}

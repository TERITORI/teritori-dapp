package launchpad

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Launchpad struct {
	launchpadpb.UnimplementedLaunchpadServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewLaunchpadService(ctx context.Context, conf *Config) launchpadpb.LaunchpadServiceServer {
	// FIXME: validate config
	return &Launchpad{
		conf: conf,
	}
}

func (s *Launchpad) UploadMetadata(ctx context.Context, req *launchpadpb.UploadMetadataRequest) (*launchpadpb.UploadMetadataResponse, error) {
	nftMetadatas := []indexerdb.LaunchpadNftMetadata{}

	for idx, metadata := range req.Metadatas {
		metadataJson := indexerdb.ObjectJSONB{}
		if err := metadataJson.Scan(metadata); err != nil {
			return nil, errors.Wrap(err, "failed to convert metadata to json")
		}

		nftMetadatas = append(nftMetadatas, indexerdb.LaunchpadNftMetadata{
			ProjectID: req.ProjectId,
			NetworkID: req.NetworkId,
			NftIdx:    uint32(idx) + 1,
			Metadata:  metadataJson,
		})
	}

	if err := s.conf.IndexerDB.Create(nftMetadatas).Error; err != nil {
		return nil, errors.Wrap(err, "failed to save nfts metadatas")
	}

	return &launchpadpb.UploadMetadataResponse{Result: true}, nil
}

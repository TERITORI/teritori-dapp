package launchpad

import (
	"context"
	"encoding/json"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/datatypes"
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

func (s *Launchpad) getMerkleRoot(metadatas []*launchpadpb.Metadata) (string, error) {
	// Create merkle tree
	leaves := make([]merkletree.Content, len(metadatas))

	i := 0
	for _, data := range metadatas {
		leaves[i] = NewMetadataFromPb(data)
		i++
	}

	// NOTE: Don't sort leaves to keep the same order of uploaded file
	tree, err := merkletree.New(leaves, false)
	if err != nil {
		return "", errors.Wrap(err, "failed to created merkle tree")
	}

	// Remove 0x at first position because rust does not have that 0x
	hex_root := tree.GetHexRoot()[2:]
	return hex_root, nil
}

func (s *Launchpad) CalculateMerkleRoot(ctx context.Context, req *launchpadpb.CalculateMerkleRootRequest) (*launchpadpb.CalculateMerkleRootResponse, error) {
	hex_root, err := s.getMerkleRoot(req.Metadatas)
	if err != nil {
		return nil, errors.Wrap(err, "failed to calculate merkle root")
	}

	return &launchpadpb.CalculateMerkleRootResponse{MerkleRoot: hex_root}, nil
}

func (s *Launchpad) UploadMetadata(ctx context.Context, req *launchpadpb.UploadMetadataRequest) (*launchpadpb.UploadMetadataResponse, error) {
	nftMetadatas := []indexerdb.LaunchpadNftMetadata{}

	for idx, metadata := range req.Metadatas {
		metadataJson, err := json.Marshal(metadata)
		if err != nil {
			return nil, errors.Wrap(err, "failed to marshal metadata to json")
		}

		nftMetadatas = append(nftMetadatas, indexerdb.LaunchpadNftMetadata{
			ProjectID: req.ProjectId,
			NetworkID: req.NetworkId,
			NftIdx:    uint32(idx) + 1,
			Metadata:  datatypes.JSON([]byte(metadataJson)),
		})
	}

	if err := s.conf.IndexerDB.Create(nftMetadatas).Error; err != nil {
		return nil, errors.Wrap(err, "failed to save nfts metadatas")
	}

	hex_root, err := s.getMerkleRoot(req.Metadatas)
	if err != nil {
		return nil, errors.Wrap(err, "failed to calculate merkle root")
	}

	return &launchpadpb.UploadMetadataResponse{MerkleRoot: hex_root}, nil
}

package launchpad

import (
	"context"
	"encoding/json"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
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

func (s *Launchpad) UpdateCollectionMetadatas(ctx context.Context, req *launchpadpb.UpdateCollectionMetadatasRequest) (*launchpadpb.UpdateCollectionMetadatasResponse, error) {
	if err := s.verifySender(req.Sender); err != nil {
		return nil, errors.Wrap(err, "failed to verify sender")
	}

	tokenMetadatas := []indexerdb.LaunchpadMetadata{}

	for idx, metadata := range req.Metadatas {
		metadataJson, err := json.Marshal(metadata)
		if err != nil {
			return nil, errors.Wrap(err, "failed to marshal metadata to json")
		}

		tokenMetadatas = append(tokenMetadatas, indexerdb.LaunchpadMetadata{
			ProjectID: req.ProjectId,
			NetworkID: req.NetworkId,
			TokenID:   uint32(idx) + 1,
			Metadata:  datatypes.JSON([]byte(metadataJson)),
		})
	}

	if err := s.conf.IndexerDB.Create(tokenMetadatas).Error; err != nil {
		return nil, errors.Wrap(err, "failed to save token metadatas")
	}

	tree, err := s.buildCollectionMerkleTree(req.Metadatas)
	if err != nil {
		return nil, errors.Wrap(err, "failed to calculate merkle root")
	}
	// Remove 0x at first position because rust does not have that 0x
	hex_root := tree.GetHexRootWithoutPrefix()

	return &launchpadpb.UpdateCollectionMetadatasResponse{MerkleRoot: hex_root}, nil
}

func (s *Launchpad) CalculateCollectionMerkleRoot(ctx context.Context, req *launchpadpb.CalculateCollectionMerkleRootRequest) (*launchpadpb.CalculateCollectionMerkleRootResponse, error) {
	if err := s.verifySender(req.Sender); err != nil {
		return nil, errors.Wrap(err, "failed to verify sender")
	}

	tree, err := s.buildCollectionMerkleTree(req.Metadatas)
	if err != nil {
		return nil, errors.Wrap(err, "failed to calculate merkle root")
	}
	// Remove 0x at first position because rust does not have that 0x
	hex_root := tree.GetHexRootWithoutPrefix()

	return &launchpadpb.CalculateCollectionMerkleRootResponse{MerkleRoot: hex_root}, nil
}

func (s *Launchpad) UpdateCollectionWhitelists(ctx context.Context, req *launchpadpb.UpdateCollectionWhitelistsRequest) (*launchpadpb.UpdateCollectionWhitelistsResponse, error) {
	if err := s.verifySender(req.Sender); err != nil {
		return nil, errors.Wrap(err, "failed to verify sender")
	}

	var whitelistInfos []indexerdb.LaunchpadWhitelist
	var roots []string

	for id, info := range req.WhitelistMintInfos {
		infoJson, err := json.Marshal(info)
		if err != nil {
			return nil, errors.Wrap(err, "failed to marshal data to json")
		}

		// Calculate merkle root
		tree, err := s.buildWhitelistMerkleTree(info.Addresses)
		if err != nil {
			return nil, errors.Wrap(err, "failed to build merkle tree for whitelist addresses")
		}

		root := tree.GetHexRootWithoutPrefix()
		roots = append(roots, root)

		whitelistInfos = append(whitelistInfos, indexerdb.LaunchpadWhitelist{
			NetworkID:   req.NetworkId,
			ProjectID:   req.ProjectId,
			WhitelistID: uint32(id),
			MerkleRoot:  root,
			Data:        datatypes.JSON([]byte(infoJson)),
		})
	}

	if err := s.conf.IndexerDB.Create(whitelistInfos).Error; err != nil {
		return nil, errors.Wrap(err, "failed to save whitelist infos")
	}

	return &launchpadpb.UpdateCollectionWhitelistsResponse{MerkleRoots: roots}, nil
}

func (s *Launchpad) TokenMetadata(ctx context.Context, req *launchpadpb.TokenMetadataRequest) (*launchpadpb.TokenMetadataResponse, error) {
	if err := s.verifySender(req.Sender); err != nil {
		return nil, errors.Wrap(err, "failed to verify sender")
	}

	tokens := indexerdb.LaunchpadToken{NetworkID: req.NetworkId, ProjectID: req.ProjectId}
	if err := s.conf.IndexerDB.Scan(&token).Error; err != nil {
		return nil, errors.Wrap(err, "failed to get token")
	}

	var metadata launchpadpb.Metadata

	if err := json.Unmarshal(token.Metadata, &metadata); err != nil {
		return nil, errors.Wrap(err, "failed to parse metadata")
	}

	tree := s.buildCollectionMerkleTree(metadata)

	return &launchpadpb.TokenMetadataResponse{Metadata: hex_root, MerkleRoot: "root"}, nil
}

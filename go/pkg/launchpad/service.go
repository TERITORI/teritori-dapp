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

// Upload collection metadatas and generate corresponding merkle root
// This will delete all existing tokens metadatas and replace by new ones
func (s *Launchpad) UpdateTokensMetadatas(ctx context.Context, req *launchpadpb.UpdateTokensMetadatasRequest) (*launchpadpb.UpdateTokensMetadatasResponse, error) {
	if err := s.verifySender(req.Sender); err != nil {
		return nil, errors.Wrap(err, "failed to verify sender")
	}

	// At this step, LaunchpadProject has to be created by indexer when collection has been submitted on-chain
	project := indexerdb.LaunchpadProject{
		ProjectID: req.ProjectId,
		NetworkID: req.NetworkId,
	}

	if err := s.conf.IndexerDB.First(&project).Error; err != nil {
		return nil, errors.Wrap(err, "failed to get the requested project")
	}

	var hex_root string

	if err := s.conf.IndexerDB.Transaction(func(tx *gorm.DB) error {
		// Delete all existing tokens metadatas
		if err := s.conf.IndexerDB.Delete(&indexerdb.LaunchpadToken{}, "network_id = ? AND project_id = ?", req.NetworkId, req.ProjectId).Error; err != nil {
			return errors.Wrap(err, "failed to flush existing metatadas")
		}

		tokenMetadatas := []indexerdb.LaunchpadToken{}

		for idx, metadata := range req.Metadatas {
			metadataJson, err := json.Marshal(metadata)
			if err != nil {
				return errors.Wrap(err, "failed to marshal metadata to json")
			}

			tokenMetadatas = append(tokenMetadatas, indexerdb.LaunchpadToken{
				ProjectID: req.ProjectId,
				NetworkID: req.NetworkId,
				TokenID:   uint32(idx) + 1,
				Metadata:  datatypes.JSON([]byte(metadataJson)),
			})
		}

		if err := s.conf.IndexerDB.Create(tokenMetadatas).Error; err != nil {
			return errors.Wrap(err, "failed to save token metadatas")
		}

		tree, err := s.buildCollectionMerkleTree(req.Metadatas)
		if err != nil {
			return errors.Wrap(err, "failed to calculate merkle root")
		}
		hex_root = tree.GetHexRootWithoutPrefix()

		// At this step, LaunchpadProject has to be created by indexer when collection has been submitted on-chain
		project.MerkleRoot = hex_root

		if err := s.conf.IndexerDB.Save(&project).Error; err != nil {
			return errors.Wrap(err, "failed to update project merkle root")
		}

		return nil
	}); err != nil {
		return nil, errors.Wrap(err, "fail to process")
	}

	return &launchpadpb.UpdateTokensMetadatasResponse{MerkleRoot: hex_root}, nil
}

// Calculate collection merkle root
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

// Update collection whitelists and generate merkle root for each whitelist
// This will flush all existing whitelists and replace by new one
// UPDATE: normally we dont use this endpoint anymore as we will store addresses by ipfs so the frontend
// can calculate merkle tree/root/path without need of backend.
// But for now, we let is here just to keep the code in case where we need it later
// To re-activate this, please update the api proto
// func (s *Launchpad) UpdateCollectionWhitelists(ctx context.Context, req *launchpadpb.UpdateCollectionWhitelistsRequest) (*launchpadpb.UpdateCollectionWhitelistsResponse, error) {
// 	if err := s.verifySender(req.Sender); err != nil {
// 		return nil, errors.Wrap(err, "failed to verify sender")
// 	}

// 	var roots []string
// 	if err := s.conf.IndexerDB.Transaction(func(tx *gorm.DB) error {
// 		// Flush all existing whitelists
// 		if err := s.conf.IndexerDB.Delete(&indexerdb.LaunchpadWhitelist{}, "network_id = ? AND project_id = ?", req.NetworkId, req.ProjectId).Error; err != nil {
// 			return errors.Wrap(err, "failed to flush existing whitelists")
// 		}

// 		var whitelistInfos []indexerdb.LaunchpadWhitelist

// 		for id, info := range req.WhitelistMintInfos {
// 			infoJson, err := json.Marshal(info)
// 			if err != nil {
// 				return errors.Wrap(err, "failed to marshal data to json")
// 			}

// 			// Calculate merkle root
// 			tree, err := s.buildWhitelistMerkleTree(info.Addresses)
// 			if err != nil {
// 				return errors.Wrap(err, "failed to build merkle tree for whitelist addresses")
// 			}

// 			root := tree.GetHexRootWithoutPrefix()
// 			roots = append(roots, root)

// 			whitelistInfos = append(whitelistInfos, indexerdb.LaunchpadWhitelist{
// 				NetworkID:   req.NetworkId,
// 				ProjectID:   req.ProjectId,
// 				WhitelistID: uint32(id),
// 				MerkleRoot:  root,
// 				Data:        datatypes.JSON([]byte(infoJson)),
// 			})
// 		}

// 		if err := s.conf.IndexerDB.Create(whitelistInfos).Error; err != nil {
// 			return errors.Wrap(err, "failed to save whitelist infos")
// 		}
// 		return nil
// 	}); err != nil {
// 		return nil, errors.Wrap(err, "fail to process")
// 	}

// 	return &launchpadpb.UpdateCollectionWhitelistsResponse{MerkleRoots: roots}, nil
// }

// Get token metadata, merkle root, merke proof to be used for claiming the on-chain token
func (s *Launchpad) TokenMetadata(ctx context.Context, req *launchpadpb.TokenMetadataRequest) (*launchpadpb.TokenMetadataResponse, error) {
	if err := s.verifySender(req.Sender); err != nil {
		return nil, errors.Wrap(err, "failed to verify sender")
	}

	var tokens []indexerdb.LaunchpadToken
	if err := s.conf.IndexerDB.Find(&tokens, "network_id = ? AND project_id = ?", req.NetworkId, req.ProjectId).Error; err != nil {
		return nil, errors.Wrap(err, "failed to collection tokens to build merkle tree")
	}

	var metadatas []*launchpadpb.Metadata
	var tokenMetadata *launchpadpb.Metadata

	for id, token := range tokens {
		var metadata launchpadpb.Metadata
		if err := json.Unmarshal(token.Metadata, &metadata); err != nil {
			return nil, errors.Wrap(err, "failed to parse metadata")
		}
		metadatas = append(metadatas, &metadata)

		if id == int(req.TokenId) {
			tokenMetadata = &metadata
		}
	}

	if tokenMetadata.Name == nil {
		return nil, errors.New("failed to get metadata for given token")
	}

	tree, err := s.buildCollectionMerkleTree(metadatas)
	if err != nil {
		return nil, errors.Wrap(err, "failed to build merke tree")
	}

	proof, err := tree.GetHexProofWithoutPrefix(NewMetadataFromPb(tokenMetadata))
	if err != nil {
		return nil, errors.Wrap(err, "failed to get proof")
	}

	return &launchpadpb.TokenMetadataResponse{
		Metadata:    tokenMetadata,
		MerkleRoot:  tree.GetHexRootWithoutPrefix(),
		MerkleProof: proof,
	}, nil
}

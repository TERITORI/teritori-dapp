package launchpad

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"golang.org/x/exp/slices"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Launchpad struct {
	launchpadpb.UnimplementedLaunchpadServiceServer
	conf *Config
}

type Config struct {
	Logger       *zap.Logger
	IndexerDB    *gorm.DB
	PinataJWT    string
	NetworkStore networks.NetworkStore
}

func NewLaunchpadService(ctx context.Context, conf *Config) launchpadpb.LaunchpadServiceServer {
	// FIXME: validate config
	return &Launchpad{
		conf: conf,
	}
}

// IMPORTANT !!! TODO !!!
// For now, for simplicity, we upload images to ipfs from client side then this backend will
// only check if images have been pinnned correctly.
//
// This approche has 1 downside:
// User can query ipfs node to get all existing images of collection (AI to detect similar images for example)
// then guest what are the remainning NFT then decide if it's interesting to mint.
//
// For now it's not a big problem but in the future, the more secure solution will be handling image upload by backend.
// We dont do it for now yet because grpc-web does not support bidi stream so handle client send image => backend => ipfs properly can take time

// Upload collection metadatas and generate corresponding merkle root
// This will delete all existing tokens metadatas and replace by new ones
func (s *Launchpad) UploadMetadatas(ctx context.Context, req *launchpadpb.UploadMetadatasRequest) (*launchpadpb.UploadMetadatasResponse, error) {
	if err := s.verifySender(req.Sender); err != nil {
		return nil, errors.Wrap(err, "failed to verify sender")
	}

	// Check if client sent pinata jwt along with the payload
	pinataJwt := req.GetPinataJwt()
	if pinataJwt == "" {
		// If pinataJwt is not sent then try to use the system key
		pinataJwt = s.conf.PinataJWT

		// If system does not have JWT then throw error
		if pinataJwt == "" {
			return nil, errors.New("JWT key is required for this endpoint")
		}
	}

	pinnedCIDs := []string{}
	for _, item := range req.Metadatas {
		pinnedCIDs = append(pinnedCIDs, *item.Image)
	}

	// Check pinning
	pinningSrv, err := NewPinningService(Pinata, pinataJwt)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get pinning service")
	}

	if _, err := pinningSrv.VerifyPinned(pinnedCIDs...); err != nil {
		return nil, errors.Wrap(err, "failed to verify pinned images")
	}

	// Check if all files have been pinned correctly
	for _, metadata := range req.Metadatas {
		if !slices.Contains(pinnedCIDs, extractCID(*metadata.Image)) {
			return nil, errors.New(fmt.Sprintf("image %s has not been pinned correctly", *metadata.Image))
		}
	}

	// At this step, LaunchpadProject must be created by indexer when collection has been submitted on-chain
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

	return &launchpadpb.UploadMetadatasResponse{MerkleRoot: hex_root}, nil
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

func (s *Launchpad) CollectionsByCreator(ctx context.Context, req *launchpadpb.CollectionsByCreatorRequest) (*launchpadpb.CollectionsByCreatorResponse, error) {
	limit := req.GetLimit()
  if limit <= 0 {
    return errors.New("limit must be a positive number")
  }

  offset := req.GetOffset()
  if offset < 0 {
    return errors.New("offset must be greater or equal to 0")
  }

  networkID := req.GetNetworkId()
  if networkID == "" {
    return errors.New("missing network id")
  }

  network, err := s.conf.NetworkStore.GetNetwork(networkID)
  if err != nil {
    return errors.Wrap(err, fmt.Sprintf("unknown network id '%s'", networkID))
  }

	creatorID := req.GetCreatorId()
	if creatorID == "" {
		return nil, errors.New("creatorID is mandatory")
	}

	var projects []indexerdb.LaunchpadProject
	if err := s.conf.IndexerDB.Find(&projects, "creator_id = ?", creatorID).Error; err != nil {
		return nil, errors.Wrap(err, "failed to get collection data")
	}

  orderDirection := ""
  switch req.GetSortDirection() {
  case launchpadpb.SortDirection_SORT_DIRECTION_UNSPECIFIED:
    orderDirection = ""
  case launchpadpb.SortDirection_SORT_DIRECTION_ASCENDING:
    orderDirection = " ASC "
  case launchpadpb.SortDirection_SORT_DIRECTION_DESCENDING:
    orderDirection = " DESC "
  }
  orderSQL := ""
  switch req.GetSort() {
  case launchpadpb.Sort_SORT_COLLECTION_NAME:
    orderSQL = "lp.collection_name" + orderDirection
  case marketplacepb.Sort_SORT_STATUS:
    orderSQL = "case when total_volume is null then 1 else 0 end, total_volume " + orderDirection
  case marketplacepb.Sort_SORT_CREATED_AT:
    orderSQL = "lp.time " + orderDirection


  case marketplacepb.Sort_SORT_VOLUME_USD:
    orderSQL = "case when total_volume_usd is null then 1 else 0 end, total_volume_usd " + orderDirection
  case marketplacepb.Sort_SORT_UNSPECIFIED:
    orderSQL = "volume DESC"
  }

	res := make([]string, len(projects))
	for idx, pj := range projects {
		res[idx] = pj.CollectionData.String()
	}

	return &launchpadpb.CollectionsByCreatorResponse{
		Collections: res,
	}, nil
}

func (s *Launchpad) LaunchpadProjects(ctx context.Context, req *launchpadpb.CollectionsRequest) (*launchpadpb.CollectionsResponse, error) {


  //   TODO: Sort, control daoID, return LaunchpadProject[]

	limit := req.GetLimit()
	if limit <= 0 {
		return errors.New("limit must be a positive number")
	}

	offset := req.GetOffset()
	if offset < 0 {
		return errors.New("offset must be greater or equal to 0")
	}

	networkID := req.GetNetworkId()
	if networkID == "" {
		return errors.New("missing network id")
	}

	network, err := s.conf.NetworkStore.GetNetwork(networkID)
	if err != nil {
		return errors.Wrap(err, fmt.Sprintf("unknown network id '%s'", networkID))
	}

	daoID := req.GetCreatorId()

	if creatorID == "" {
		return nil, errors.New("creatorID is mandatory")
	}

	var projects []indexerdb.Collections
	if err := s.conf.IndexerDB.Find(&projects, "creator_id = ?", creatorID).Error; err != nil {
		return nil, errors.Wrap(err, "failed to get collection data")
	}

	res := make([]string, len(projects))
	for idx, pj := range projects {
		res[idx] = pj.CollectionData.String()
	}

	return &launchpadpb.CollectionsResponse{
		Collections: res,
	}, nil
}

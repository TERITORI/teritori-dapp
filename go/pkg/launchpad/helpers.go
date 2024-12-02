package launchpad

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"
	"github.com/pkg/errors"
)

func (s *Launchpad) getCollectionMerkleTree(collectionID string) (*merkletree.MerkleTree, error) {
	return nil, nil
}

func (s *Launchpad) buildCollectionMerkleTree(metadatas []*launchpadpb.Metadata) (*merkletree.MerkleTree, error) {
	// Create merkle tree
	leaves := make([]merkletree.Content, len(metadatas))

	i := 0
	for _, data := range metadatas {
		leaves[i] = NewMetadataFromPb(data)
		i++
	}

	// NOTE: Don't sort leaves to keep the same order of uploaded file
	tree, err := merkletree.New(leaves)
	if err != nil {
		return nil, errors.Wrap(err, "failed to created merkle tree")
	}

	return tree, nil
}

func (s *Launchpad) buildWhitelistMerkleTree(addresses []string) (*merkletree.MerkleTree, error) {
	// Create merkle tree
	leaves := make([]merkletree.Content, len(addresses))

	i := 0
	for _, addr := range addresses {
		leaves[i] = NewWhitelistAddress(addr)
		i++
	}

	// NOTE: Don't sort leaves to keep the same order of uploaded file
	tree, err := merkletree.New(leaves)
	if err != nil {
		return nil, errors.Wrap(err, "failed to created merkle tree")
	}

	return tree, nil
}

// Verify if sender is allowed to get Token metadata
func (s *Launchpad) verifySender(sender string) error {
	return nil
}

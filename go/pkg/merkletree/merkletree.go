package merkletree

import (
	"bytes"
	"encoding/hex"
	"errors"
	"fmt"
	"hash"
	"math/big"

	"golang.org/x/crypto/sha3"
)

// Teritori Version of Merkle tree. Support:
// - keccak256
// - sort
// - keep impair nodes (do not duplicate impair node)

// Content represents the data that is stored and verified by the tree. A type that
// implements this interface can be used as an item in the tree.
type Content interface {
	CalculateHash() ([]byte, error)
	Equals(other Content) (bool, error)
}

// MerkleTree is the container for the tree. It holds a pointer to the root of the tree,
// a list of pointers to the leaf nodes, and the merkle root.
type MerkleTree struct {
	Root         *Node
	merkleRoot   []byte
	Leafs        []*Node
	hashStrategy func() hash.Hash
	sort         bool
}

// Node represents a node, root, or leaf in the tree. It stores pointers to its immediate
// relationships, a hash, the content stored if it is a leaf, and other metadata.
type Node struct {
	Tree   *MerkleTree
	Parent *Node
	Left   *Node
	Right  *Node
	leaf   bool
	Hash   []byte
	C      Content
}

// sortAppend sort and append the nodes to be compatible with OpenZepplin libraries
// https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/cryptography/MerkleProof.sol
func sortAppend(sort bool, a, b []byte) []byte {
	if !sort {
		return append(a, b...)
	}
	var aBig, bBig big.Int
	aBig.SetBytes(a)
	bBig.SetBytes(b)
	if aBig.Cmp(&bBig) == -1 {
		return append(a, b...)
	}
	return append(b, a...)
}

func toHex(bytesValue []byte) string {
	return fmt.Sprintf("0x%s", hex.EncodeToString(bytesValue))
}

// Shortcut to create new with with sorted = true and use keccak256 hash
func New(cs []Content) (*MerkleTree, error) {
	t := &MerkleTree{
		hashStrategy: sha3.NewLegacyKeccak256,
		sort:         true,
	}
	root, leafs, err := buildWithContent(cs, t)
	if err != nil {
		return nil, err
	}
	t.Root = root
	t.Leafs = leafs
	t.merkleRoot = root.Hash
	return t, nil
}

// GetMerklePath: Get Merkle proof in hex format
func (m *MerkleTree) GetHexProof(content Content) ([]string, error) {
	for _, current := range m.Leafs {
		ok, err := current.C.Equals(content)
		if err != nil {
			return nil, err
		}

		if ok {
			currentParent := current.Parent
			var proof []string

			for currentParent != nil {
				if bytes.Equal(currentParent.Left.Hash, current.Hash) {
					rightHash := currentParent.Right.Hash
					if rightHash != nil {
						proof = append(proof, toHex(rightHash))
					}
				} else {
					proof = append(proof, toHex(currentParent.Left.Hash))
				}
				current = currentParent
				currentParent = currentParent.Parent
			}
			return proof, nil
		}
	}
	return nil, nil
}

// buildWithContent is a helper function that for a given set of Contents, generates a
// corresponding tree and returns the root node, a list of leaf nodes, and a possible error.
// Returns an error if cs contains no Contents.
func buildWithContent(cs []Content, t *MerkleTree) (*Node, []*Node, error) {
	if len(cs) == 0 {
		return nil, nil, errors.New("error: cannot construct tree with no content")
	}
	var leafs []*Node

	for _, c := range cs {
		hash, err := c.CalculateHash()
		if err != nil {
			return nil, nil, err
		}

		leafs = append(leafs, &Node{
			Hash: hash,
			C:    c,
			leaf: true,
			Tree: t,
		})
	}

	root, err := buildIntermediate(leafs, t)
	if err != nil {
		return nil, nil, err
	}

	return root, leafs, nil
}

// buildIntermediate is a helper function that for a given list of leaf nodes, constructs
// the intermediate and root levels of the tree. Returns the resulting root node of the tree.
func buildIntermediate(nl []*Node, t *MerkleTree) (*Node, error) {
	var nodes []*Node

	for i := 0; i < len(nl); i += 2 {
		h := t.hashStrategy()

		leftNode := nl[i]
		rightNode := &Node{}
		mergedHash := leftNode.Hash

		if i+1 < len(nl) {
			rightNode = nl[i+1]
			chash := sortAppend(t.sort, leftNode.Hash, rightNode.Hash)
			if _, err := h.Write(chash); err != nil {
				return nil, err
			}
			mergedHash = h.Sum(nil)
		}

		n := &Node{
			Left:  leftNode,
			Right: rightNode,
			Hash:  mergedHash,
			Tree:  t,
		}
		nodes = append(nodes, n)
		leftNode.Parent = n
		rightNode.Parent = n

		if len(nl) == 2 || len(nl) == 1 {
			return n, nil
		}
	}
	return buildIntermediate(nodes, t)
}

// GetRoot returns the unverified Merkle Root (hash of the root node) of the tree.
func (m *MerkleTree) GetRoot() []byte {
	return m.merkleRoot
}

func (m *MerkleTree) GetHexRoot() string {
	return toHex(m.GetRoot())
}

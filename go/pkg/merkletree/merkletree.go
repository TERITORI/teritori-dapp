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
	dup    bool
	Hash   []byte
	C      Content
	sort   bool
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

// verifyNode walks down the tree until hitting a leaf, calculating the hash at each level
// and returning the resulting hash of Node n.
func (n *Node) verifyNode(sort bool) ([]byte, error) {
	if n.leaf {
		return n.C.CalculateHash()
	}
	rightBytes, err := n.Right.verifyNode(sort)
	if err != nil {
		return nil, err
	}

	leftBytes, err := n.Left.verifyNode(sort)
	if err != nil {
		return nil, err
	}

	h := n.Tree.hashStrategy()
	if _, err := h.Write(sortAppend(sort, leftBytes, rightBytes)); err != nil {
		return nil, err
	}

	return h.Sum(nil), nil
}

// calculateNodeHash is a helper function that calculates the hash of the node.
func (n *Node) calculateNodeHash(sort bool) ([]byte, error) {
	if n.leaf {
		return n.C.CalculateHash()
	}

	h := n.Tree.hashStrategy()
	if _, err := h.Write(sortAppend(sort, n.Left.Hash, n.Right.Hash)); err != nil {
		return nil, err
	}

	return h.Sum(nil), nil
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

// GetMerklePath: Get Merkle path and indexes(left leaf or right leaf)
func (m *MerkleTree) GetMerklePath(content Content) ([][]byte, []int64, error) {
	for _, current := range m.Leafs {
		ok, err := current.C.Equals(content)
		if err != nil {
			return nil, nil, err
		}

		if ok {
			currentParent := current.Parent
			var merklePath [][]byte
			var index []int64
			for currentParent != nil {
				if bytes.Equal(currentParent.Left.Hash, current.Hash) {
					merklePath = append(merklePath, currentParent.Right.Hash)
					index = append(index, 1) // right leaf
				} else {
					merklePath = append(merklePath, currentParent.Left.Hash)
					index = append(index, 0) // left leaf
				}
				current = currentParent
				currentParent = currentParent.Parent
			}
			return merklePath, index, nil
		}
	}
	return nil, nil, nil
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

	if len(leafs)%2 == 1 {
		duplicate := &Node{
			Hash: leafs[len(leafs)-1].Hash,
			C:    leafs[len(leafs)-1].C,
			leaf: true,
			dup:  true,
			Tree: t,
		}
		leafs = append(leafs, duplicate)
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
		var left, right int = i, i + 1
		if i+1 == len(nl) {
			right = i
		}
		chash := sortAppend(t.sort, nl[left].Hash, nl[right].Hash)
		if _, err := h.Write(chash); err != nil {
			return nil, err
		}

		sumHash := h.Sum(nil)
		if nl[left].dup {
			sumHash = nl[right].Hash
		}
		if nl[right].dup {
			sumHash = nl[left].Hash
		}

		n := &Node{
			Left:  nl[left],
			Right: nl[right],
			Hash:  sumHash,
			Tree:  t,
		}
		nodes = append(nodes, n)
		nl[left].Parent = n
		nl[right].Parent = n
		if len(nl) == 2 {
			return n, nil
		}
	}
	return buildIntermediate(nodes, t)
}

// MerkleRoot returns the unverified Merkle Root (hash of the root node) of the tree.
func (m *MerkleTree) MerkleRoot() []byte {
	return m.merkleRoot
}

func (m *MerkleTree) MerkleRootHex() string {
	return fmt.Sprintf("0x%s", hex.EncodeToString(m.MerkleRoot()))
}

// RebuildTree is a helper function that will rebuild the tree reusing only the content that
// it holds in the leaves.
func (m *MerkleTree) RebuildTree() error {
	var cs []Content
	for _, c := range m.Leafs {
		cs = append(cs, c.C)
	}
	root, leafs, err := buildWithContent(cs, m)
	if err != nil {
		return err
	}
	m.Root = root
	m.Leafs = leafs
	m.merkleRoot = root.Hash
	return nil
}

// RebuildTreeWith replaces the content of the tree and does a complete rebuild; while the root of
// the tree will be replaced the MerkleTree completely survives this operation. Returns an error if the
// list of content cs contains no entries.
func (m *MerkleTree) RebuildTreeWith(cs []Content) error {
	root, leafs, err := buildWithContent(cs, m)
	if err != nil {
		return err
	}
	m.Root = root
	m.Leafs = leafs
	m.merkleRoot = root.Hash
	return nil
}

// VerifyTree verify tree validates the hashes at each level of the tree and returns true if the
// resulting hash at the root of the tree matches the resulting root hash; returns false otherwise.
func (m *MerkleTree) VerifyTree() (bool, error) {
	calculatedMerkleRoot, err := m.Root.verifyNode(m.sort)
	if err != nil {
		return false, err
	}

	if bytes.Compare(m.merkleRoot, calculatedMerkleRoot) == 0 {
		return true, nil
	}
	return false, nil
}

// VerifyContent indicates whether a given content is in the tree and the hashes are valid for that content.
// Returns true if the expected Merkle Root is equivalent to the Merkle root calculated on the critical path
// for a given content. Returns true if valid and false otherwise.
func (m *MerkleTree) VerifyContent(content Content) (bool, error) {
	for _, l := range m.Leafs {
		ok, err := l.C.Equals(content)
		if err != nil {
			return false, err
		}

		if ok {
			currentParent := l.Parent
			for currentParent != nil {
				h := m.hashStrategy()
				rightBytes, err := currentParent.Right.calculateNodeHash(m.sort)
				if err != nil {
					return false, err
				}

				leftBytes, err := currentParent.Left.calculateNodeHash(m.sort)
				if err != nil {
					return false, err
				}

				if _, err := h.Write(sortAppend(m.sort, leftBytes, rightBytes)); err != nil {
					return false, err
				}
				if bytes.Compare(h.Sum(nil), currentParent.Hash) != 0 {
					return false, nil
				}
				currentParent = currentParent.Parent
			}
			return true, nil
		}
	}
	return false, nil
}

// String returns a string representation of the node.
func (n *Node) String() string {
	return fmt.Sprintf("%t %t %v %s", n.leaf, n.dup, n.Hash, n.C)
}

// String returns a string representation of the tree. Only leaf nodes are included
// in the output.
func (m *MerkleTree) String() string {
	s := ""
	for _, l := range m.Leafs {
		s += fmt.Sprint(l)
		s += "\n"
	}
	return s
}

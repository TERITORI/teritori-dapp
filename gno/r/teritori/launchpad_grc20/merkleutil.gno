package launchpad_grc20

// Implementation of Hashable interface from gno/p/demo/merkle
//
// type Hashable interface {
// 	Bytes() []byte
// }
//

type Leaf struct {
	data []byte
}

func (l Leaf) Bytes() []byte {
	return l.data
}

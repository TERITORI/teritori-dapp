package collections

import "github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"

type CollectionsProvider interface {
	Collections(limit, offset int) chan *marketplacepb.Collection
}

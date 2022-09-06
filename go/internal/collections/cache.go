package collections

import (
	"context"
	"sync"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"go.uber.org/zap"
)

type collectionsCache struct {
	mu          *sync.RWMutex
	collections []*marketplacepb.Collection
}

var _ CollectionsProvider = (*collectionsCache)(nil)

type collectionsFetch func() ([]*marketplacepb.Collection, error)

func newCachedCollectionsProvider(ctx context.Context, fetch collectionsFetch, logger *zap.Logger) CollectionsProvider {
	cache := &collectionsCache{
		mu: &sync.RWMutex{},
	}
	go func() {
		for {
			func() {
				collections, err := fetch()
				if (err) != nil {
					logger.Error("failed to fetch collections", zap.Error(err))
					return
				}
				cache.mu.Lock()
				cache.collections = collections
				cache.mu.Unlock()
			}()
			select {
			case <-ctx.Done():
				logger.Info("stopping cached collections refresh")
				return
			case <-time.After(refreshDelay):
				// refresh
			}
		}
	}()
	return cache
}

func (cc *collectionsCache) Collections(limit, offset int) chan *marketplacepb.Collection {
	cc.mu.RLock()
	collections := cc.collections
	cc.mu.RUnlock()

	ch := make(chan *marketplacepb.Collection)

	start := offset
	if start > len(collections) {
		close(ch)
		return ch
	}

	end := offset + limit
	if end > len(collections) {
		end = len(collections)
	}

	go func() {
		defer close(ch)
		for _, ul := range collections[start:end] {
			ch <- ul
		}
	}()
	return ch
}

package marketing

import (
	"context"
	"sync"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketingpb"
	"go.uber.org/zap"
)

const (
	refreshDelay = 5 * time.Minute
)

type Cache struct {
	mutex               *sync.RWMutex
	upcomingCollections []*marketingpb.MarketingCollectionPreview
	liveCollections     []*marketingpb.MarketingCollectionPreview
	banners             []*marketingpb.Banner
	testnetBanners      []*marketingpb.Banner
	news                []*marketingpb.News
	testnetNews         []*marketingpb.News
}

func NewCache(ctx context.Context, client *Client, logger *zap.Logger) *Cache {
	c := &Cache{mutex: new(sync.RWMutex)}
	go func() {
		for {
			uc, err := client.FetchUpcomingCollections(logger)
			if (err) != nil {
				logger.Error("failed to fetch upcoming collections", zap.Error(err))
			} else {
				c.mutex.Lock()
				c.upcomingCollections = uc
				c.mutex.Unlock()
			}

			lc, err := client.FetchLiveCollections(logger)
			if (err) != nil {
				logger.Error("failed to fetch live collections", zap.Error(err))
			} else {
				c.mutex.Lock()
				c.liveCollections = lc
				c.mutex.Unlock()
			}

			b, err := client.FetchBanners(false)
			if (err) != nil {
				logger.Error("failed to fetch banners", zap.Error(err))
			} else {
				c.mutex.Lock()
				c.banners = b
				c.mutex.Unlock()
			}

			tb, err := client.FetchBanners(true)
			if (err) != nil {
				logger.Error("failed to fetch banners", zap.Error(err))
			} else {
				c.mutex.Lock()
				c.testnetBanners = tb
				c.mutex.Unlock()
			}

			n, err := client.FetchNews(false)
			if (err) != nil {
				logger.Error("failed to fetch news", zap.Error(err))
			} else {
				c.mutex.Lock()
				c.news = n
				c.mutex.Unlock()
			}

			tn, err := client.FetchNews(true)
			if (err) != nil {
				logger.Error("failed to fetch news", zap.Error(err))
			} else {
				c.mutex.Lock()
				c.testnetNews = tn
				c.mutex.Unlock()
			}

			select {
			case <-ctx.Done():
				logger.Info("stopping home cache refresh")
				return
			case <-time.After(refreshDelay):
				// refresh
			}
		}
	}()
	return c
}

func (c *Cache) GetUpcomingCollections() []*marketingpb.MarketingCollectionPreview {
	c.mutex.RLock()
	uc := c.upcomingCollections
	c.mutex.RUnlock()
	return uc
}

func (c *Cache) GetLiveCollections() []*marketingpb.MarketingCollectionPreview {
	c.mutex.RLock()
	lc := c.liveCollections
	c.mutex.RUnlock()
	return lc
}

func (c *Cache) GetBanners() []*marketingpb.Banner {
	c.mutex.RLock()
	b := c.banners
	c.mutex.RUnlock()
	return b
}

func (c *Cache) GetTestnetBanners() []*marketingpb.Banner {
	c.mutex.RLock()
	b := c.testnetBanners
	c.mutex.RUnlock()
	return b
}

func (c *Cache) GetNews() []*marketingpb.News {
	c.mutex.RLock()
	n := c.news
	c.mutex.RUnlock()
	return n
}

func (c *Cache) GetTestnetNews() []*marketingpb.News {
	c.mutex.RLock()
	n := c.testnetNews
	c.mutex.RUnlock()
	return n
}

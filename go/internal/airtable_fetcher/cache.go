package airtable_fetcher

import (
	"context"
	"sync"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"go.uber.org/zap"
)

const (
	refreshDelay = 5 * time.Minute
)

type Cache struct {
	mutex            *sync.RWMutex
	upcomingLaunches []*marketplacepb.Collection
	banners          []*marketplacepb.Banner
	testnetBanners   []*marketplacepb.Banner
	news             []*marketplacepb.News
	testnetNews      []*marketplacepb.News
}

func NewCache(ctx context.Context, client *Client, logger *zap.Logger) *Cache {
	c := &Cache{mutex: new(sync.RWMutex)}
	go func() {
		for {
			ul, err := client.FetchUpcomingLaunches(logger)
			if (err) != nil {
				logger.Error("failed to fetch upcoming launches", zap.Error(err))
			} else {
				c.mutex.Lock()
				c.upcomingLaunches = ul
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

func (c *Cache) GetUpcomingLaunches() []*marketplacepb.Collection {
	c.mutex.RLock()
	ul := c.upcomingLaunches
	c.mutex.RUnlock()
	return ul
}

func (c *Cache) GetBanners() []*marketplacepb.Banner {
	c.mutex.RLock()
	b := c.banners
	c.mutex.RUnlock()
	return b
}

func (c *Cache) GetTestnetBanners() []*marketplacepb.Banner {
	c.mutex.RLock()
	b := c.testnetBanners
	c.mutex.RUnlock()
	return b
}

func (c *Cache) GetNews() []*marketplacepb.News {
	c.mutex.RLock()
	n := c.news
	c.mutex.RUnlock()
	return n
}

func (c *Cache) GetTestnetNews() []*marketplacepb.News {
	c.mutex.RLock()
	n := c.testnetNews
	c.mutex.RUnlock()
	return n
}

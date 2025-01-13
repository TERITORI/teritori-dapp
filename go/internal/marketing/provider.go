package marketing

import "github.com/TERITORI/teritori-dapp/go/pkg/marketingpb"

type MarketingProvider interface {
	News(limit, offset int) chan *marketingpb.News
	Banners(limit, offset int) chan *marketingpb.Banner
	UpcomingCollections(limit, offset int) chan *marketingpb.MarketingCollectionPreview
	LiveCollections(limit, offset int) chan *marketingpb.MarketingCollectionPreview
}

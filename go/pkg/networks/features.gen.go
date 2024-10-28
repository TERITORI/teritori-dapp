package networks

import (
	"encoding/json"
	"github.com/pkg/errors"
)

const (
	FeatureTypeNFTMarketplace            = FeatureType("NFTMarketplace")
	FeatureTypeNFTLaunchpad              = FeatureType("NFTLaunchpad")
	FeatureTypeNameService               = FeatureType("NameService")
	FeatureTypeSwap                      = FeatureType("Swap")
	FeatureTypeBurnTokens                = FeatureType("BurnTokens")
	FeatureTypeOrganizations             = FeatureType("Organizations")
	FeatureTypeP2E                       = FeatureType("P2E")
	FeatureTypeSocialFeed                = FeatureType("SocialFeed")
	FeatureTypeUPP                       = FeatureType("UPP")
	FeatureTypeRiotP2E                   = FeatureType("RiotP2E")
	FeatureTypeNFTBridge                 = FeatureType("NFTBridge")
	FeatureTypeCosmWasmPremiumFeed       = FeatureType("CosmWasmPremiumFeed")
	FeatureTypeGnoProjectManager         = FeatureType("GnoProjectManager")
	FeatureTypeLaunchpadERC20            = FeatureType("LaunchpadERC20")
	FeatureTypeNFTMarketplaceLeaderboard = FeatureType("NFTMarketplaceLeaderboard")
	FeatureTypeCosmWasmNFTsBurner        = FeatureType("CosmWasmNFTsBurner")
)

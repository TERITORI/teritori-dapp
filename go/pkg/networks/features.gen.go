package networks

import (
	"encoding/json"
	"github.com/pkg/errors"
)

const (
	FeatureTypeNFTMarketplace      = FeatureType("NFTMarketplace")
	FeatureTypeNFTLaunchpad        = FeatureType("NFTLaunchpad")
	FeatureTypeNameService         = FeatureType("NameService")
	FeatureTypeSwap                = FeatureType("Swap")
	FeatureTypeBurnTokens          = FeatureType("BurnTokens")
	FeatureTypeOrganizations       = FeatureType("Organizations")
	FeatureTypeP2E                 = FeatureType("P2E")
	FeatureTypeSocialFeed          = FeatureType("SocialFeed")
	FeatureTypeUPP                 = FeatureType("UPP")
	FeatureTypeRiotP2E             = FeatureType("RiotP2E")
	FeatureTypeNFTBridge           = FeatureType("NFTBridge")
	FeatureTypeCosmWasmPremiumFeed = FeatureType("CosmWasmPremiumFeed")
)

type FeatureCosmWasmPremiumFeed struct {
	*FeatureBase
	MembershipContractAddress string `json:"membershipContractAddress"`
	MintDenom                 string `json:"mintDenom"`
}

var _ Feature = &FeatureCosmWasmPremiumFeed{}

func (f FeatureCosmWasmPremiumFeed) Type() FeatureType {
	return FeatureTypeCosmWasmPremiumFeed
}

func (nb *NetworkBase) GetFeatureCosmWasmPremiumFeed() (*FeatureCosmWasmPremiumFeed, error) {
	feature, err := nb.GetFeature(FeatureTypeCosmWasmPremiumFeed)
	if err != nil {
		return nil, err
	}
	return feature.(*FeatureCosmWasmPremiumFeed), nil
}

func UnmarshalFeature(b []byte) (Feature, error) {
	var base FeatureBase
	if err := json.Unmarshal(b, &base); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal feature base")
	}
	switch base.Type {
	case FeatureTypeCosmWasmPremiumFeed:
		var f FeatureCosmWasmPremiumFeed
		if err := json.Unmarshal(b, &f); err != nil {
			return nil, errors.Wrap(err, "failed to unmarshal feature CosmWasmPremiumFeed")
		}
		return &f, nil
	}
	return nil, errors.Errorf("unknown feature type %s", base.Type)
}

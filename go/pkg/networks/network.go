package networks

import (
	"encoding/json"
)

type NetworkKind string

type Network interface {
	GetBase() *NetworkBase
}

type FeatureType string

type Feature interface {
	Type() FeatureType
	GetBase() *FeatureBase
}

type FeatureBase struct {
	Type FeatureType `json:"type"`
}

func (fb *FeatureBase) GetBase() *FeatureBase {
	return fb
}

type NetworkBase struct {
	ID             string        `json:"id"`
	Currencies     []CurrencyObj `json:"currencies"`
	Kind           NetworkKind   `json:"kind"`
	IDPrefix       string        `json:"idPrefix"`
	Testnet        bool          `json:"testnet"`
	Features       []FeatureType `json:"features"`
	FeatureObjects []Feature     `json:"-"`
}

type FeaturesContainer struct {
	FeatureObjects []json.RawMessage `json:"featureObjects"`
}

func (nb *NetworkBase) GetBase() *NetworkBase {
	return nb
}

func (nb *NetworkBase) GetFeature(featureType FeatureType) (Feature, error) {
	for i, ft := range nb.FeatureObjects {
		if ft.Type() == featureType {
			return nb.FeatureObjects[i], nil
		}
	}
	return nil, ErrFeatureNotFound
}

var _ Network = &NetworkBase{}

type CosmosNetwork struct {
	*NetworkBase

	ChainID                           string `json:"chainId"`
	RpcEndpoint                       string `json:"rpcEndpoint"`
	WalletURLForStaking               string `json:"walletUrlForStaking"`
	NameServiceContractAddress        string `json:"nameServiceContractAddress"`
	NameServiceDefaultImage           string `json:"nameServiceDefaultImage"`
	VaultContractAddress              string `json:"vaultContractAddress"`
	DistributorContractAddress        string `json:"distributorContractAddress"`
	RiotContractAddressGen0           string `json:"riotContractAddressGen0"`
	RiotContractAddressGen1           string `json:"riotContractAddressGen1"`
	RiotSquadStakingContractAddressV1 string `json:"riotSquadStakingContractAddressV1"`
	RiotSquadStakingContractAddressV2 string `json:"riotSquadStakingContractAddressV2"`
	RiotersFooterContractAddress      string `json:"riotersFooterContractAddress"`
	SocialFeedContractAddress         string `json:"socialFeedContractAddress"`
	CwAdminFactoryContractAddress     string `json:"cwAdminFactoryContractAddress"`
}

var _ Network = &CosmosNetwork{}

type EthereumNetwork struct {
	*NetworkBase

	Endpoint                        string `json:"endpoint"`
	ChainID                         int32  `json:"chainId"`
	RpcEndpoint                     string `json:"rpcEndpoint"`
	AlchemyAPIKey                   string `json:"alchemyApiKey"`
	FirehoseEndpoint                string `json:"firehoseEndpoint"`
	SubstreamsManifest              string `json:"substreamsManifest"`
	IndexStartBlock                 string `json:"indexStartBlock"`
	VaultContractAddress            string `json:"vaultContractAddress"`
	RiotContractAddressGen0         string `json:"riotContractAddressGen0"`
	RiotContractAddressGen1         string `json:"riotContractAddressGen1"`
	RiotSquadStakingContractAddress string `json:"riotSquadStakingContractAddress"`
	DistributorContractAddress      string `json:"distributorContractAddress"`
	RiotBridgeAddressGen0           string `json:"riotBridgeAddressGen0"`
	RiotBridgeAddressGen1           string `json:"riotBridgeAddressGen1"`
	RiotNFTAddressGen0              string `json:"riotNFTAddressGen0"`
	RiotNFTAddressGen1              string `json:"riotNFTAddressGen1"`
	RiotBridgedNFTAddressGen0       string `json:"riotBridgedNFTAddressGen0"`
	RiotBridgedNFTAddressGen1       string `json:"riotBridgedNFTAddressGen1"`
	ToriBridgedTokenAddress         string `json:"toriBridgedTokenAddress"`
	RiotOriginalCollectionIdGen0    string `json:"riotOriginalCollectionIdGen0"`
	RiotOriginalCollectionIdGen1    string `json:"riotOriginalCollectionIdGen1"`
}

var _ Network = &EthereumNetwork{}

type SolanaNetwork struct {
	*NetworkBase

	HolaplexGraphqlEndpoint string `json:"holaplexGraphqlEndpoint"`
}

var _ Network = &SolanaNetwork{}

type GnoNetwork struct {
	*NetworkBase

	ChainID                    string `json:"chainId"`
	NameServiceContractAddress string `json:"nameServiceContractAddress"`
	GnowebURL                  string `json:"gnowebURL"`
	GnoTxIndexerURL            string `json:"gnoTxIndexerURL"`
}

var _ Network = &GnoNetwork{}

package networks

type NetworkKind string

type Network interface {
	GetBase() *NetworkBase
}

type NetworkBase struct {
	ID         string        `json:"id"`
	Currencies []CurrencyObj `json:"currencies"`
	Kind       NetworkKind   `json:"kind"`
	IDPrefix   string        `json:"idPrefix"`
	Testnet    bool          `json:"testnet"`
}

func (nb *NetworkBase) GetBase() *NetworkBase {
	return nb
}

var _ Network = &NetworkBase{}

type CosmosNetwork struct {
	*NetworkBase

	ChainID                           string `json:"chainId"`
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
	MusicplayerContractAddress        string `json:"musicplayerContractAddress"`
	DaoFactoryContractAddress         string `json:"daoFactoryContractAddress"`
}

var _ Network = &CosmosNetwork{}

type EthereumNetwork struct {
	*NetworkBase

	Endpoint             string `json:"endpoint"`
	ChainID              int32  `json:"chainId"`
	AlchemyAPIKey        string `json:"alchemyApiKey"`
	TheGraphEndpoint     string `json:"theGraphEndpoint"`
	VaultContractAddress string `json:"vaultContractAddress"`
	RiotContractAddress  string `json:"riotContractAddress"`
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
}

var _ Network = &GnoNetwork{}

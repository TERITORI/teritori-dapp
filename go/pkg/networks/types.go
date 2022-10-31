package networks

type Currency interface {
	GetDenom() string
}

type Network struct {
	ID         string     `json:"id"`
	Currencies []Currency `json:"currencies"`
}

type IBCCurrency struct {
	Denom         string `json:"denom"`
	SourceNetwork string `json:"sourceNetwork"`
	SourceDenom   string `json:"sourceDenom"`
}

func (ibcc *IBCCurrency) GetDenom() string {
	return ibcc.Denom
}

type NativeCurrency struct {
	Denom       string `json:"denom"`
	CoinGeckoID string `json:"coingeckoId"`
}

func (nc *NativeCurrency) GetDenom() string {
	return nc.Denom
}

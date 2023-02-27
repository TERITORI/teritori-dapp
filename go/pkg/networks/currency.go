package networks

import (
	"encoding/json"
	"fmt"

	"github.com/pkg/errors"
)

type Currency interface {
	GetDenom() string
}

type CurrencyBase struct {
	Kind string `json:"kind"`
}

type CurrencyObj struct {
	Currency
}

func (c *CurrencyObj) UnmarshalJSON(data []byte) error {
	var base CurrencyBase
	if err := json.Unmarshal(data, &base); err != nil {
		return errors.Wrap(err, "failed to unmarshal currency base")
	}

	switch base.Kind {
	case "native":
		var native NativeCurrency
		if err := json.Unmarshal(data, &native); err != nil {
			return errors.Wrap(err, "failed to unmarshal native currency")
		}
		c.Currency = &native
		return nil
	case "ibc":
		var ibc IBCCurrency
		if err := json.Unmarshal(data, &ibc); err != nil {
			return errors.Wrap(err, "failed to unmarshal ibc currency")
		}
		c.Currency = &ibc
		return nil
	default:
		return fmt.Errorf("unknown currency kind '%s'", base.Kind)
	}
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
	Decimals    uint   `json:"decimals"`
}

func (nc *NativeCurrency) GetDenom() string {
	return nc.Denom
}

package networks

import (
	"fmt"

	"github.com/pkg/errors"
)

func GetNetwork(networkID string) (*Network, error) {
	for _, network := range AllNetworks {
		if network.ID == networkID {
			return network, nil
		}
	}
	return nil, ErrNotFound
}

func GetCurrency(networkID string, denom string) (Currency, error) {
	network, err := GetNetwork(networkID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(`failed to get network "%s"`, networkID))
	}
	for _, currency := range network.Currencies {
		if currency.GetDenom() == denom {
			return currency, nil
		}
	}
	return nil, ErrNotFound
}

func GetNativeCurrency(networkID string, denom string) (*NativeCurrency, error) {
	currency, err := GetCurrency(networkID, denom)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(`failed to get currency "%s" on "%s"`, denom, networkID))
	}
	switch c := currency.(type) {
	case *IBCCurrency:
		nativeCurrency, err := GetNativeCurrency(c.SourceNetwork, c.SourceDenom)
		if err != nil {
			return nil, errors.Wrap(err, fmt.Sprintf(`failed to get underlying currency of "%s" on "%s"`, denom, networkID))
		}
		return nativeCurrency, nil
	case *NativeCurrency:
		return c, nil
	default:
		return nil, errors.New(fmt.Sprintf(`unknown currency type of "%s" on "%s"`, denom, networkID))
	}
}

var ErrNotFound = errors.New("not found")

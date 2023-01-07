package networks

import (
	"encoding/json"
	"fmt"

	"github.com/pkg/errors"
)

type NetworkStore []Network

func UnmarshalNetworkStore(b []byte) (NetworkStore, error) {
	var netstore NetworkStore
	var array []json.RawMessage
	if err := json.Unmarshal(b, &array); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal networks array")
	}
	for _, elem := range array {
		network, err := UnmarshalNetwork(elem)
		if err != nil {
			return nil, errors.Wrap(err, "failed to unmarshal network")
		}
		netstore = append(netstore, network)
	}
	return netstore, nil
}

func (netstore NetworkStore) GetNetwork(networkID string) (Network, error) {
	for _, network := range netstore {
		id := network.GetBase().ID
		if id == networkID {
			return network, nil
		}
	}
	return nil, ErrNotFound
}

func (netstore NetworkStore) MustGetNetwork(id string) Network {
	network, err := netstore.GetNetwork(id)
	if err != nil {
		panic(err)
	}
	return network
}

func (netstore NetworkStore) GetCurrency(networkID string, denom string) (Currency, error) {
	network, err := netstore.GetNetwork(networkID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(`failed to get network "%s"`, networkID))
	}
	for _, currency := range network.GetBase().Currencies {
		if currency.GetDenom() == denom {
			return currency.Currency, nil
		}
	}
	return nil, ErrNotFound
}

func (netstore NetworkStore) GetNativeCurrency(networkID string, denom string) (*NativeCurrency, error) {
	currency, err := netstore.GetCurrency(networkID, denom)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(`failed to get currency "%s" on "%s"`, denom, networkID))
	}
	switch c := currency.(type) {
	case *IBCCurrency:
		nativeCurrency, err := netstore.GetNativeCurrency(c.SourceNetwork, c.SourceDenom)
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

func (netstore NetworkStore) GetNetworkFromIDPrefix(prefix string) (Network, error) {
	for _, net := range netstore {
		if net.GetBase().IDPrefix == prefix {
			return net, nil
		}
	}
	return nil, ErrNotFound
}

var (
	ErrNotFound  = errors.New("not found")
	ErrWrongType = errors.New("wrong type")
)

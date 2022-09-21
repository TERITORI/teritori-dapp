package marketplacepb

import "fmt"

func (n Network) Prefix() string {
	switch n {
	case Network_NETWORK_FAKE:
		return "fake"
	case Network_NETWORK_SOLANA:
		return "sol"
	case Network_NETWORK_TERITORI:
		return "tori"
	case Network_NETWORK_UNSPECIFIED:
		return "unspecified"
	default:
		return fmt.Sprintf("unknown-%d", n)
	}
}

func NetworkFromPrefix(prefix string) (Network, error) {
	for _, i := range Network_value {
		n := Network(i)
		if n.Prefix() == prefix {
			return n, nil
		}
	}
	return Network_NETWORK_UNSPECIFIED, fmt.Errorf(`unknown network prefix "%s"`, prefix)
}

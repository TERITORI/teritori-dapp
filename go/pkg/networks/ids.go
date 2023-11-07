package networks

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/pkg/errors"
)

type CollectionID string
type UserID string
type NFTID string
type ActivityID string

func (n *NetworkBase) CollectionID(mintContractAddress string) CollectionID {
	return CollectionID(fmt.Sprintf("%s-%s", n.IDPrefix, mintContractAddress))
}

// returns <network_id>-<root_contract_address>
func (netstore NetworkStore) ParseCollectionID(userId string) (Network, string, error) {
	parts := strings.Split(userId, "-")
	if len(parts) != 2 {
		return nil, "", errors.New("bad shape")
	}
	network, err := netstore.GetNetworkFromIDPrefix(parts[0])
	if err != nil {
		return nil, "", errors.Wrap(err, "failed to derive network from id prefix")
	}
	return network, parts[1], nil
}

func (n *NetworkBase) NFTID(mintContractAddress string, tokenId string) NFTID {
	return NFTID(fmt.Sprintf("%s-%s-%s", n.IDPrefix, mintContractAddress, tokenId))
}

// returns <network_id>-<root_contract_address>-<token_id>
func (netstore NetworkStore) ParseNFTID(nftId string) (Network, string, string, error) {
	parts := strings.Split(nftId, "-")
	if len(parts) != 3 {
		return nil, "", "", errors.New("bad shape")
	}
	network, err := netstore.GetNetworkFromIDPrefix(parts[0])
	if err != nil {
		return nil, "", "", errors.Wrap(err, "failed to derive network from id prefix")
	}
	return network, parts[1], parts[2], nil
}

func (n *NetworkBase) UserID(address string) UserID {
	return UserID(fmt.Sprintf("%s-%s", n.IDPrefix, address))
}

// returns <network_id>-<user_address>
func (netstore NetworkStore) ParseUserID(userId string) (Network, string, error) {
	parts := strings.Split(userId, "-")
	if len(parts) != 2 {
		return nil, "", errors.New("bad shape")
	}
	network, err := netstore.GetNetworkFromIDPrefix(parts[0])
	if err != nil {
		return nil, "", errors.Wrap(err, "failed to derive network from id prefix")
	}
	return network, parts[1], nil
}

func (n *NetworkBase) ActivityID(txHash string, messageIndex int) ActivityID {
	return ActivityID(fmt.Sprintf("%s-%s-%d", n.IDPrefix, txHash, messageIndex))
}

// returns <network_id>-<tx_hash>-<message_index>
func (netstore NetworkStore) ParseActivityID(activityId string) (Network, string, int, error) {
	parts := strings.Split(activityId, "-")
	if len(parts) != 3 {
		return nil, "", 0, errors.New("bad shape")
	}
	network, err := netstore.GetNetworkFromIDPrefix(parts[0])
	if err != nil {
		return nil, "", 0, errors.Wrap(err, "failed to derive network from id prefix")
	}
	messageIndex, err := strconv.Atoi(parts[2])
	if err != nil {
		return nil, "", 0, errors.Wrap(err, "failed to parse message index")
	}
	return network, parts[1], messageIndex, nil
}

package launchpad

import (
	"bytes"
	"fmt"

	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"
	"github.com/cosmos/gogoproto/proto"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/pkg/errors"
)

type WhitelistAddress struct {
	value string
}

func NewWhitelistAddress(addr string) *WhitelistAddress {
	return &WhitelistAddress{value: addr}
}

func (addr *WhitelistAddress) toStr() string {
	return fmt.Sprintf("%s", addr.value)
}

func (addr *WhitelistAddress) toBytes() []byte {
	return []byte(addr.toStr())
}

func (addr *WhitelistAddress) GetID() string {
	return addr.value
}

func (addr *WhitelistAddress) CalculateHash() ([]byte, error) {
	res := crypto.Keccak256(addr.toBytes())
	return res, nil
}

func (addr *WhitelistAddress) Equals(other merkletree.Content) (bool, error) {
	otherVal := other.(*WhitelistAddress).toStr()
	return otherVal == addr.toStr(), nil
}

func (addr *WhitelistAddress) ToJSONB() interface{} {
	return map[string]interface{}{}
}

type Metadata struct {
	launchpadpb.Metadata
}

func NewMetadataFromPb(data *launchpadpb.Metadata) *Metadata {
	return &Metadata{
		Metadata: launchpadpb.Metadata{
			Image:                 data.Image,
			ImageData:             data.ImageData,
			ExternalUrl:           data.ExternalUrl,
			Description:           data.Description,
			Name:                  data.Name,
			Attributes:            data.Attributes,
			BackgroundColor:       data.BackgroundColor,
			AnimationUrl:          data.AnimationUrl,
			YoutubeUrl:            data.YoutubeUrl,
			RoyaltyPercentage:     data.RoyaltyPercentage,
			RoyaltyPaymentAddress: data.RoyaltyPaymentAddress,
		},
	}
}

func (m *Metadata) proto_encode() ([]byte, error) {
	bytes, err := proto.Marshal(&m.Metadata)
	if err != nil {
		return nil, errors.Wrap(err, "failed to proto_encode metadata to proto")
	}

	return bytes, nil
}

// Converts the Metadata data into one string
func (m *Metadata) GetID() string {
	id := ""
	for _, attribute := range m.Attributes {
		if attribute.DisplayType != nil {
			id += *attribute.DisplayType
		}
		id += attribute.TraitType
		id += attribute.Value
	}
	id += *m.Image
	id += *m.Name
	if m.ImageData != nil {
		id += *m.ImageData
	}
	if m.ExternalUrl != nil {
		id += *m.ExternalUrl
	}
	if m.Description != nil {
		id += *m.Description
	}
	if m.BackgroundColor != nil {
		id += *m.BackgroundColor
	}
	if m.AnimationUrl != nil {
		id += *m.AnimationUrl
	}
	if m.YoutubeUrl != nil {
		id += *m.YoutubeUrl
	}
	if m.RoyaltyPercentage != nil {
		id += fmt.Sprintf(":%d", *m.RoyaltyPercentage)
	}
	if m.RoyaltyPaymentAddress != nil {
		id += *m.RoyaltyPaymentAddress
	}
	return id
}

// CalculateHash hashes the values of a Metadata
func (m *Metadata) CalculateHash() ([]byte, error) {
	bytes, err := m.proto_encode()
	if err != nil {
		return nil, errors.Wrap(err, "failed to calculate hash")
	}

	res := crypto.Keccak256(bytes)
	return res, nil
}

// Equals tests for equality of two Metadata
func (m *Metadata) Equals(other merkletree.Content) (bool, error) {
	thisBytes, err := m.proto_encode()
	if err != nil {
		return false, errors.Wrap(err, "failed to proto_encode current metadata to bytes")
	}

	otherBytes, err := other.(*Metadata).proto_encode()
	if err != nil {
		return false, errors.Wrap(err, "failed to proto_encode other metadata to bytes")
	}

	return bytes.Equal(thisBytes, otherBytes), nil
}

func (m *Metadata) ToJSONB() interface{} {
	return map[string]interface{}{}
}

func extractCID(imageURL string) string {
	if len(imageURL) >= 7 && imageURL[:7] == "ipfs://" {
		return imageURL[7:]
	}
	return imageURL
}

package launchpad

import (
	"bytes"
	"encoding/hex"
	"fmt"

	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"
	"github.com/cosmos/gogoproto/proto"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/pkg/errors"
)

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

	fmt.Println(hex.EncodeToString(bytes))

	return bytes, nil
}

// CalculateHash hashes the values of a TestContent
func (m *Metadata) CalculateHash() ([]byte, error) {
	bytes, err := m.proto_encode()
	if err != nil {
		return nil, errors.Wrap(err, "failed to calculate hash")
	}

	res := crypto.Keccak256(bytes)
	return res, nil
}

// Equals tests for equality of two Contents
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

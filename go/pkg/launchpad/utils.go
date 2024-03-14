package launchpad

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"
	"github.com/ethereum/go-ethereum/crypto"
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

func (m *Metadata) serialize() string {
	return m.String()
}

// CalculateHash hashes the values of a TestContent
func (m *Metadata) CalculateHash() ([]byte, error) {
	serialized := m.serialize()
	bytes := []byte(serialized)
	res := crypto.Keccak256(bytes)
	return res, nil
}

// Equals tests for equality of two Contents
func (m *Metadata) Equals(other merkletree.Content) (bool, error) {
	data := m.serialize()
	other_data := other.(*Metadata).serialize()

	return data == other_data, nil
}

func (m *Metadata) ToJSONB() interface{} {
	return map[string]interface{}{}
}

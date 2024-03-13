package launchpad

import (
	"fmt"

	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"
	"github.com/ethereum/go-ethereum/crypto"
)

type Metadata struct {
	Image                 string
	ImageData             string
	ExternalUrl           string
	Description           string
	Name                  string
	Attributes            []*launchpadpb.Trait
	BackgroundColor       string
	AnimationUrl          string
	YoutubeUrl            string
	RoyaltyPercentage     uint64
	RoyaltyPaymentAddress string
}

func (m Metadata) serialize() string {
	// format!("{image}|{image_data}|{external_url}|{description}|{name}|{attributes}|{background_color}|{animation_url}|{youtube_url}|{royalty_percentage}|{royalty_payment_address}")
	attributes := ""

	for _, item := range m.Attributes {
		attr := fmt.Sprintf("%s%s", item.TraitType, item.Value)
		attributes += attr
	}

	return fmt.Sprintf(
		"%s|%s|%s|%s|%s|%s|%s|%s|%s|%d|%s",
		m.Image,
		m.ImageData,
		m.ExternalUrl,
		m.Description,
		m.Name,
		attributes,
		m.BackgroundColor,
		m.AnimationUrl,
		m.YoutubeUrl,
		m.RoyaltyPercentage,
		m.RoyaltyPaymentAddress,
	)
}

// CalculateHash hashes the values of a TestContent
func (m Metadata) CalculateHash() ([]byte, error) {
	serialized := m.serialize()
	bytes := []byte(serialized)
	res := crypto.Keccak256(bytes)
	return res, nil
}

// Equals tests for equality of two Contents
func (m Metadata) Equals(other merkletree.Content) (bool, error) {
	data := m.serialize()
	other_data := other.(Metadata).serialize()

	return data == other_data, nil
}

func (m Metadata) ToJSONB() interface{} {
	return map[string]interface{}{}
}

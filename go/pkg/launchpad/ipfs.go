package launchpad

import (
	"context"
	"fmt"
	"strings"

	"github.com/pkg/errors"
	"golang.org/x/exp/slices"

	remoteClient "github.com/ipfs/boxo/pinning/remote/client"
	"github.com/ipfs/go-cid"
)

type Provider string

const (
	Pinata    Provider = "pinata"
	PinataUrl string   = "https://api.pinata.cloud/psa"
)

type PinningService struct {
	url         string
	bearerToken string
	client      *remoteClient.Client
}

func NewPinningService(provider Provider, bearerToken string) (*PinningService, error) {
	var url string

	switch provider {
	case Pinata:
		url = PinataUrl
	default:
		return nil, errors.New(fmt.Sprintf("unknown provider: %s", provider))
	}

	client := remoteClient.NewClient(url, bearerToken)

	return &PinningService{
		url,
		bearerToken,
		client,
	}, nil
}

func (ps *PinningService) VerifyPinned(cidStrs ...string) (bool, error) {
	ctx := context.Background()
	cids := make([]cid.Cid, len(cidStrs))
	for idx, cidStr := range cidStrs {
		cidObj, err := cid.Decode(cidStr)
		if err != nil {
			return false, errors.Wrap(err, fmt.Sprintf("fail to parse cid: %s", cidStr))
		}
		// LsSync doesn't work with CIDv1, so we convert to CIDv0 to use LsSync
		cidv0 := cid.NewCidV0(cidObj.Hash())
		cids[idx] = cidv0
	}

	pinnedItems, err := ps.client.LsSync(
		ctx,
		remoteClient.PinOpts.FilterCIDs(cids...),
		remoteClient.PinOpts.FilterStatus(remoteClient.StatusPinned),
	)

	if err != nil {
		return false, errors.Wrap(err, "error while fetching pinned items")
	}
	if len(pinnedItems) == 0 {
		return false, errors.New("no pinned items fetched")
	}

	pinnedStrs := make([]string, len(pinnedItems))
	for idx, item := range pinnedItems {
		if string(item.GetStatus()) == remoteClient.StatusPinned.String() {
			// We convert back to CIDv1
			cidv1 := cid.NewCidV1(0x70, item.GetPin().GetCid().Hash())
			pinnedStrs[idx] = cidv1.String()
		}
	}
	var unpinnedCids []string

	// Veryfing given CIDs and pinned ones
	for _, cidStr := range cidStrs {
		if !slices.Contains(pinnedStrs, cidStr) {
			unpinnedCids = append(unpinnedCids, cidStr)
		}
	}

	if len(unpinnedCids) != 0 {
		return false, errors.New(fmt.Sprintf("there exists some unpinned items: %s", strings.Join(unpinnedCids, ",")))
	}

	return true, nil
}

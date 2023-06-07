package indexerhandler

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"math/big"
	"net/http"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/ipfsutil"
	"github.com/TERITORI/teritori-dapp/go/pkg/pricespb"
	"github.com/allegro/bigcache/v3"
	"github.com/pkg/errors"
	abcitypes "github.com/tendermint/tendermint/abci/types"
)

type StringEventAttribute struct {
	Key   string `protobuf:"bytes,1,opt,name=key,proto3" json:"key,omitempty"`
	Value string `protobuf:"bytes,2,opt,name=value,proto3" json:"value,omitempty"`
	Index bool   `protobuf:"varint,3,opt,name=index,proto3" json:"index,omitempty"`
}

type StringEvent struct {
	Type       string                 `protobuf:"bytes,1,opt,name=type,proto3" json:"type,omitempty"`
	Attributes []StringEventAttribute `protobuf:"bytes,2,rep,name=attributes,proto3" json:"attributes,omitempty"`
}

type TendermintTxLog struct {
	Events []StringEvent `json:"events"`
}

func EventsMapFromStringEvents(s []StringEvent) EventsMap {
	m := make(map[string][]string)
	for _, e := range s {
		for _, attr := range e.Attributes {
			key := e.Type + "." + string(attr.Key)
			m[key] = append(m[key], string(attr.Value))
		}
	}
	return m
}

func EventsMapFromEvents(s []abcitypes.Event) EventsMap {
	m := make(map[string][]string)
	for _, e := range s {
		for _, attr := range e.Attributes {
			key := e.Type + "." + string(attr.Key)
			m[key] = append(m[key], string(attr.Value))
		}
	}
	return m
}

type EventsMap map[string][]string

func (em EventsMap) First(key string) (string, error) {
	value := em[key]
	if len(value) == 0 {
		return "", errors.New(fmt.Sprintf("no %s in events", key))
	}
	return value[0], nil
}

func (em EventsMap) InstantiateContractAddress() (string, error) {
	return em.First("instantiate._contract_address")
}

func (em EventsMap) OuterInstantiateCodeID() (string, error) {
	contractAddress, err := em.InstantiateContractAddress()
	if err != nil {
		return "", errors.Wrap(err, "failed to get outer contract address")
	}

	codeIdIndex := -1
	for i, addr := range em["instantiate._contract_address"] {
		if addr == contractAddress {
			codeIdIndex = i
			break
		}
	}
	if codeIdIndex == -1 {
		return "", fmt.Errorf("instantiate code id not found for contract %s", contractAddress)
	}
	codeIds := em["instantiate.code_id"]
	if codeIdIndex >= len(codeIds) {
		return "", fmt.Errorf("not enough code ids, wanted %d, got %d", codeIdIndex+1, len(codeIds))
	}
	codeId := codeIds[codeIdIndex]

	return codeId, nil
}

// TODO: generate these types from schemas

type MinterConfigResponse struct {
	BaseURI            string `json:"nft_base_uri"`
	NFTContractAddress string `json:"nft_addr"`
}

type CollectionInfoResponse struct {
	Name string `json:"name"`
}

type QuerySmartContractResponse struct {
	Data json.RawMessage `json:"data"`
}

type CollectionMetadata struct {
	ImageURI string `json:"image"`
}

type NFTMetadata struct {
	Name     string `json:"name"`
	ImageURI string `json:"image"`
}

func fetchIPFSJSON(uri string, dst interface{}) error {
	jsonURL := ipfsutil.IPFSURIToURL(uri)
	jsonReply, err := http.Get(jsonURL)
	if err != nil {
		return errors.Wrap(err, "failed to GET ipfs json")
	}
	if jsonReply.StatusCode != http.StatusOK {
		return fmt.Errorf("bad GET status: %s", jsonReply.Status)
	}
	jsonBody, err := ioutil.ReadAll(jsonReply.Body)
	if err != nil {
		return errors.Wrap(err, "failed to read ipfs json body")
	}
	if err := json.Unmarshal(jsonBody, dst); err != nil {
		return errors.Wrap(err, "failed to unmarshal ipfs json")
	}
	return nil
}

func (h *Handler) blockTime(height int64) (time.Time, error) {
	cacheKey := fmt.Sprintf("%d", height)

	cached, err := h.config.BlockTimeCache.Get(cacheKey)

	// cache miss
	if err == bigcache.ErrEntryNotFound {
		res, err := h.config.TendermintClient.Block(&height)
		if err != nil {
			return time.Time{}, errors.Wrap(err, "failed to fetch block")
		}
		blockTime := res.Block.Time

		// cache
		binaryBlockTime, err := blockTime.MarshalBinary()
		if err != nil {
			return time.Time{}, errors.Wrap(err, "failed to marshal time as binary")
		}
		if err := h.config.BlockTimeCache.Set(cacheKey, binaryBlockTime); err != nil {
			return time.Time{}, errors.Wrap(err, "failed to set in cache")
		}

		return blockTime, nil
	}

	// cache error
	if err != nil {
		return time.Time{}, errors.Wrap(err, "failed to check cache")
	}

	// cache hit
	blockTime := time.Time{}
	if err := blockTime.UnmarshalBinary(cached); err != nil {
		return time.Time{}, errors.Wrap(err, "failed to unmarshal binary time")
	}
	return blockTime, nil
}

func (h *Handler) HistoricalPrice(denom string, t time.Time) (float64, error) {
	nativeCurrency, err := h.config.NetworkStore.GetNativeCurrency(h.config.Network.ID, denom)
	if err != nil {
		return 0, errors.Wrap(err, "failed to get native currency")
	}

	vsId := "usd"

	res, err := h.config.PricesClient.Prices(context.Background(), &pricespb.PricesRequest{
		Id:    nativeCurrency.CoinGeckoID,
		VsIds: []string{vsId},
		Time:  t.Format(time.RFC3339),
	})
	if err != nil {
		return 0, errors.Wrap(err, "failed to query price")
	}

	price := float64(0)
	for _, p := range res.GetPrices() {
		if p.GetId() == vsId {
			price = p.GetValue()
			break
		}
	}

	return price, nil
}

func (h *Handler) usdAmount(denom string, amount string, t time.Time) (float64, error) {
	// we don't return an error because we shouldn't error-out in case a currency is not registered

	currency, err := h.config.NetworkStore.GetNativeCurrency(h.config.Network.ID, denom)
	if err != nil {
		return 0, errors.Wrap(err, "failed to get native currency")
	}

	// FIXME: this could be more precise
	bigAmount, _, err := big.ParseFloat(amount, 10, 18, big.AwayFromZero)
	if err != nil {
		return 0, errors.Wrap(err, "failed to parse amount into big float")
	}
	divider := big.NewFloat(math.Pow(10, float64(currency.Decimals)))
	bigAmount.Quo(bigAmount, divider)

	coinUSDPrice, err := h.HistoricalPrice(denom, t)
	if err != nil {
		return 0, errors.Wrap(err, "failed to get historical price")
	}
	bigCoinUSDPrice := big.NewFloat(coinUSDPrice)

	bigAmount.Mul(bigAmount, bigCoinUSDPrice)

	usdPrice, _ := bigAmount.Float64()
	return usdPrice, nil
}

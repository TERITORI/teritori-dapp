package indexerhandler

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/ipfsutil"
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

func (em EventsMap) OuterContractAddress() (string, error) {
	wasmAddresses := em["wasm._contract_address"]
	if len(wasmAddresses) == 0 {
		return "", errors.New("no wasm contract addresses in result")
	}
	return wasmAddresses[0], nil
}

func (em EventsMap) InstantiateContractAddress() (string, error) {
	addresses := em["instantiate._contract_address"]
	if len(addresses) == 0 {
		return "", errors.New("no instantiate contract addresses in result")
	}
	return addresses[0], nil
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

func querySmartContract(rpcEndpoint string, dst interface{}, address string, query string) error {
	queryEndpoint := fmt.Sprintf("%s/cosmwasm/wasm/v1/contract/%s/smart/%s", rpcEndpoint, address, base64.StdEncoding.EncodeToString(([]byte(query))))
	reply, err := http.Get(queryEndpoint)
	if err != nil {
		panic(errors.Wrap(err, "failed to query smart contract"))
	}
	body, err := ioutil.ReadAll(reply.Body)
	if err != nil {
		return errors.Wrap(err, "failed to read smart contract query response body")
	}
	var response QuerySmartContractResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return errors.Wrap(err, fmt.Sprintf("failed to unmarshal smart contract query response '%s'", string(body)))
	}
	if response.Data == nil {
		return errors.New("nil data in smart contract query response")
	}
	if err := json.Unmarshal(response.Data, dst); err != nil {
		return errors.Wrap(err, "failed to unmarshal smart contract query response data")
	}
	return nil
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

func uriJoin(base string, paths ...string) string {
	cleanPaths := make([]string, len(paths)+1)
	cleanPaths[0] = strings.TrimRight(base, "/")
	for i, p := range paths {
		cleanPaths[i+1] = strings.TrimRight(strings.TrimLeft(p, "/"), "/")
	}
	return strings.Join(cleanPaths, "/")
}

package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/TERITORI/teritori-dapp/go/internal/ipfsutil"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/pkg/errors"
)

func InputsToJson(method *abi.Method, rawData []byte) ([]byte, error) {
	mapData := make(map[string]interface{})

	err := method.Inputs.UnpackIntoMap(mapData, rawData[4:])
	if err != nil {
		return nil, errors.Wrap(err, "failed to unpack data")
	}

	// Convert map to json string
	jsonStr, err := json.Marshal(mapData)
	if err != nil {
		return nil, errors.Wrap(err, "failed to convert map to string")
	}

	return jsonStr, nil
}

type CollectionMetadata struct {
	ImageURI string `json:"image"`
}

func FetchIPFSJSON(uri string, dst interface{}) error {
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

func ArgsToStruct(args map[string]interface{}, result any) error {
	// Convert map to json string
	jsonStr, err := json.Marshal(args)
	if err != nil {
		return errors.Wrap(err, "failed to convert map to json string")
	}
	if err := json.Unmarshal(jsonStr, result); err != nil {
		return errors.Wrap(err, "failed to decode data")
	}
	return nil
}

func ParseMethod(contractABI *abi.ABI, callInput []byte) (*abi.Method, error) {
	methodSigData := callInput[:4]
	method, err := contractABI.MethodById(methodSigData)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse method name")
	}
	return method, nil
}

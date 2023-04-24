package handlers

import (
	"encoding/json"

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

package tmws

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/pkg/errors"

	"github.com/davecgh/go-spew/spew"
	"github.com/gorilla/websocket"
	tmjson "github.com/tendermint/tendermint/libs/json" // needed for correct unmarshal
	ctypes "github.com/tendermint/tendermint/rpc/core/types"
)

type Client struct {
	nextId int
	conn   *websocket.Conn
}

func NewClient(endpoint string) (*Client, error) {
	conn, _, err := websocket.DefaultDialer.Dial(endpoint, nil)
	if err != nil {
		return nil, errors.Wrap(err, "failed to dial websocket")
	}
	return &Client{
		nextId: 1,
		conn:   conn,
	}, nil
}

func (twc *Client) Block(height *int64) (*ctypes.ResultBlock, error) {
	var result ctypes.ResultBlock
	if err := twc.Call("block", []any{tendermintInt64(height)}, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (twc *Client) Status() (*ctypes.ResultStatus, error) {
	var result ctypes.ResultStatus
	if err := twc.Call("status", nil, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (twc *Client) TxSearch(query string, prove bool, page *int, perPage *int, orderBy string) (*ctypes.ResultTxSearch, error) {
	var result ctypes.ResultTxSearch
	if err := twc.Call("tx_search", []any{query, prove, tendermintInt(page), tendermintInt(perPage), orderBy}, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

type Request struct {
	JSONRPCVersion string `json:"jsonrpc"`
	ID             int    `json:"id"`
	Method         string `json:"method"`
	Params         []any  `json:"params"`
}

type Response struct {
	JSONRPCVersion string          `json:"jsonrpc"`
	ID             int             `json:"id"`
	Result         json.RawMessage `json:"result"`
	Error          any             `json:"error"`
}

func (twc *Client) Call(method string, params []any, result any) error {
	if err := twc.conn.WriteJSON(&Request{
		JSONRPCVersion: "2.0",
		Method:         method,
		Params:         params,
		ID:             twc.nextId,
	}); err != nil {
		return errors.Wrap(err, "failed to write request")
	}

	var response Response

	if err := twc.conn.ReadJSON(&response); err != nil {
		return errors.Wrap(err, "failed to read response")
	}

	if response.Error != nil {
		return fmt.Errorf("error response: %s", spew.Sdump(response.Error))
	}

	if response.ID != twc.nextId {
		return fmt.Errorf("mismatch in response id, expected %d, got %d", twc.nextId, response.ID)
	}

	if err := tmjson.Unmarshal(response.Result, result); err != nil {
		return errors.Wrap(err, "failed to unmarshal result")
	}

	twc.nextId++

	return nil
}

func tendermintInt(val *int) any {
	if val == nil {
		return nil
	}
	return strconv.Itoa(*val)
}

func tendermintInt64(val *int64) any {
	if val == nil {
		return nil
	}
	return strconv.FormatInt(*val, 10)
}

// Code generated by github.com/Khan/genqlient, DO NOT EDIT.

package gnoindexerql

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Khan/genqlient/graphql"
)

// GetPostTransactionsResponse is returned by GetPostTransactions on success.
type GetPostTransactionsResponse struct {
	// Retrieves a list of Transactions that match the given filter criteria. If the result is incomplete due to errors, both partial results and errors are returned.
	Transactions []GetPostTransactionsTransactionsTransaction `json:"transactions"`
}

// GetTransactions returns GetPostTransactionsResponse.Transactions, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsResponse) GetTransactions() []GetPostTransactionsTransactionsTransaction {
	return v.Transactions
}

// GetPostTransactionsTransactionsTransaction includes the requested fields of the GraphQL type Transaction.
// The GraphQL type's documentation follows.
//
// Defines a transaction within a block, detailing its execution specifics and content.
type GetPostTransactionsTransactionsTransaction struct {
	// A sequential index representing the order of this Transaction within its Block. Unique within the context of its Block.
	Index int `json:"index"`
	// Hash from Transaction content in base64 encoding.
	Hash string `json:"hash"`
	// The success can determine whether the transaction succeeded or failed.
	Success bool `json:"success"`
	// The height of the Block in which this Transaction is included. Links the Transaction to its containing Block.
	Block_height int `json:"block_height"`
	// The declared amount of computational effort the sender is willing to pay for executing this Transaction.
	Gas_wanted int `json:"gas_wanted"`
	// The actual amount of computational effort consumed to execute this Transaction. It could be less or equal to `gas_wanted`.
	Gas_used int `json:"gas_used"`
	// `memo` are string information stored within a transaction.
	// `memo` can be utilized to find or distinguish transactions.
	// For example, when trading a specific exchange, you would utilize the memo field of the transaction.
	Memo string `json:"memo"`
	// The payload of a message shows the contents of the messages in a transaction.
	// A message consists of `router`, `type`, and `value` (whose form depends on the `router` and `type`).
	Messages []GetPostTransactionsTransactionsTransactionMessagesTransactionMessage `json:"messages"`
	// `response` is the processing result of the transaction.
	// It has `log`, `info`, `error`, and `data`.
	Response GetPostTransactionsTransactionsTransactionResponse `json:"response"`
}

// GetIndex returns GetPostTransactionsTransactionsTransaction.Index, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetIndex() int { return v.Index }

// GetHash returns GetPostTransactionsTransactionsTransaction.Hash, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetHash() string { return v.Hash }

// GetSuccess returns GetPostTransactionsTransactionsTransaction.Success, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetSuccess() bool { return v.Success }

// GetBlock_height returns GetPostTransactionsTransactionsTransaction.Block_height, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetBlock_height() int { return v.Block_height }

// GetGas_wanted returns GetPostTransactionsTransactionsTransaction.Gas_wanted, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetGas_wanted() int { return v.Gas_wanted }

// GetGas_used returns GetPostTransactionsTransactionsTransaction.Gas_used, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetGas_used() int { return v.Gas_used }

// GetMemo returns GetPostTransactionsTransactionsTransaction.Memo, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetMemo() string { return v.Memo }

// GetMessages returns GetPostTransactionsTransactionsTransaction.Messages, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetMessages() []GetPostTransactionsTransactionsTransactionMessagesTransactionMessage {
	return v.Messages
}

// GetResponse returns GetPostTransactionsTransactionsTransaction.Response, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransaction) GetResponse() GetPostTransactionsTransactionsTransactionResponse {
	return v.Response
}

// GetPostTransactionsTransactionsTransactionMessagesTransactionMessage includes the requested fields of the GraphQL type TransactionMessage.
type GetPostTransactionsTransactionsTransactionMessagesTransactionMessage struct {
	// The type of transaction message.
	// The value of `typeUrl` can be `send`, `exec`, `add_package`, `run`.
	TypeUrl string `json:"typeUrl"`
	// The route of transaction message.
	// The value of `route` can be `bank`, `vm`.
	Route string `json:"route"`
	// MessageValue is the content of the transaction.
	// `value` can be of type `BankMsgSend`, `MsgCall`, `MsgAddPackage`, `MsgRun`, `UnexpectedMessage`.
	Value GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue `json:"-"`
}

// GetTypeUrl returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessage.TypeUrl, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessage) GetTypeUrl() string {
	return v.TypeUrl
}

// GetRoute returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessage.Route, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessage) GetRoute() string {
	return v.Route
}

// GetValue returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessage.Value, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessage) GetValue() GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue {
	return v.Value
}

func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessage) UnmarshalJSON(b []byte) error {

	if string(b) == "null" {
		return nil
	}

	var firstPass struct {
		*GetPostTransactionsTransactionsTransactionMessagesTransactionMessage
		Value json.RawMessage `json:"value"`
		graphql.NoUnmarshalJSON
	}
	firstPass.GetPostTransactionsTransactionsTransactionMessagesTransactionMessage = v

	err := json.Unmarshal(b, &firstPass)
	if err != nil {
		return err
	}

	{
		dst := &v.Value
		src := firstPass.Value
		if len(src) != 0 && string(src) != "null" {
			err = __unmarshalGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue(
				src, dst)
			if err != nil {
				return fmt.Errorf(
					"unable to unmarshal GetPostTransactionsTransactionsTransactionMessagesTransactionMessage.Value: %w", err)
			}
		}
	}
	return nil
}

type __premarshalGetPostTransactionsTransactionsTransactionMessagesTransactionMessage struct {
	TypeUrl string `json:"typeUrl"`

	Route string `json:"route"`

	Value json.RawMessage `json:"value"`
}

func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessage) MarshalJSON() ([]byte, error) {
	premarshaled, err := v.__premarshalJSON()
	if err != nil {
		return nil, err
	}
	return json.Marshal(premarshaled)
}

func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessage) __premarshalJSON() (*__premarshalGetPostTransactionsTransactionsTransactionMessagesTransactionMessage, error) {
	var retval __premarshalGetPostTransactionsTransactionsTransactionMessagesTransactionMessage

	retval.TypeUrl = v.TypeUrl
	retval.Route = v.Route
	{

		dst := &retval.Value
		src := v.Value
		var err error
		*dst, err = __marshalGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue(
			&src)
		if err != nil {
			return nil, fmt.Errorf(
				"unable to marshal GetPostTransactionsTransactionsTransactionMessagesTransactionMessage.Value: %w", err)
		}
	}
	return &retval, nil
}

// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue includes the requested fields of the GraphQL interface MessageValue.
//
// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue is implemented by the following types:
// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend
// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage
// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall
// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun
// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage
type GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue interface {
	implementsGraphQLInterfaceGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue()
	// GetTypename returns the receiver's concrete GraphQL type-name (see interface doc for possible values).
	GetTypename() string
}

func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend) implementsGraphQLInterfaceGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue() {
}
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage) implementsGraphQLInterfaceGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue() {
}
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall) implementsGraphQLInterfaceGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue() {
}
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun) implementsGraphQLInterfaceGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue() {
}
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage) implementsGraphQLInterfaceGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue() {
}

func __unmarshalGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue(b []byte, v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue) error {
	if string(b) == "null" {
		return nil
	}

	var tn struct {
		TypeName string `json:"__typename"`
	}
	err := json.Unmarshal(b, &tn)
	if err != nil {
		return err
	}

	switch tn.TypeName {
	case "BankMsgSend":
		*v = new(GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend)
		return json.Unmarshal(b, *v)
	case "MsgAddPackage":
		*v = new(GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage)
		return json.Unmarshal(b, *v)
	case "MsgCall":
		*v = new(GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall)
		return json.Unmarshal(b, *v)
	case "MsgRun":
		*v = new(GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun)
		return json.Unmarshal(b, *v)
	case "UnexpectedMessage":
		*v = new(GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage)
		return json.Unmarshal(b, *v)
	case "":
		return fmt.Errorf(
			"response was missing MessageValue.__typename")
	default:
		return fmt.Errorf(
			`unexpected concrete type for GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue: "%v"`, tn.TypeName)
	}
}

func __marshalGetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue(v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue) ([]byte, error) {

	var typename string
	switch v := (*v).(type) {
	case *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend:
		typename = "BankMsgSend"

		result := struct {
			TypeName string `json:"__typename"`
			*GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend
		}{typename, v}
		return json.Marshal(result)
	case *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage:
		typename = "MsgAddPackage"

		result := struct {
			TypeName string `json:"__typename"`
			*GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage
		}{typename, v}
		return json.Marshal(result)
	case *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall:
		typename = "MsgCall"

		result := struct {
			TypeName string `json:"__typename"`
			*GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall
		}{typename, v}
		return json.Marshal(result)
	case *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun:
		typename = "MsgRun"

		result := struct {
			TypeName string `json:"__typename"`
			*GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun
		}{typename, v}
		return json.Marshal(result)
	case *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage:
		typename = "UnexpectedMessage"

		result := struct {
			TypeName string `json:"__typename"`
			*GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage
		}{typename, v}
		return json.Marshal(result)
	case nil:
		return []byte("null"), nil
	default:
		return nil, fmt.Errorf(
			`unexpected concrete type for GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValue: "%T"`, v)
	}
}

// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend includes the requested fields of the GraphQL type BankMsgSend.
// The GraphQL type's documentation follows.
//
// `BankMsgSend` is a message with a message router of `bank` and a message type of `send`.
// `BankMsgSend` is the fund transfer tx message.
type GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend struct {
	Typename string `json:"__typename"`
}

// GetTypename returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend.Typename, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueBankMsgSend) GetTypename() string {
	return v.Typename
}

// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage includes the requested fields of the GraphQL type MsgAddPackage.
// The GraphQL type's documentation follows.
//
// `MsgAddPackage` is a message with a message router of `vm` and a message type of `add_package`.
// `MsgAddPackage` is the package deployment tx message.
type GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage struct {
	Typename string `json:"__typename"`
}

// GetTypename returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage.Typename, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage) GetTypename() string {
	return v.Typename
}

// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall includes the requested fields of the GraphQL type MsgCall.
// The GraphQL type's documentation follows.
//
// `MsgCall` is a message with a message router of `vm` and a message type of `exec`.
// `MsgCall` is the method invocation tx message.
type GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall struct {
	Typename string `json:"__typename"`
	// the bech32 address of the function caller.
	// ex) `g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5`
	Caller string `json:"caller"`
	// the amount of funds to be deposited to the package, if any ("<amount><denomination>").
	// ex) `1000000ugnot`
	Send string `json:"send"`
	// the gno package path.
	Pkg_path string `json:"pkg_path"`
	// the function name being invoked.
	Func string `json:"func"`
	// `args` are the arguments passed to the executed function.
	Args []string `json:"args"`
}

// GetTypename returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall.Typename, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall) GetTypename() string {
	return v.Typename
}

// GetCaller returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall.Caller, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall) GetCaller() string {
	return v.Caller
}

// GetSend returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall.Send, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall) GetSend() string {
	return v.Send
}

// GetPkg_path returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall.Pkg_path, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall) GetPkg_path() string {
	return v.Pkg_path
}

// GetFunc returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall.Func, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall) GetFunc() string {
	return v.Func
}

// GetArgs returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall.Args, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgCall) GetArgs() []string {
	return v.Args
}

// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun includes the requested fields of the GraphQL type MsgRun.
// The GraphQL type's documentation follows.
//
// `MsgRun` is a message with a message router of `vm` and a message type of `run`.
// `MsgRun is the execute arbitrary Gno code tx message`.
type GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun struct {
	Typename string `json:"__typename"`
}

// GetTypename returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun.Typename, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueMsgRun) GetTypename() string {
	return v.Typename
}

// GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage includes the requested fields of the GraphQL type UnexpectedMessage.
// The GraphQL type's documentation follows.
//
// `UnexpectedMessage` is an Undefined Message, which is a message that decoding failed.
type GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage struct {
	Typename string `json:"__typename"`
}

// GetTypename returns GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage.Typename, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionMessagesTransactionMessageValueUnexpectedMessage) GetTypename() string {
	return v.Typename
}

// GetPostTransactionsTransactionsTransactionResponse includes the requested fields of the GraphQL type TransactionResponse.
// The GraphQL type's documentation follows.
//
// `TransactionResponse` is the processing result of the transaction.
// It has `log`, `info`, `error`, and `data`.
type GetPostTransactionsTransactionsTransactionResponse struct {
	// The response data associated with the Transaction execution, if any.
	Data string `json:"data"`
	// The Info associated with the Transaction execution, if any.
	Info string `json:"info"`
	// The log value associated with the Transaction execution, if any.
	Log string `json:"log"`
}

// GetData returns GetPostTransactionsTransactionsTransactionResponse.Data, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionResponse) GetData() string { return v.Data }

// GetInfo returns GetPostTransactionsTransactionsTransactionResponse.Info, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionResponse) GetInfo() string { return v.Info }

// GetLog returns GetPostTransactionsTransactionsTransactionResponse.Log, and is useful for accessing the field via an interface.
func (v *GetPostTransactionsTransactionsTransactionResponse) GetLog() string { return v.Log }

// __GetPostTransactionsInput is used internally by genqlient
type __GetPostTransactionsInput struct {
	StartBlock int    `json:"StartBlock"`
	PkgPath    string `json:"PkgPath"`
}

// GetStartBlock returns __GetPostTransactionsInput.StartBlock, and is useful for accessing the field via an interface.
func (v *__GetPostTransactionsInput) GetStartBlock() int { return v.StartBlock }

// GetPkgPath returns __GetPostTransactionsInput.PkgPath, and is useful for accessing the field via an interface.
func (v *__GetPostTransactionsInput) GetPkgPath() string { return v.PkgPath }

func GetPostTransactions(
	ctx context.Context,
	client graphql.Client,
	StartBlock int,
	PkgPath string,
) (*GetPostTransactionsResponse, error) {
	req := &graphql.Request{
		OpName: "GetPostTransactions",
		Query: `
query GetPostTransactions ($StartBlock: Int!, $PkgPath: String!) {
	transactions(filter: {success:true,messages:{vm_param:{exec:{func:"CreatePost",pkg_path:$PkgPath}}},from_block_height:$StartBlock}) {
		index
		hash
		success
		block_height
		gas_wanted
		gas_used
		memo
		messages {
			typeUrl
			route
			value {
				__typename
				... on MsgCall {
					caller
					send
					pkg_path
					func
					args
				}
			}
		}
		response {
			data
			info
			log
		}
	}
}
`,
		Variables: &__GetPostTransactionsInput{
			StartBlock: StartBlock,
			PkgPath:    PkgPath,
		},
	}
	var err error

	var data GetPostTransactionsResponse
	resp := &graphql.Response{Data: &data}

	err = client.MakeRequest(
		ctx,
		req,
		resp,
	)

	return &data, err
}

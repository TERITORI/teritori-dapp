// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package abi_go

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// AxelarTeritoriNFTMetaData contains all meta data concerning the AxelarTeritoriNFT contract.
var AxelarTeritoriNFTMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"gateway_\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"InvalidAddress\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"NotApprovedByGateway\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"approved\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_fromTokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_toTokenId\",\"type\":\"uint256\"}],\"name\":\"BatchMetadataUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_tokenId\",\"type\":\"uint256\"}],\"name\":\"MetadataUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"commandId\",\"type\":\"bytes32\"},{\"internalType\":\"string\",\"name\":\"sourceChain\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"sourceAddress\",\"type\":\"string\"},{\"internalType\":\"bytes\",\"name\":\"payload\",\"type\":\"bytes\"}],\"name\":\"execute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"commandId\",\"type\":\"bytes32\"},{\"internalType\":\"string\",\"name\":\"sourceChain\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"sourceAddress\",\"type\":\"string\"},{\"internalType\":\"bytes\",\"name\":\"payload\",\"type\":\"bytes\"},{\"internalType\":\"string\",\"name\":\"tokenSymbol\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"executeWithToken\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"gateway\",\"outputs\":[{\"internalType\":\"contractIAxelarGateway\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getApproved\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ownerOf\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// AxelarTeritoriNFTABI is the input ABI used to generate the binding from.
// Deprecated: Use AxelarTeritoriNFTMetaData.ABI instead.
var AxelarTeritoriNFTABI = AxelarTeritoriNFTMetaData.ABI

// AxelarTeritoriNFT is an auto generated Go binding around an Ethereum contract.
type AxelarTeritoriNFT struct {
	AxelarTeritoriNFTCaller     // Read-only binding to the contract
	AxelarTeritoriNFTTransactor // Write-only binding to the contract
	AxelarTeritoriNFTFilterer   // Log filterer for contract events
}

// AxelarTeritoriNFTCaller is an auto generated read-only Go binding around an Ethereum contract.
type AxelarTeritoriNFTCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AxelarTeritoriNFTTransactor is an auto generated write-only Go binding around an Ethereum contract.
type AxelarTeritoriNFTTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AxelarTeritoriNFTFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type AxelarTeritoriNFTFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AxelarTeritoriNFTSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type AxelarTeritoriNFTSession struct {
	Contract     *AxelarTeritoriNFT // Generic contract binding to set the session for
	CallOpts     bind.CallOpts      // Call options to use throughout this session
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// AxelarTeritoriNFTCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type AxelarTeritoriNFTCallerSession struct {
	Contract *AxelarTeritoriNFTCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts            // Call options to use throughout this session
}

// AxelarTeritoriNFTTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type AxelarTeritoriNFTTransactorSession struct {
	Contract     *AxelarTeritoriNFTTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts            // Transaction auth options to use throughout this session
}

// AxelarTeritoriNFTRaw is an auto generated low-level Go binding around an Ethereum contract.
type AxelarTeritoriNFTRaw struct {
	Contract *AxelarTeritoriNFT // Generic contract binding to access the raw methods on
}

// AxelarTeritoriNFTCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type AxelarTeritoriNFTCallerRaw struct {
	Contract *AxelarTeritoriNFTCaller // Generic read-only contract binding to access the raw methods on
}

// AxelarTeritoriNFTTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type AxelarTeritoriNFTTransactorRaw struct {
	Contract *AxelarTeritoriNFTTransactor // Generic write-only contract binding to access the raw methods on
}

// NewAxelarTeritoriNFT creates a new instance of AxelarTeritoriNFT, bound to a specific deployed contract.
func NewAxelarTeritoriNFT(address common.Address, backend bind.ContractBackend) (*AxelarTeritoriNFT, error) {
	contract, err := bindAxelarTeritoriNFT(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFT{AxelarTeritoriNFTCaller: AxelarTeritoriNFTCaller{contract: contract}, AxelarTeritoriNFTTransactor: AxelarTeritoriNFTTransactor{contract: contract}, AxelarTeritoriNFTFilterer: AxelarTeritoriNFTFilterer{contract: contract}}, nil
}

// NewAxelarTeritoriNFTCaller creates a new read-only instance of AxelarTeritoriNFT, bound to a specific deployed contract.
func NewAxelarTeritoriNFTCaller(address common.Address, caller bind.ContractCaller) (*AxelarTeritoriNFTCaller, error) {
	contract, err := bindAxelarTeritoriNFT(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTCaller{contract: contract}, nil
}

// NewAxelarTeritoriNFTTransactor creates a new write-only instance of AxelarTeritoriNFT, bound to a specific deployed contract.
func NewAxelarTeritoriNFTTransactor(address common.Address, transactor bind.ContractTransactor) (*AxelarTeritoriNFTTransactor, error) {
	contract, err := bindAxelarTeritoriNFT(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTTransactor{contract: contract}, nil
}

// NewAxelarTeritoriNFTFilterer creates a new log filterer instance of AxelarTeritoriNFT, bound to a specific deployed contract.
func NewAxelarTeritoriNFTFilterer(address common.Address, filterer bind.ContractFilterer) (*AxelarTeritoriNFTFilterer, error) {
	contract, err := bindAxelarTeritoriNFT(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTFilterer{contract: contract}, nil
}

// bindAxelarTeritoriNFT binds a generic wrapper to an already deployed contract.
func bindAxelarTeritoriNFT(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := AxelarTeritoriNFTMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AxelarTeritoriNFT *AxelarTeritoriNFTRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AxelarTeritoriNFT.Contract.AxelarTeritoriNFTCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AxelarTeritoriNFT *AxelarTeritoriNFTRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.AxelarTeritoriNFTTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AxelarTeritoriNFT *AxelarTeritoriNFTRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.AxelarTeritoriNFTTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AxelarTeritoriNFT.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.contract.Transact(opts, method, params...)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) BalanceOf(opts *bind.CallOpts, owner common.Address) (*big.Int, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "balanceOf", owner)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) BalanceOf(owner common.Address) (*big.Int, error) {
	return _AxelarTeritoriNFT.Contract.BalanceOf(&_AxelarTeritoriNFT.CallOpts, owner)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) BalanceOf(owner common.Address) (*big.Int, error) {
	return _AxelarTeritoriNFT.Contract.BalanceOf(&_AxelarTeritoriNFT.CallOpts, owner)
}

// Gateway is a free data retrieval call binding the contract method 0x116191b6.
//
// Solidity: function gateway() view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) Gateway(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "gateway")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Gateway is a free data retrieval call binding the contract method 0x116191b6.
//
// Solidity: function gateway() view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) Gateway() (common.Address, error) {
	return _AxelarTeritoriNFT.Contract.Gateway(&_AxelarTeritoriNFT.CallOpts)
}

// Gateway is a free data retrieval call binding the contract method 0x116191b6.
//
// Solidity: function gateway() view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) Gateway() (common.Address, error) {
	return _AxelarTeritoriNFT.Contract.Gateway(&_AxelarTeritoriNFT.CallOpts)
}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) GetApproved(opts *bind.CallOpts, tokenId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "getApproved", tokenId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) GetApproved(tokenId *big.Int) (common.Address, error) {
	return _AxelarTeritoriNFT.Contract.GetApproved(&_AxelarTeritoriNFT.CallOpts, tokenId)
}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) GetApproved(tokenId *big.Int) (common.Address, error) {
	return _AxelarTeritoriNFT.Contract.GetApproved(&_AxelarTeritoriNFT.CallOpts, tokenId)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) IsApprovedForAll(opts *bind.CallOpts, owner common.Address, operator common.Address) (bool, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "isApprovedForAll", owner, operator)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) IsApprovedForAll(owner common.Address, operator common.Address) (bool, error) {
	return _AxelarTeritoriNFT.Contract.IsApprovedForAll(&_AxelarTeritoriNFT.CallOpts, owner, operator)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) IsApprovedForAll(owner common.Address, operator common.Address) (bool, error) {
	return _AxelarTeritoriNFT.Contract.IsApprovedForAll(&_AxelarTeritoriNFT.CallOpts, owner, operator)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) Name() (string, error) {
	return _AxelarTeritoriNFT.Contract.Name(&_AxelarTeritoriNFT.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) Name() (string, error) {
	return _AxelarTeritoriNFT.Contract.Name(&_AxelarTeritoriNFT.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) Owner() (common.Address, error) {
	return _AxelarTeritoriNFT.Contract.Owner(&_AxelarTeritoriNFT.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) Owner() (common.Address, error) {
	return _AxelarTeritoriNFT.Contract.Owner(&_AxelarTeritoriNFT.CallOpts)
}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) OwnerOf(opts *bind.CallOpts, tokenId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "ownerOf", tokenId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) OwnerOf(tokenId *big.Int) (common.Address, error) {
	return _AxelarTeritoriNFT.Contract.OwnerOf(&_AxelarTeritoriNFT.CallOpts, tokenId)
}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) OwnerOf(tokenId *big.Int) (common.Address, error) {
	return _AxelarTeritoriNFT.Contract.OwnerOf(&_AxelarTeritoriNFT.CallOpts, tokenId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _AxelarTeritoriNFT.Contract.SupportsInterface(&_AxelarTeritoriNFT.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _AxelarTeritoriNFT.Contract.SupportsInterface(&_AxelarTeritoriNFT.CallOpts, interfaceId)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) Symbol(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "symbol")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) Symbol() (string, error) {
	return _AxelarTeritoriNFT.Contract.Symbol(&_AxelarTeritoriNFT.CallOpts)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) Symbol() (string, error) {
	return _AxelarTeritoriNFT.Contract.Symbol(&_AxelarTeritoriNFT.CallOpts)
}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCaller) TokenURI(opts *bind.CallOpts, tokenId *big.Int) (string, error) {
	var out []interface{}
	err := _AxelarTeritoriNFT.contract.Call(opts, &out, "tokenURI", tokenId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) TokenURI(tokenId *big.Int) (string, error) {
	return _AxelarTeritoriNFT.Contract.TokenURI(&_AxelarTeritoriNFT.CallOpts, tokenId)
}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTCallerSession) TokenURI(tokenId *big.Int) (string, error) {
	return _AxelarTeritoriNFT.Contract.TokenURI(&_AxelarTeritoriNFT.CallOpts, tokenId)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) Approve(opts *bind.TransactOpts, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "approve", to, tokenId)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) Approve(to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.Approve(&_AxelarTeritoriNFT.TransactOpts, to, tokenId)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) Approve(to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.Approve(&_AxelarTeritoriNFT.TransactOpts, to, tokenId)
}

// Execute is a paid mutator transaction binding the contract method 0x49160658.
//
// Solidity: function execute(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) Execute(opts *bind.TransactOpts, commandId [32]byte, sourceChain string, sourceAddress string, payload []byte) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "execute", commandId, sourceChain, sourceAddress, payload)
}

// Execute is a paid mutator transaction binding the contract method 0x49160658.
//
// Solidity: function execute(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) Execute(commandId [32]byte, sourceChain string, sourceAddress string, payload []byte) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.Execute(&_AxelarTeritoriNFT.TransactOpts, commandId, sourceChain, sourceAddress, payload)
}

// Execute is a paid mutator transaction binding the contract method 0x49160658.
//
// Solidity: function execute(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) Execute(commandId [32]byte, sourceChain string, sourceAddress string, payload []byte) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.Execute(&_AxelarTeritoriNFT.TransactOpts, commandId, sourceChain, sourceAddress, payload)
}

// ExecuteWithToken is a paid mutator transaction binding the contract method 0x1a98b2e0.
//
// Solidity: function executeWithToken(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload, string tokenSymbol, uint256 amount) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) ExecuteWithToken(opts *bind.TransactOpts, commandId [32]byte, sourceChain string, sourceAddress string, payload []byte, tokenSymbol string, amount *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "executeWithToken", commandId, sourceChain, sourceAddress, payload, tokenSymbol, amount)
}

// ExecuteWithToken is a paid mutator transaction binding the contract method 0x1a98b2e0.
//
// Solidity: function executeWithToken(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload, string tokenSymbol, uint256 amount) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) ExecuteWithToken(commandId [32]byte, sourceChain string, sourceAddress string, payload []byte, tokenSymbol string, amount *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.ExecuteWithToken(&_AxelarTeritoriNFT.TransactOpts, commandId, sourceChain, sourceAddress, payload, tokenSymbol, amount)
}

// ExecuteWithToken is a paid mutator transaction binding the contract method 0x1a98b2e0.
//
// Solidity: function executeWithToken(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload, string tokenSymbol, uint256 amount) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) ExecuteWithToken(commandId [32]byte, sourceChain string, sourceAddress string, payload []byte, tokenSymbol string, amount *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.ExecuteWithToken(&_AxelarTeritoriNFT.TransactOpts, commandId, sourceChain, sourceAddress, payload, tokenSymbol, amount)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) RenounceOwnership() (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.RenounceOwnership(&_AxelarTeritoriNFT.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.RenounceOwnership(&_AxelarTeritoriNFT.TransactOpts)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) SafeTransferFrom(opts *bind.TransactOpts, from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "safeTransferFrom", from, to, tokenId)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) SafeTransferFrom(from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.SafeTransferFrom(&_AxelarTeritoriNFT.TransactOpts, from, to, tokenId)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) SafeTransferFrom(from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.SafeTransferFrom(&_AxelarTeritoriNFT.TransactOpts, from, to, tokenId)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) SafeTransferFrom0(opts *bind.TransactOpts, from common.Address, to common.Address, tokenId *big.Int, data []byte) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "safeTransferFrom0", from, to, tokenId, data)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) SafeTransferFrom0(from common.Address, to common.Address, tokenId *big.Int, data []byte) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.SafeTransferFrom0(&_AxelarTeritoriNFT.TransactOpts, from, to, tokenId, data)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) SafeTransferFrom0(from common.Address, to common.Address, tokenId *big.Int, data []byte) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.SafeTransferFrom0(&_AxelarTeritoriNFT.TransactOpts, from, to, tokenId, data)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) SetApprovalForAll(opts *bind.TransactOpts, operator common.Address, approved bool) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "setApprovalForAll", operator, approved)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) SetApprovalForAll(operator common.Address, approved bool) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.SetApprovalForAll(&_AxelarTeritoriNFT.TransactOpts, operator, approved)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) SetApprovalForAll(operator common.Address, approved bool) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.SetApprovalForAll(&_AxelarTeritoriNFT.TransactOpts, operator, approved)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) TransferFrom(opts *bind.TransactOpts, from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "transferFrom", from, to, tokenId)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) TransferFrom(from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.TransferFrom(&_AxelarTeritoriNFT.TransactOpts, from, to, tokenId)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 tokenId) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) TransferFrom(from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.TransferFrom(&_AxelarTeritoriNFT.TransactOpts, from, to, tokenId)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.TransferOwnership(&_AxelarTeritoriNFT.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AxelarTeritoriNFT *AxelarTeritoriNFTTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AxelarTeritoriNFT.Contract.TransferOwnership(&_AxelarTeritoriNFT.TransactOpts, newOwner)
}

// AxelarTeritoriNFTApprovalIterator is returned from FilterApproval and is used to iterate over the raw logs and unpacked data for Approval events raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTApprovalIterator struct {
	Event *AxelarTeritoriNFTApproval // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AxelarTeritoriNFTApprovalIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AxelarTeritoriNFTApproval)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AxelarTeritoriNFTApproval)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AxelarTeritoriNFTApprovalIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AxelarTeritoriNFTApprovalIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AxelarTeritoriNFTApproval represents a Approval event raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTApproval struct {
	Owner    common.Address
	Approved common.Address
	TokenId  *big.Int
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApproval is a free log retrieval operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) FilterApproval(opts *bind.FilterOpts, owner []common.Address, approved []common.Address, tokenId []*big.Int) (*AxelarTeritoriNFTApprovalIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var approvedRule []interface{}
	for _, approvedItem := range approved {
		approvedRule = append(approvedRule, approvedItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _AxelarTeritoriNFT.contract.FilterLogs(opts, "Approval", ownerRule, approvedRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTApprovalIterator{contract: _AxelarTeritoriNFT.contract, event: "Approval", logs: logs, sub: sub}, nil
}

// WatchApproval is a free log subscription operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) WatchApproval(opts *bind.WatchOpts, sink chan<- *AxelarTeritoriNFTApproval, owner []common.Address, approved []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var approvedRule []interface{}
	for _, approvedItem := range approved {
		approvedRule = append(approvedRule, approvedItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _AxelarTeritoriNFT.contract.WatchLogs(opts, "Approval", ownerRule, approvedRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AxelarTeritoriNFTApproval)
				if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "Approval", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApproval is a log parse operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) ParseApproval(log types.Log) (*AxelarTeritoriNFTApproval, error) {
	event := new(AxelarTeritoriNFTApproval)
	if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "Approval", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AxelarTeritoriNFTApprovalForAllIterator is returned from FilterApprovalForAll and is used to iterate over the raw logs and unpacked data for ApprovalForAll events raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTApprovalForAllIterator struct {
	Event *AxelarTeritoriNFTApprovalForAll // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AxelarTeritoriNFTApprovalForAllIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AxelarTeritoriNFTApprovalForAll)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AxelarTeritoriNFTApprovalForAll)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AxelarTeritoriNFTApprovalForAllIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AxelarTeritoriNFTApprovalForAllIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AxelarTeritoriNFTApprovalForAll represents a ApprovalForAll event raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTApprovalForAll struct {
	Owner    common.Address
	Operator common.Address
	Approved bool
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApprovalForAll is a free log retrieval operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) FilterApprovalForAll(opts *bind.FilterOpts, owner []common.Address, operator []common.Address) (*AxelarTeritoriNFTApprovalForAllIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _AxelarTeritoriNFT.contract.FilterLogs(opts, "ApprovalForAll", ownerRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTApprovalForAllIterator{contract: _AxelarTeritoriNFT.contract, event: "ApprovalForAll", logs: logs, sub: sub}, nil
}

// WatchApprovalForAll is a free log subscription operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) WatchApprovalForAll(opts *bind.WatchOpts, sink chan<- *AxelarTeritoriNFTApprovalForAll, owner []common.Address, operator []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _AxelarTeritoriNFT.contract.WatchLogs(opts, "ApprovalForAll", ownerRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AxelarTeritoriNFTApprovalForAll)
				if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApprovalForAll is a log parse operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) ParseApprovalForAll(log types.Log) (*AxelarTeritoriNFTApprovalForAll, error) {
	event := new(AxelarTeritoriNFTApprovalForAll)
	if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AxelarTeritoriNFTBatchMetadataUpdateIterator is returned from FilterBatchMetadataUpdate and is used to iterate over the raw logs and unpacked data for BatchMetadataUpdate events raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTBatchMetadataUpdateIterator struct {
	Event *AxelarTeritoriNFTBatchMetadataUpdate // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AxelarTeritoriNFTBatchMetadataUpdateIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AxelarTeritoriNFTBatchMetadataUpdate)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AxelarTeritoriNFTBatchMetadataUpdate)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AxelarTeritoriNFTBatchMetadataUpdateIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AxelarTeritoriNFTBatchMetadataUpdateIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AxelarTeritoriNFTBatchMetadataUpdate represents a BatchMetadataUpdate event raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTBatchMetadataUpdate struct {
	FromTokenId *big.Int
	ToTokenId   *big.Int
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterBatchMetadataUpdate is a free log retrieval operation binding the contract event 0x6bd5c950a8d8df17f772f5af37cb3655737899cbf903264b9795592da439661c.
//
// Solidity: event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) FilterBatchMetadataUpdate(opts *bind.FilterOpts) (*AxelarTeritoriNFTBatchMetadataUpdateIterator, error) {

	logs, sub, err := _AxelarTeritoriNFT.contract.FilterLogs(opts, "BatchMetadataUpdate")
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTBatchMetadataUpdateIterator{contract: _AxelarTeritoriNFT.contract, event: "BatchMetadataUpdate", logs: logs, sub: sub}, nil
}

// WatchBatchMetadataUpdate is a free log subscription operation binding the contract event 0x6bd5c950a8d8df17f772f5af37cb3655737899cbf903264b9795592da439661c.
//
// Solidity: event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) WatchBatchMetadataUpdate(opts *bind.WatchOpts, sink chan<- *AxelarTeritoriNFTBatchMetadataUpdate) (event.Subscription, error) {

	logs, sub, err := _AxelarTeritoriNFT.contract.WatchLogs(opts, "BatchMetadataUpdate")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AxelarTeritoriNFTBatchMetadataUpdate)
				if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "BatchMetadataUpdate", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseBatchMetadataUpdate is a log parse operation binding the contract event 0x6bd5c950a8d8df17f772f5af37cb3655737899cbf903264b9795592da439661c.
//
// Solidity: event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) ParseBatchMetadataUpdate(log types.Log) (*AxelarTeritoriNFTBatchMetadataUpdate, error) {
	event := new(AxelarTeritoriNFTBatchMetadataUpdate)
	if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "BatchMetadataUpdate", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AxelarTeritoriNFTMetadataUpdateIterator is returned from FilterMetadataUpdate and is used to iterate over the raw logs and unpacked data for MetadataUpdate events raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTMetadataUpdateIterator struct {
	Event *AxelarTeritoriNFTMetadataUpdate // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AxelarTeritoriNFTMetadataUpdateIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AxelarTeritoriNFTMetadataUpdate)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AxelarTeritoriNFTMetadataUpdate)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AxelarTeritoriNFTMetadataUpdateIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AxelarTeritoriNFTMetadataUpdateIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AxelarTeritoriNFTMetadataUpdate represents a MetadataUpdate event raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTMetadataUpdate struct {
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterMetadataUpdate is a free log retrieval operation binding the contract event 0xf8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7.
//
// Solidity: event MetadataUpdate(uint256 _tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) FilterMetadataUpdate(opts *bind.FilterOpts) (*AxelarTeritoriNFTMetadataUpdateIterator, error) {

	logs, sub, err := _AxelarTeritoriNFT.contract.FilterLogs(opts, "MetadataUpdate")
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTMetadataUpdateIterator{contract: _AxelarTeritoriNFT.contract, event: "MetadataUpdate", logs: logs, sub: sub}, nil
}

// WatchMetadataUpdate is a free log subscription operation binding the contract event 0xf8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7.
//
// Solidity: event MetadataUpdate(uint256 _tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) WatchMetadataUpdate(opts *bind.WatchOpts, sink chan<- *AxelarTeritoriNFTMetadataUpdate) (event.Subscription, error) {

	logs, sub, err := _AxelarTeritoriNFT.contract.WatchLogs(opts, "MetadataUpdate")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AxelarTeritoriNFTMetadataUpdate)
				if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "MetadataUpdate", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseMetadataUpdate is a log parse operation binding the contract event 0xf8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7.
//
// Solidity: event MetadataUpdate(uint256 _tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) ParseMetadataUpdate(log types.Log) (*AxelarTeritoriNFTMetadataUpdate, error) {
	event := new(AxelarTeritoriNFTMetadataUpdate)
	if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "MetadataUpdate", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AxelarTeritoriNFTOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTOwnershipTransferredIterator struct {
	Event *AxelarTeritoriNFTOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AxelarTeritoriNFTOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AxelarTeritoriNFTOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AxelarTeritoriNFTOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AxelarTeritoriNFTOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AxelarTeritoriNFTOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AxelarTeritoriNFTOwnershipTransferred represents a OwnershipTransferred event raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*AxelarTeritoriNFTOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AxelarTeritoriNFT.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTOwnershipTransferredIterator{contract: _AxelarTeritoriNFT.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *AxelarTeritoriNFTOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AxelarTeritoriNFT.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AxelarTeritoriNFTOwnershipTransferred)
				if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) ParseOwnershipTransferred(log types.Log) (*AxelarTeritoriNFTOwnershipTransferred, error) {
	event := new(AxelarTeritoriNFTOwnershipTransferred)
	if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AxelarTeritoriNFTTransferIterator is returned from FilterTransfer and is used to iterate over the raw logs and unpacked data for Transfer events raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTTransferIterator struct {
	Event *AxelarTeritoriNFTTransfer // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AxelarTeritoriNFTTransferIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AxelarTeritoriNFTTransfer)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AxelarTeritoriNFTTransfer)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AxelarTeritoriNFTTransferIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AxelarTeritoriNFTTransferIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AxelarTeritoriNFTTransfer represents a Transfer event raised by the AxelarTeritoriNFT contract.
type AxelarTeritoriNFTTransfer struct {
	From    common.Address
	To      common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterTransfer is a free log retrieval operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) FilterTransfer(opts *bind.FilterOpts, from []common.Address, to []common.Address, tokenId []*big.Int) (*AxelarTeritoriNFTTransferIterator, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _AxelarTeritoriNFT.contract.FilterLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &AxelarTeritoriNFTTransferIterator{contract: _AxelarTeritoriNFT.contract, event: "Transfer", logs: logs, sub: sub}, nil
}

// WatchTransfer is a free log subscription operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) WatchTransfer(opts *bind.WatchOpts, sink chan<- *AxelarTeritoriNFTTransfer, from []common.Address, to []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _AxelarTeritoriNFT.contract.WatchLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AxelarTeritoriNFTTransfer)
				if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "Transfer", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransfer is a log parse operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_AxelarTeritoriNFT *AxelarTeritoriNFTFilterer) ParseTransfer(log types.Log) (*AxelarTeritoriNFTTransfer, error) {
	event := new(AxelarTeritoriNFTTransfer)
	if err := _AxelarTeritoriNFT.contract.UnpackLog(event, "Transfer", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

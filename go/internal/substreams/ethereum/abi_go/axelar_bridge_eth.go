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

// AxelarBridgeETHMetaData contains all meta data concerning the AxelarBridgeETH contract.
var AxelarBridgeETHMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"gateway_\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"gasService_\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"InvalidAddress\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"NotApprovedByGateway\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnableInvalidOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"OwnableUnauthorizedAccount\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_tokenId\",\"type\":\"uint256\"}],\"name\":\"bridgeNft\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"commandId\",\"type\":\"bytes32\"},{\"internalType\":\"string\",\"name\":\"sourceChain\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"sourceAddress\",\"type\":\"string\"},{\"internalType\":\"bytes\",\"name\":\"payload\",\"type\":\"bytes\"}],\"name\":\"execute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"commandId\",\"type\":\"bytes32\"},{\"internalType\":\"string\",\"name\":\"sourceChain\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"sourceAddress\",\"type\":\"string\"},{\"internalType\":\"bytes\",\"name\":\"payload\",\"type\":\"bytes\"},{\"internalType\":\"string\",\"name\":\"tokenSymbol\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"executeWithToken\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"gasService\",\"outputs\":[{\"internalType\":\"contractIAxelarGasService\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"gateway\",\"outputs\":[{\"internalType\":\"contractIAxelarGateway\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"riotNftEthAddress\",\"outputs\":[{\"internalType\":\"contractriotNftEth\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"riotNftPolyAddress\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_riotNftEth\",\"type\":\"address\"}],\"name\":\"setRiotNftEthAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_riotNftPoly\",\"type\":\"string\"}],\"name\":\"setRiotNftPolyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// AxelarBridgeETHABI is the input ABI used to generate the binding from.
// Deprecated: Use AxelarBridgeETHMetaData.ABI instead.
var AxelarBridgeETHABI = AxelarBridgeETHMetaData.ABI

// AxelarBridgeETH is an auto generated Go binding around an Ethereum contract.
type AxelarBridgeETH struct {
	AxelarBridgeETHCaller     // Read-only binding to the contract
	AxelarBridgeETHTransactor // Write-only binding to the contract
	AxelarBridgeETHFilterer   // Log filterer for contract events
}

// AxelarBridgeETHCaller is an auto generated read-only Go binding around an Ethereum contract.
type AxelarBridgeETHCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AxelarBridgeETHTransactor is an auto generated write-only Go binding around an Ethereum contract.
type AxelarBridgeETHTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AxelarBridgeETHFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type AxelarBridgeETHFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AxelarBridgeETHSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type AxelarBridgeETHSession struct {
	Contract     *AxelarBridgeETH  // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// AxelarBridgeETHCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type AxelarBridgeETHCallerSession struct {
	Contract *AxelarBridgeETHCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts          // Call options to use throughout this session
}

// AxelarBridgeETHTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type AxelarBridgeETHTransactorSession struct {
	Contract     *AxelarBridgeETHTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts          // Transaction auth options to use throughout this session
}

// AxelarBridgeETHRaw is an auto generated low-level Go binding around an Ethereum contract.
type AxelarBridgeETHRaw struct {
	Contract *AxelarBridgeETH // Generic contract binding to access the raw methods on
}

// AxelarBridgeETHCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type AxelarBridgeETHCallerRaw struct {
	Contract *AxelarBridgeETHCaller // Generic read-only contract binding to access the raw methods on
}

// AxelarBridgeETHTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type AxelarBridgeETHTransactorRaw struct {
	Contract *AxelarBridgeETHTransactor // Generic write-only contract binding to access the raw methods on
}

// NewAxelarBridgeETH creates a new instance of AxelarBridgeETH, bound to a specific deployed contract.
func NewAxelarBridgeETH(address common.Address, backend bind.ContractBackend) (*AxelarBridgeETH, error) {
	contract, err := bindAxelarBridgeETH(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &AxelarBridgeETH{AxelarBridgeETHCaller: AxelarBridgeETHCaller{contract: contract}, AxelarBridgeETHTransactor: AxelarBridgeETHTransactor{contract: contract}, AxelarBridgeETHFilterer: AxelarBridgeETHFilterer{contract: contract}}, nil
}

// NewAxelarBridgeETHCaller creates a new read-only instance of AxelarBridgeETH, bound to a specific deployed contract.
func NewAxelarBridgeETHCaller(address common.Address, caller bind.ContractCaller) (*AxelarBridgeETHCaller, error) {
	contract, err := bindAxelarBridgeETH(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &AxelarBridgeETHCaller{contract: contract}, nil
}

// NewAxelarBridgeETHTransactor creates a new write-only instance of AxelarBridgeETH, bound to a specific deployed contract.
func NewAxelarBridgeETHTransactor(address common.Address, transactor bind.ContractTransactor) (*AxelarBridgeETHTransactor, error) {
	contract, err := bindAxelarBridgeETH(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &AxelarBridgeETHTransactor{contract: contract}, nil
}

// NewAxelarBridgeETHFilterer creates a new log filterer instance of AxelarBridgeETH, bound to a specific deployed contract.
func NewAxelarBridgeETHFilterer(address common.Address, filterer bind.ContractFilterer) (*AxelarBridgeETHFilterer, error) {
	contract, err := bindAxelarBridgeETH(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &AxelarBridgeETHFilterer{contract: contract}, nil
}

// bindAxelarBridgeETH binds a generic wrapper to an already deployed contract.
func bindAxelarBridgeETH(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := AxelarBridgeETHMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AxelarBridgeETH *AxelarBridgeETHRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AxelarBridgeETH.Contract.AxelarBridgeETHCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AxelarBridgeETH *AxelarBridgeETHRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.AxelarBridgeETHTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AxelarBridgeETH *AxelarBridgeETHRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.AxelarBridgeETHTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AxelarBridgeETH *AxelarBridgeETHCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AxelarBridgeETH.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AxelarBridgeETH *AxelarBridgeETHTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AxelarBridgeETH *AxelarBridgeETHTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.contract.Transact(opts, method, params...)
}

// GasService is a free data retrieval call binding the contract method 0x6a22d8cc.
//
// Solidity: function gasService() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHCaller) GasService(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AxelarBridgeETH.contract.Call(opts, &out, "gasService")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GasService is a free data retrieval call binding the contract method 0x6a22d8cc.
//
// Solidity: function gasService() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHSession) GasService() (common.Address, error) {
	return _AxelarBridgeETH.Contract.GasService(&_AxelarBridgeETH.CallOpts)
}

// GasService is a free data retrieval call binding the contract method 0x6a22d8cc.
//
// Solidity: function gasService() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHCallerSession) GasService() (common.Address, error) {
	return _AxelarBridgeETH.Contract.GasService(&_AxelarBridgeETH.CallOpts)
}

// Gateway is a free data retrieval call binding the contract method 0x116191b6.
//
// Solidity: function gateway() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHCaller) Gateway(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AxelarBridgeETH.contract.Call(opts, &out, "gateway")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Gateway is a free data retrieval call binding the contract method 0x116191b6.
//
// Solidity: function gateway() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHSession) Gateway() (common.Address, error) {
	return _AxelarBridgeETH.Contract.Gateway(&_AxelarBridgeETH.CallOpts)
}

// Gateway is a free data retrieval call binding the contract method 0x116191b6.
//
// Solidity: function gateway() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHCallerSession) Gateway() (common.Address, error) {
	return _AxelarBridgeETH.Contract.Gateway(&_AxelarBridgeETH.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AxelarBridgeETH.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHSession) Owner() (common.Address, error) {
	return _AxelarBridgeETH.Contract.Owner(&_AxelarBridgeETH.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHCallerSession) Owner() (common.Address, error) {
	return _AxelarBridgeETH.Contract.Owner(&_AxelarBridgeETH.CallOpts)
}

// RiotNftEthAddress is a free data retrieval call binding the contract method 0x9f2638fe.
//
// Solidity: function riotNftEthAddress() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHCaller) RiotNftEthAddress(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AxelarBridgeETH.contract.Call(opts, &out, "riotNftEthAddress")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// RiotNftEthAddress is a free data retrieval call binding the contract method 0x9f2638fe.
//
// Solidity: function riotNftEthAddress() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHSession) RiotNftEthAddress() (common.Address, error) {
	return _AxelarBridgeETH.Contract.RiotNftEthAddress(&_AxelarBridgeETH.CallOpts)
}

// RiotNftEthAddress is a free data retrieval call binding the contract method 0x9f2638fe.
//
// Solidity: function riotNftEthAddress() view returns(address)
func (_AxelarBridgeETH *AxelarBridgeETHCallerSession) RiotNftEthAddress() (common.Address, error) {
	return _AxelarBridgeETH.Contract.RiotNftEthAddress(&_AxelarBridgeETH.CallOpts)
}

// RiotNftPolyAddress is a free data retrieval call binding the contract method 0xfa59b6ba.
//
// Solidity: function riotNftPolyAddress() view returns(string)
func (_AxelarBridgeETH *AxelarBridgeETHCaller) RiotNftPolyAddress(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _AxelarBridgeETH.contract.Call(opts, &out, "riotNftPolyAddress")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// RiotNftPolyAddress is a free data retrieval call binding the contract method 0xfa59b6ba.
//
// Solidity: function riotNftPolyAddress() view returns(string)
func (_AxelarBridgeETH *AxelarBridgeETHSession) RiotNftPolyAddress() (string, error) {
	return _AxelarBridgeETH.Contract.RiotNftPolyAddress(&_AxelarBridgeETH.CallOpts)
}

// RiotNftPolyAddress is a free data retrieval call binding the contract method 0xfa59b6ba.
//
// Solidity: function riotNftPolyAddress() view returns(string)
func (_AxelarBridgeETH *AxelarBridgeETHCallerSession) RiotNftPolyAddress() (string, error) {
	return _AxelarBridgeETH.Contract.RiotNftPolyAddress(&_AxelarBridgeETH.CallOpts)
}

// BridgeNft is a paid mutator transaction binding the contract method 0x365301fe.
//
// Solidity: function bridgeNft(uint256 _tokenId) payable returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactor) BridgeNft(opts *bind.TransactOpts, _tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarBridgeETH.contract.Transact(opts, "bridgeNft", _tokenId)
}

// BridgeNft is a paid mutator transaction binding the contract method 0x365301fe.
//
// Solidity: function bridgeNft(uint256 _tokenId) payable returns()
func (_AxelarBridgeETH *AxelarBridgeETHSession) BridgeNft(_tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.BridgeNft(&_AxelarBridgeETH.TransactOpts, _tokenId)
}

// BridgeNft is a paid mutator transaction binding the contract method 0x365301fe.
//
// Solidity: function bridgeNft(uint256 _tokenId) payable returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactorSession) BridgeNft(_tokenId *big.Int) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.BridgeNft(&_AxelarBridgeETH.TransactOpts, _tokenId)
}

// Execute is a paid mutator transaction binding the contract method 0x49160658.
//
// Solidity: function execute(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactor) Execute(opts *bind.TransactOpts, commandId [32]byte, sourceChain string, sourceAddress string, payload []byte) (*types.Transaction, error) {
	return _AxelarBridgeETH.contract.Transact(opts, "execute", commandId, sourceChain, sourceAddress, payload)
}

// Execute is a paid mutator transaction binding the contract method 0x49160658.
//
// Solidity: function execute(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload) returns()
func (_AxelarBridgeETH *AxelarBridgeETHSession) Execute(commandId [32]byte, sourceChain string, sourceAddress string, payload []byte) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.Execute(&_AxelarBridgeETH.TransactOpts, commandId, sourceChain, sourceAddress, payload)
}

// Execute is a paid mutator transaction binding the contract method 0x49160658.
//
// Solidity: function execute(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactorSession) Execute(commandId [32]byte, sourceChain string, sourceAddress string, payload []byte) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.Execute(&_AxelarBridgeETH.TransactOpts, commandId, sourceChain, sourceAddress, payload)
}

// ExecuteWithToken is a paid mutator transaction binding the contract method 0x1a98b2e0.
//
// Solidity: function executeWithToken(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload, string tokenSymbol, uint256 amount) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactor) ExecuteWithToken(opts *bind.TransactOpts, commandId [32]byte, sourceChain string, sourceAddress string, payload []byte, tokenSymbol string, amount *big.Int) (*types.Transaction, error) {
	return _AxelarBridgeETH.contract.Transact(opts, "executeWithToken", commandId, sourceChain, sourceAddress, payload, tokenSymbol, amount)
}

// ExecuteWithToken is a paid mutator transaction binding the contract method 0x1a98b2e0.
//
// Solidity: function executeWithToken(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload, string tokenSymbol, uint256 amount) returns()
func (_AxelarBridgeETH *AxelarBridgeETHSession) ExecuteWithToken(commandId [32]byte, sourceChain string, sourceAddress string, payload []byte, tokenSymbol string, amount *big.Int) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.ExecuteWithToken(&_AxelarBridgeETH.TransactOpts, commandId, sourceChain, sourceAddress, payload, tokenSymbol, amount)
}

// ExecuteWithToken is a paid mutator transaction binding the contract method 0x1a98b2e0.
//
// Solidity: function executeWithToken(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload, string tokenSymbol, uint256 amount) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactorSession) ExecuteWithToken(commandId [32]byte, sourceChain string, sourceAddress string, payload []byte, tokenSymbol string, amount *big.Int) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.ExecuteWithToken(&_AxelarBridgeETH.TransactOpts, commandId, sourceChain, sourceAddress, payload, tokenSymbol, amount)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AxelarBridgeETH.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AxelarBridgeETH *AxelarBridgeETHSession) RenounceOwnership() (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.RenounceOwnership(&_AxelarBridgeETH.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.RenounceOwnership(&_AxelarBridgeETH.TransactOpts)
}

// SetRiotNftEthAddress is a paid mutator transaction binding the contract method 0x6c790c76.
//
// Solidity: function setRiotNftEthAddress(address _riotNftEth) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactor) SetRiotNftEthAddress(opts *bind.TransactOpts, _riotNftEth common.Address) (*types.Transaction, error) {
	return _AxelarBridgeETH.contract.Transact(opts, "setRiotNftEthAddress", _riotNftEth)
}

// SetRiotNftEthAddress is a paid mutator transaction binding the contract method 0x6c790c76.
//
// Solidity: function setRiotNftEthAddress(address _riotNftEth) returns()
func (_AxelarBridgeETH *AxelarBridgeETHSession) SetRiotNftEthAddress(_riotNftEth common.Address) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.SetRiotNftEthAddress(&_AxelarBridgeETH.TransactOpts, _riotNftEth)
}

// SetRiotNftEthAddress is a paid mutator transaction binding the contract method 0x6c790c76.
//
// Solidity: function setRiotNftEthAddress(address _riotNftEth) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactorSession) SetRiotNftEthAddress(_riotNftEth common.Address) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.SetRiotNftEthAddress(&_AxelarBridgeETH.TransactOpts, _riotNftEth)
}

// SetRiotNftPolyAddress is a paid mutator transaction binding the contract method 0xf58cda74.
//
// Solidity: function setRiotNftPolyAddress(string _riotNftPoly) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactor) SetRiotNftPolyAddress(opts *bind.TransactOpts, _riotNftPoly string) (*types.Transaction, error) {
	return _AxelarBridgeETH.contract.Transact(opts, "setRiotNftPolyAddress", _riotNftPoly)
}

// SetRiotNftPolyAddress is a paid mutator transaction binding the contract method 0xf58cda74.
//
// Solidity: function setRiotNftPolyAddress(string _riotNftPoly) returns()
func (_AxelarBridgeETH *AxelarBridgeETHSession) SetRiotNftPolyAddress(_riotNftPoly string) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.SetRiotNftPolyAddress(&_AxelarBridgeETH.TransactOpts, _riotNftPoly)
}

// SetRiotNftPolyAddress is a paid mutator transaction binding the contract method 0xf58cda74.
//
// Solidity: function setRiotNftPolyAddress(string _riotNftPoly) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactorSession) SetRiotNftPolyAddress(_riotNftPoly string) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.SetRiotNftPolyAddress(&_AxelarBridgeETH.TransactOpts, _riotNftPoly)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _AxelarBridgeETH.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AxelarBridgeETH *AxelarBridgeETHSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.TransferOwnership(&_AxelarBridgeETH.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AxelarBridgeETH *AxelarBridgeETHTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AxelarBridgeETH.Contract.TransferOwnership(&_AxelarBridgeETH.TransactOpts, newOwner)
}

// AxelarBridgeETHOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the AxelarBridgeETH contract.
type AxelarBridgeETHOwnershipTransferredIterator struct {
	Event *AxelarBridgeETHOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *AxelarBridgeETHOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AxelarBridgeETHOwnershipTransferred)
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
		it.Event = new(AxelarBridgeETHOwnershipTransferred)
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
func (it *AxelarBridgeETHOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AxelarBridgeETHOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AxelarBridgeETHOwnershipTransferred represents a OwnershipTransferred event raised by the AxelarBridgeETH contract.
type AxelarBridgeETHOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AxelarBridgeETH *AxelarBridgeETHFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*AxelarBridgeETHOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AxelarBridgeETH.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &AxelarBridgeETHOwnershipTransferredIterator{contract: _AxelarBridgeETH.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AxelarBridgeETH *AxelarBridgeETHFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *AxelarBridgeETHOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AxelarBridgeETH.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AxelarBridgeETHOwnershipTransferred)
				if err := _AxelarBridgeETH.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_AxelarBridgeETH *AxelarBridgeETHFilterer) ParseOwnershipTransferred(log types.Log) (*AxelarBridgeETHOwnershipTransferred, error) {
	event := new(AxelarBridgeETHOwnershipTransferred)
	if err := _AxelarBridgeETH.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

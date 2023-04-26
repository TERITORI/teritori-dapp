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

// TeritoriMinterConfig is an auto generated low-level Go binding around an user-defined struct.
type TeritoriMinterConfig struct {
	MaxSupply       *big.Int
	MintToken       common.Address
	MintStartTime   *big.Int
	WhitelistCount  *big.Int
	PublicMintPrice *big.Int
	PublicMintMax   *big.Int
}

// TeritoriMinterMintData is an auto generated low-level Go binding around an user-defined struct.
type TeritoriMinterMintData struct {
	TokenId           *big.Int
	RoyaltyReceiver   common.Address
	RoyaltyPercentage *big.Int
	TokenUri          string
}

// TeritoriMinterMintDataWithMetadata is an auto generated low-level Go binding around an user-defined struct.
type TeritoriMinterMintDataWithMetadata struct {
	TokenId           *big.Int
	RoyaltyReceiver   common.Address
	RoyaltyPercentage *big.Int
	TokenUri          string
	Extension         TeritoriNftMetadata
}

// TeritoriMinterWhitelistConfig is an auto generated low-level Go binding around an user-defined struct.
type TeritoriMinterWhitelistConfig struct {
	MintMax    *big.Int
	MintPeriod *big.Int
	MintPrice  *big.Int
}

// TeritoriNftAttribute is an auto generated low-level Go binding around an user-defined struct.
type TeritoriNftAttribute struct {
	TraitType string
	Value     string
}

// TeritoriNftMetadata is an auto generated low-level Go binding around an user-defined struct.
type TeritoriNftMetadata struct {
	Name         string
	Description  string
	Image        string
	ExternalUrl  string
	AnimationUrl string
	Attributes   []TeritoriNftAttribute
}

// TeritoriMinterMetaData contains all meta data concerning the TeritoriMinter contract.
var TeritoriMinterMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_symbol\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_contractURI\",\"type\":\"string\"},{\"internalType\":\"address\",\"name\":\"_nft_impl\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_minter\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_minterFee\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"MintRequest\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Paused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Unpaused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"WithdrawFund\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"config\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"maxSupply\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"mintToken\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"mintStartTime\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"whitelistCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"publicMintPrice\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"publicMintMax\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"currentSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"royaltyReceiver\",\"type\":\"address\"},{\"internalType\":\"uint96\",\"name\":\"royaltyPercentage\",\"type\":\"uint96\"},{\"internalType\":\"string\",\"name\":\"tokenUri\",\"type\":\"string\"}],\"internalType\":\"structTeritoriMinter.MintData[]\",\"name\":\"mintData\",\"type\":\"tuple[]\"}],\"name\":\"mint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"royaltyReceiver\",\"type\":\"address\"},{\"internalType\":\"uint96\",\"name\":\"royaltyPercentage\",\"type\":\"uint96\"},{\"internalType\":\"string\",\"name\":\"tokenUri\",\"type\":\"string\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"image\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"external_url\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"animation_url\",\"type\":\"string\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"trait_type\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"value\",\"type\":\"string\"}],\"internalType\":\"structTeritoriNft.Attribute[]\",\"name\":\"attributes\",\"type\":\"tuple[]\"}],\"internalType\":\"structTeritoriNft.Metadata\",\"name\":\"extension\",\"type\":\"tuple\"}],\"internalType\":\"structTeritoriMinter.MintDataWithMetadata[]\",\"name\":\"mintData\",\"type\":\"tuple[]\"}],\"name\":\"mintWithMetadata\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"minter\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"minterFee\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"nft\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"pause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"requestMint\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"maxSupply\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"mintToken\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"mintStartTime\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"whitelistCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"publicMintPrice\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"publicMintMax\",\"type\":\"uint256\"}],\"internalType\":\"structTeritoriMinter.Config\",\"name\":\"newConfig\",\"type\":\"tuple\"}],\"name\":\"setConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newMinter\",\"type\":\"address\"}],\"name\":\"setMinter\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newMinterFee\",\"type\":\"uint256\"}],\"name\":\"setMinterFee\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"whitelistPhase\",\"type\":\"uint256\"},{\"internalType\":\"address[]\",\"name\":\"users\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"whitelisted\",\"type\":\"bool\"}],\"name\":\"setWhitelist\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"whitelistPhases\",\"type\":\"uint256[]\"},{\"components\":[{\"internalType\":\"uint256\",\"name\":\"mintMax\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"mintPeriod\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"mintPrice\",\"type\":\"uint256\"}],\"internalType\":\"structTeritoriMinter.WhitelistConfig[]\",\"name\":\"newWhitelistMintConfigs\",\"type\":\"tuple[]\"}],\"name\":\"setWhitelistConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"startMint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"tokenRequests\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"tokenRequestsCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"unpause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userMinted\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"userState\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"currentPhase\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"mintPrice\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"userCanMint\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userWhitelisted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"whitelistSize\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"whitelists\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"mintMax\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"mintPeriod\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"mintPrice\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"withdrawFund\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// TeritoriMinterABI is the input ABI used to generate the binding from.
// Deprecated: Use TeritoriMinterMetaData.ABI instead.
var TeritoriMinterABI = TeritoriMinterMetaData.ABI

// TeritoriMinter is an auto generated Go binding around an Ethereum contract.
type TeritoriMinter struct {
	TeritoriMinterCaller     // Read-only binding to the contract
	TeritoriMinterTransactor // Write-only binding to the contract
	TeritoriMinterFilterer   // Log filterer for contract events
}

// TeritoriMinterCaller is an auto generated read-only Go binding around an Ethereum contract.
type TeritoriMinterCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TeritoriMinterTransactor is an auto generated write-only Go binding around an Ethereum contract.
type TeritoriMinterTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TeritoriMinterFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type TeritoriMinterFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TeritoriMinterSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type TeritoriMinterSession struct {
	Contract     *TeritoriMinter   // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// TeritoriMinterCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type TeritoriMinterCallerSession struct {
	Contract *TeritoriMinterCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts         // Call options to use throughout this session
}

// TeritoriMinterTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type TeritoriMinterTransactorSession struct {
	Contract     *TeritoriMinterTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts         // Transaction auth options to use throughout this session
}

// TeritoriMinterRaw is an auto generated low-level Go binding around an Ethereum contract.
type TeritoriMinterRaw struct {
	Contract *TeritoriMinter // Generic contract binding to access the raw methods on
}

// TeritoriMinterCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type TeritoriMinterCallerRaw struct {
	Contract *TeritoriMinterCaller // Generic read-only contract binding to access the raw methods on
}

// TeritoriMinterTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type TeritoriMinterTransactorRaw struct {
	Contract *TeritoriMinterTransactor // Generic write-only contract binding to access the raw methods on
}

// NewTeritoriMinter creates a new instance of TeritoriMinter, bound to a specific deployed contract.
func NewTeritoriMinter(address common.Address, backend bind.ContractBackend) (*TeritoriMinter, error) {
	contract, err := bindTeritoriMinter(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &TeritoriMinter{TeritoriMinterCaller: TeritoriMinterCaller{contract: contract}, TeritoriMinterTransactor: TeritoriMinterTransactor{contract: contract}, TeritoriMinterFilterer: TeritoriMinterFilterer{contract: contract}}, nil
}

// NewTeritoriMinterCaller creates a new read-only instance of TeritoriMinter, bound to a specific deployed contract.
func NewTeritoriMinterCaller(address common.Address, caller bind.ContractCaller) (*TeritoriMinterCaller, error) {
	contract, err := bindTeritoriMinter(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &TeritoriMinterCaller{contract: contract}, nil
}

// NewTeritoriMinterTransactor creates a new write-only instance of TeritoriMinter, bound to a specific deployed contract.
func NewTeritoriMinterTransactor(address common.Address, transactor bind.ContractTransactor) (*TeritoriMinterTransactor, error) {
	contract, err := bindTeritoriMinter(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &TeritoriMinterTransactor{contract: contract}, nil
}

// NewTeritoriMinterFilterer creates a new log filterer instance of TeritoriMinter, bound to a specific deployed contract.
func NewTeritoriMinterFilterer(address common.Address, filterer bind.ContractFilterer) (*TeritoriMinterFilterer, error) {
	contract, err := bindTeritoriMinter(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &TeritoriMinterFilterer{contract: contract}, nil
}

// bindTeritoriMinter binds a generic wrapper to an already deployed contract.
func bindTeritoriMinter(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := TeritoriMinterMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_TeritoriMinter *TeritoriMinterRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _TeritoriMinter.Contract.TeritoriMinterCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_TeritoriMinter *TeritoriMinterRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.TeritoriMinterTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_TeritoriMinter *TeritoriMinterRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.TeritoriMinterTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_TeritoriMinter *TeritoriMinterCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _TeritoriMinter.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_TeritoriMinter *TeritoriMinterTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_TeritoriMinter *TeritoriMinterTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.contract.Transact(opts, method, params...)
}

// Config is a free data retrieval call binding the contract method 0x79502c55.
//
// Solidity: function config() view returns(uint256 maxSupply, address mintToken, uint256 mintStartTime, uint256 whitelistCount, uint256 publicMintPrice, uint256 publicMintMax)
func (_TeritoriMinter *TeritoriMinterCaller) Config(opts *bind.CallOpts) (struct {
	MaxSupply       *big.Int
	MintToken       common.Address
	MintStartTime   *big.Int
	WhitelistCount  *big.Int
	PublicMintPrice *big.Int
	PublicMintMax   *big.Int
}, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "config")

	outstruct := new(struct {
		MaxSupply       *big.Int
		MintToken       common.Address
		MintStartTime   *big.Int
		WhitelistCount  *big.Int
		PublicMintPrice *big.Int
		PublicMintMax   *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.MaxSupply = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.MintToken = *abi.ConvertType(out[1], new(common.Address)).(*common.Address)
	outstruct.MintStartTime = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.WhitelistCount = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.PublicMintPrice = *abi.ConvertType(out[4], new(*big.Int)).(**big.Int)
	outstruct.PublicMintMax = *abi.ConvertType(out[5], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// Config is a free data retrieval call binding the contract method 0x79502c55.
//
// Solidity: function config() view returns(uint256 maxSupply, address mintToken, uint256 mintStartTime, uint256 whitelistCount, uint256 publicMintPrice, uint256 publicMintMax)
func (_TeritoriMinter *TeritoriMinterSession) Config() (struct {
	MaxSupply       *big.Int
	MintToken       common.Address
	MintStartTime   *big.Int
	WhitelistCount  *big.Int
	PublicMintPrice *big.Int
	PublicMintMax   *big.Int
}, error) {
	return _TeritoriMinter.Contract.Config(&_TeritoriMinter.CallOpts)
}

// Config is a free data retrieval call binding the contract method 0x79502c55.
//
// Solidity: function config() view returns(uint256 maxSupply, address mintToken, uint256 mintStartTime, uint256 whitelistCount, uint256 publicMintPrice, uint256 publicMintMax)
func (_TeritoriMinter *TeritoriMinterCallerSession) Config() (struct {
	MaxSupply       *big.Int
	MintToken       common.Address
	MintStartTime   *big.Int
	WhitelistCount  *big.Int
	PublicMintPrice *big.Int
	PublicMintMax   *big.Int
}, error) {
	return _TeritoriMinter.Contract.Config(&_TeritoriMinter.CallOpts)
}

// CurrentSupply is a free data retrieval call binding the contract method 0x771282f6.
//
// Solidity: function currentSupply() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCaller) CurrentSupply(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "currentSupply")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CurrentSupply is a free data retrieval call binding the contract method 0x771282f6.
//
// Solidity: function currentSupply() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterSession) CurrentSupply() (*big.Int, error) {
	return _TeritoriMinter.Contract.CurrentSupply(&_TeritoriMinter.CallOpts)
}

// CurrentSupply is a free data retrieval call binding the contract method 0x771282f6.
//
// Solidity: function currentSupply() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCallerSession) CurrentSupply() (*big.Int, error) {
	return _TeritoriMinter.Contract.CurrentSupply(&_TeritoriMinter.CallOpts)
}

// Minter is a free data retrieval call binding the contract method 0x07546172.
//
// Solidity: function minter() view returns(address)
func (_TeritoriMinter *TeritoriMinterCaller) Minter(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "minter")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Minter is a free data retrieval call binding the contract method 0x07546172.
//
// Solidity: function minter() view returns(address)
func (_TeritoriMinter *TeritoriMinterSession) Minter() (common.Address, error) {
	return _TeritoriMinter.Contract.Minter(&_TeritoriMinter.CallOpts)
}

// Minter is a free data retrieval call binding the contract method 0x07546172.
//
// Solidity: function minter() view returns(address)
func (_TeritoriMinter *TeritoriMinterCallerSession) Minter() (common.Address, error) {
	return _TeritoriMinter.Contract.Minter(&_TeritoriMinter.CallOpts)
}

// MinterFee is a free data retrieval call binding the contract method 0x48a9d0ce.
//
// Solidity: function minterFee() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCaller) MinterFee(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "minterFee")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MinterFee is a free data retrieval call binding the contract method 0x48a9d0ce.
//
// Solidity: function minterFee() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterSession) MinterFee() (*big.Int, error) {
	return _TeritoriMinter.Contract.MinterFee(&_TeritoriMinter.CallOpts)
}

// MinterFee is a free data retrieval call binding the contract method 0x48a9d0ce.
//
// Solidity: function minterFee() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCallerSession) MinterFee() (*big.Int, error) {
	return _TeritoriMinter.Contract.MinterFee(&_TeritoriMinter.CallOpts)
}

// Nft is a free data retrieval call binding the contract method 0x47ccca02.
//
// Solidity: function nft() view returns(address)
func (_TeritoriMinter *TeritoriMinterCaller) Nft(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "nft")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Nft is a free data retrieval call binding the contract method 0x47ccca02.
//
// Solidity: function nft() view returns(address)
func (_TeritoriMinter *TeritoriMinterSession) Nft() (common.Address, error) {
	return _TeritoriMinter.Contract.Nft(&_TeritoriMinter.CallOpts)
}

// Nft is a free data retrieval call binding the contract method 0x47ccca02.
//
// Solidity: function nft() view returns(address)
func (_TeritoriMinter *TeritoriMinterCallerSession) Nft() (common.Address, error) {
	return _TeritoriMinter.Contract.Nft(&_TeritoriMinter.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_TeritoriMinter *TeritoriMinterCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_TeritoriMinter *TeritoriMinterSession) Owner() (common.Address, error) {
	return _TeritoriMinter.Contract.Owner(&_TeritoriMinter.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_TeritoriMinter *TeritoriMinterCallerSession) Owner() (common.Address, error) {
	return _TeritoriMinter.Contract.Owner(&_TeritoriMinter.CallOpts)
}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_TeritoriMinter *TeritoriMinterCaller) Paused(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "paused")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_TeritoriMinter *TeritoriMinterSession) Paused() (bool, error) {
	return _TeritoriMinter.Contract.Paused(&_TeritoriMinter.CallOpts)
}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_TeritoriMinter *TeritoriMinterCallerSession) Paused() (bool, error) {
	return _TeritoriMinter.Contract.Paused(&_TeritoriMinter.CallOpts)
}

// TokenRequests is a free data retrieval call binding the contract method 0x5e124dcf.
//
// Solidity: function tokenRequests(uint256 ) view returns(address)
func (_TeritoriMinter *TeritoriMinterCaller) TokenRequests(opts *bind.CallOpts, arg0 *big.Int) (common.Address, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "tokenRequests", arg0)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// TokenRequests is a free data retrieval call binding the contract method 0x5e124dcf.
//
// Solidity: function tokenRequests(uint256 ) view returns(address)
func (_TeritoriMinter *TeritoriMinterSession) TokenRequests(arg0 *big.Int) (common.Address, error) {
	return _TeritoriMinter.Contract.TokenRequests(&_TeritoriMinter.CallOpts, arg0)
}

// TokenRequests is a free data retrieval call binding the contract method 0x5e124dcf.
//
// Solidity: function tokenRequests(uint256 ) view returns(address)
func (_TeritoriMinter *TeritoriMinterCallerSession) TokenRequests(arg0 *big.Int) (common.Address, error) {
	return _TeritoriMinter.Contract.TokenRequests(&_TeritoriMinter.CallOpts, arg0)
}

// TokenRequestsCount is a free data retrieval call binding the contract method 0xfa7783fd.
//
// Solidity: function tokenRequestsCount() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCaller) TokenRequestsCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "tokenRequestsCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TokenRequestsCount is a free data retrieval call binding the contract method 0xfa7783fd.
//
// Solidity: function tokenRequestsCount() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterSession) TokenRequestsCount() (*big.Int, error) {
	return _TeritoriMinter.Contract.TokenRequestsCount(&_TeritoriMinter.CallOpts)
}

// TokenRequestsCount is a free data retrieval call binding the contract method 0xfa7783fd.
//
// Solidity: function tokenRequestsCount() view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCallerSession) TokenRequestsCount() (*big.Int, error) {
	return _TeritoriMinter.Contract.TokenRequestsCount(&_TeritoriMinter.CallOpts)
}

// UserMinted is a free data retrieval call binding the contract method 0x1aa5e872.
//
// Solidity: function userMinted(address ) view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCaller) UserMinted(opts *bind.CallOpts, arg0 common.Address) (*big.Int, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "userMinted", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// UserMinted is a free data retrieval call binding the contract method 0x1aa5e872.
//
// Solidity: function userMinted(address ) view returns(uint256)
func (_TeritoriMinter *TeritoriMinterSession) UserMinted(arg0 common.Address) (*big.Int, error) {
	return _TeritoriMinter.Contract.UserMinted(&_TeritoriMinter.CallOpts, arg0)
}

// UserMinted is a free data retrieval call binding the contract method 0x1aa5e872.
//
// Solidity: function userMinted(address ) view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCallerSession) UserMinted(arg0 common.Address) (*big.Int, error) {
	return _TeritoriMinter.Contract.UserMinted(&_TeritoriMinter.CallOpts, arg0)
}

// UserState is a free data retrieval call binding the contract method 0x0c8f81b5.
//
// Solidity: function userState(address user) view returns(uint256 currentPhase, uint256 mintPrice, bool userCanMint)
func (_TeritoriMinter *TeritoriMinterCaller) UserState(opts *bind.CallOpts, user common.Address) (struct {
	CurrentPhase *big.Int
	MintPrice    *big.Int
	UserCanMint  bool
}, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "userState", user)

	outstruct := new(struct {
		CurrentPhase *big.Int
		MintPrice    *big.Int
		UserCanMint  bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.CurrentPhase = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.MintPrice = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.UserCanMint = *abi.ConvertType(out[2], new(bool)).(*bool)

	return *outstruct, err

}

// UserState is a free data retrieval call binding the contract method 0x0c8f81b5.
//
// Solidity: function userState(address user) view returns(uint256 currentPhase, uint256 mintPrice, bool userCanMint)
func (_TeritoriMinter *TeritoriMinterSession) UserState(user common.Address) (struct {
	CurrentPhase *big.Int
	MintPrice    *big.Int
	UserCanMint  bool
}, error) {
	return _TeritoriMinter.Contract.UserState(&_TeritoriMinter.CallOpts, user)
}

// UserState is a free data retrieval call binding the contract method 0x0c8f81b5.
//
// Solidity: function userState(address user) view returns(uint256 currentPhase, uint256 mintPrice, bool userCanMint)
func (_TeritoriMinter *TeritoriMinterCallerSession) UserState(user common.Address) (struct {
	CurrentPhase *big.Int
	MintPrice    *big.Int
	UserCanMint  bool
}, error) {
	return _TeritoriMinter.Contract.UserState(&_TeritoriMinter.CallOpts, user)
}

// UserWhitelisted is a free data retrieval call binding the contract method 0x06b1bd0e.
//
// Solidity: function userWhitelisted(uint256 , address ) view returns(bool)
func (_TeritoriMinter *TeritoriMinterCaller) UserWhitelisted(opts *bind.CallOpts, arg0 *big.Int, arg1 common.Address) (bool, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "userWhitelisted", arg0, arg1)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// UserWhitelisted is a free data retrieval call binding the contract method 0x06b1bd0e.
//
// Solidity: function userWhitelisted(uint256 , address ) view returns(bool)
func (_TeritoriMinter *TeritoriMinterSession) UserWhitelisted(arg0 *big.Int, arg1 common.Address) (bool, error) {
	return _TeritoriMinter.Contract.UserWhitelisted(&_TeritoriMinter.CallOpts, arg0, arg1)
}

// UserWhitelisted is a free data retrieval call binding the contract method 0x06b1bd0e.
//
// Solidity: function userWhitelisted(uint256 , address ) view returns(bool)
func (_TeritoriMinter *TeritoriMinterCallerSession) UserWhitelisted(arg0 *big.Int, arg1 common.Address) (bool, error) {
	return _TeritoriMinter.Contract.UserWhitelisted(&_TeritoriMinter.CallOpts, arg0, arg1)
}

// WhitelistSize is a free data retrieval call binding the contract method 0x3dac1ecb.
//
// Solidity: function whitelistSize(uint256 ) view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCaller) WhitelistSize(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "whitelistSize", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// WhitelistSize is a free data retrieval call binding the contract method 0x3dac1ecb.
//
// Solidity: function whitelistSize(uint256 ) view returns(uint256)
func (_TeritoriMinter *TeritoriMinterSession) WhitelistSize(arg0 *big.Int) (*big.Int, error) {
	return _TeritoriMinter.Contract.WhitelistSize(&_TeritoriMinter.CallOpts, arg0)
}

// WhitelistSize is a free data retrieval call binding the contract method 0x3dac1ecb.
//
// Solidity: function whitelistSize(uint256 ) view returns(uint256)
func (_TeritoriMinter *TeritoriMinterCallerSession) WhitelistSize(arg0 *big.Int) (*big.Int, error) {
	return _TeritoriMinter.Contract.WhitelistSize(&_TeritoriMinter.CallOpts, arg0)
}

// Whitelists is a free data retrieval call binding the contract method 0xfe4d5add.
//
// Solidity: function whitelists(uint256 ) view returns(uint256 mintMax, uint256 mintPeriod, uint256 mintPrice)
func (_TeritoriMinter *TeritoriMinterCaller) Whitelists(opts *bind.CallOpts, arg0 *big.Int) (struct {
	MintMax    *big.Int
	MintPeriod *big.Int
	MintPrice  *big.Int
}, error) {
	var out []interface{}
	err := _TeritoriMinter.contract.Call(opts, &out, "whitelists", arg0)

	outstruct := new(struct {
		MintMax    *big.Int
		MintPeriod *big.Int
		MintPrice  *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.MintMax = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.MintPeriod = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.MintPrice = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// Whitelists is a free data retrieval call binding the contract method 0xfe4d5add.
//
// Solidity: function whitelists(uint256 ) view returns(uint256 mintMax, uint256 mintPeriod, uint256 mintPrice)
func (_TeritoriMinter *TeritoriMinterSession) Whitelists(arg0 *big.Int) (struct {
	MintMax    *big.Int
	MintPeriod *big.Int
	MintPrice  *big.Int
}, error) {
	return _TeritoriMinter.Contract.Whitelists(&_TeritoriMinter.CallOpts, arg0)
}

// Whitelists is a free data retrieval call binding the contract method 0xfe4d5add.
//
// Solidity: function whitelists(uint256 ) view returns(uint256 mintMax, uint256 mintPeriod, uint256 mintPrice)
func (_TeritoriMinter *TeritoriMinterCallerSession) Whitelists(arg0 *big.Int) (struct {
	MintMax    *big.Int
	MintPeriod *big.Int
	MintPrice  *big.Int
}, error) {
	return _TeritoriMinter.Contract.Whitelists(&_TeritoriMinter.CallOpts, arg0)
}

// Mint is a paid mutator transaction binding the contract method 0x4d722295.
//
// Solidity: function mint((uint256,address,uint96,string)[] mintData) returns()
func (_TeritoriMinter *TeritoriMinterTransactor) Mint(opts *bind.TransactOpts, mintData []TeritoriMinterMintData) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "mint", mintData)
}

// Mint is a paid mutator transaction binding the contract method 0x4d722295.
//
// Solidity: function mint((uint256,address,uint96,string)[] mintData) returns()
func (_TeritoriMinter *TeritoriMinterSession) Mint(mintData []TeritoriMinterMintData) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.Mint(&_TeritoriMinter.TransactOpts, mintData)
}

// Mint is a paid mutator transaction binding the contract method 0x4d722295.
//
// Solidity: function mint((uint256,address,uint96,string)[] mintData) returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) Mint(mintData []TeritoriMinterMintData) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.Mint(&_TeritoriMinter.TransactOpts, mintData)
}

// MintWithMetadata is a paid mutator transaction binding the contract method 0x92548bbe.
//
// Solidity: function mintWithMetadata((uint256,address,uint96,string,(string,string,string,string,string,(string,string)[]))[] mintData) returns()
func (_TeritoriMinter *TeritoriMinterTransactor) MintWithMetadata(opts *bind.TransactOpts, mintData []TeritoriMinterMintDataWithMetadata) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "mintWithMetadata", mintData)
}

// MintWithMetadata is a paid mutator transaction binding the contract method 0x92548bbe.
//
// Solidity: function mintWithMetadata((uint256,address,uint96,string,(string,string,string,string,string,(string,string)[]))[] mintData) returns()
func (_TeritoriMinter *TeritoriMinterSession) MintWithMetadata(mintData []TeritoriMinterMintDataWithMetadata) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.MintWithMetadata(&_TeritoriMinter.TransactOpts, mintData)
}

// MintWithMetadata is a paid mutator transaction binding the contract method 0x92548bbe.
//
// Solidity: function mintWithMetadata((uint256,address,uint96,string,(string,string,string,string,string,(string,string)[]))[] mintData) returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) MintWithMetadata(mintData []TeritoriMinterMintDataWithMetadata) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.MintWithMetadata(&_TeritoriMinter.TransactOpts, mintData)
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_TeritoriMinter *TeritoriMinterTransactor) Pause(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "pause")
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_TeritoriMinter *TeritoriMinterSession) Pause() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.Pause(&_TeritoriMinter.TransactOpts)
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) Pause() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.Pause(&_TeritoriMinter.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_TeritoriMinter *TeritoriMinterTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_TeritoriMinter *TeritoriMinterSession) RenounceOwnership() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.RenounceOwnership(&_TeritoriMinter.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.RenounceOwnership(&_TeritoriMinter.TransactOpts)
}

// RequestMint is a paid mutator transaction binding the contract method 0x95241511.
//
// Solidity: function requestMint(address user) payable returns()
func (_TeritoriMinter *TeritoriMinterTransactor) RequestMint(opts *bind.TransactOpts, user common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "requestMint", user)
}

// RequestMint is a paid mutator transaction binding the contract method 0x95241511.
//
// Solidity: function requestMint(address user) payable returns()
func (_TeritoriMinter *TeritoriMinterSession) RequestMint(user common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.RequestMint(&_TeritoriMinter.TransactOpts, user)
}

// RequestMint is a paid mutator transaction binding the contract method 0x95241511.
//
// Solidity: function requestMint(address user) payable returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) RequestMint(user common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.RequestMint(&_TeritoriMinter.TransactOpts, user)
}

// SetConfig is a paid mutator transaction binding the contract method 0xf1053f7c.
//
// Solidity: function setConfig((uint256,address,uint256,uint256,uint256,uint256) newConfig) returns()
func (_TeritoriMinter *TeritoriMinterTransactor) SetConfig(opts *bind.TransactOpts, newConfig TeritoriMinterConfig) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "setConfig", newConfig)
}

// SetConfig is a paid mutator transaction binding the contract method 0xf1053f7c.
//
// Solidity: function setConfig((uint256,address,uint256,uint256,uint256,uint256) newConfig) returns()
func (_TeritoriMinter *TeritoriMinterSession) SetConfig(newConfig TeritoriMinterConfig) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetConfig(&_TeritoriMinter.TransactOpts, newConfig)
}

// SetConfig is a paid mutator transaction binding the contract method 0xf1053f7c.
//
// Solidity: function setConfig((uint256,address,uint256,uint256,uint256,uint256) newConfig) returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) SetConfig(newConfig TeritoriMinterConfig) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetConfig(&_TeritoriMinter.TransactOpts, newConfig)
}

// SetMinter is a paid mutator transaction binding the contract method 0xfca3b5aa.
//
// Solidity: function setMinter(address newMinter) returns()
func (_TeritoriMinter *TeritoriMinterTransactor) SetMinter(opts *bind.TransactOpts, newMinter common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "setMinter", newMinter)
}

// SetMinter is a paid mutator transaction binding the contract method 0xfca3b5aa.
//
// Solidity: function setMinter(address newMinter) returns()
func (_TeritoriMinter *TeritoriMinterSession) SetMinter(newMinter common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetMinter(&_TeritoriMinter.TransactOpts, newMinter)
}

// SetMinter is a paid mutator transaction binding the contract method 0xfca3b5aa.
//
// Solidity: function setMinter(address newMinter) returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) SetMinter(newMinter common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetMinter(&_TeritoriMinter.TransactOpts, newMinter)
}

// SetMinterFee is a paid mutator transaction binding the contract method 0x5e94c98e.
//
// Solidity: function setMinterFee(uint256 newMinterFee) returns()
func (_TeritoriMinter *TeritoriMinterTransactor) SetMinterFee(opts *bind.TransactOpts, newMinterFee *big.Int) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "setMinterFee", newMinterFee)
}

// SetMinterFee is a paid mutator transaction binding the contract method 0x5e94c98e.
//
// Solidity: function setMinterFee(uint256 newMinterFee) returns()
func (_TeritoriMinter *TeritoriMinterSession) SetMinterFee(newMinterFee *big.Int) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetMinterFee(&_TeritoriMinter.TransactOpts, newMinterFee)
}

// SetMinterFee is a paid mutator transaction binding the contract method 0x5e94c98e.
//
// Solidity: function setMinterFee(uint256 newMinterFee) returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) SetMinterFee(newMinterFee *big.Int) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetMinterFee(&_TeritoriMinter.TransactOpts, newMinterFee)
}

// SetWhitelist is a paid mutator transaction binding the contract method 0xfad9a11f.
//
// Solidity: function setWhitelist(uint256 whitelistPhase, address[] users, bool whitelisted) returns()
func (_TeritoriMinter *TeritoriMinterTransactor) SetWhitelist(opts *bind.TransactOpts, whitelistPhase *big.Int, users []common.Address, whitelisted bool) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "setWhitelist", whitelistPhase, users, whitelisted)
}

// SetWhitelist is a paid mutator transaction binding the contract method 0xfad9a11f.
//
// Solidity: function setWhitelist(uint256 whitelistPhase, address[] users, bool whitelisted) returns()
func (_TeritoriMinter *TeritoriMinterSession) SetWhitelist(whitelistPhase *big.Int, users []common.Address, whitelisted bool) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetWhitelist(&_TeritoriMinter.TransactOpts, whitelistPhase, users, whitelisted)
}

// SetWhitelist is a paid mutator transaction binding the contract method 0xfad9a11f.
//
// Solidity: function setWhitelist(uint256 whitelistPhase, address[] users, bool whitelisted) returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) SetWhitelist(whitelistPhase *big.Int, users []common.Address, whitelisted bool) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetWhitelist(&_TeritoriMinter.TransactOpts, whitelistPhase, users, whitelisted)
}

// SetWhitelistConfig is a paid mutator transaction binding the contract method 0xdb2cc25d.
//
// Solidity: function setWhitelistConfig(uint256[] whitelistPhases, (uint256,uint256,uint256)[] newWhitelistMintConfigs) returns()
func (_TeritoriMinter *TeritoriMinterTransactor) SetWhitelistConfig(opts *bind.TransactOpts, whitelistPhases []*big.Int, newWhitelistMintConfigs []TeritoriMinterWhitelistConfig) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "setWhitelistConfig", whitelistPhases, newWhitelistMintConfigs)
}

// SetWhitelistConfig is a paid mutator transaction binding the contract method 0xdb2cc25d.
//
// Solidity: function setWhitelistConfig(uint256[] whitelistPhases, (uint256,uint256,uint256)[] newWhitelistMintConfigs) returns()
func (_TeritoriMinter *TeritoriMinterSession) SetWhitelistConfig(whitelistPhases []*big.Int, newWhitelistMintConfigs []TeritoriMinterWhitelistConfig) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetWhitelistConfig(&_TeritoriMinter.TransactOpts, whitelistPhases, newWhitelistMintConfigs)
}

// SetWhitelistConfig is a paid mutator transaction binding the contract method 0xdb2cc25d.
//
// Solidity: function setWhitelistConfig(uint256[] whitelistPhases, (uint256,uint256,uint256)[] newWhitelistMintConfigs) returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) SetWhitelistConfig(whitelistPhases []*big.Int, newWhitelistMintConfigs []TeritoriMinterWhitelistConfig) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.SetWhitelistConfig(&_TeritoriMinter.TransactOpts, whitelistPhases, newWhitelistMintConfigs)
}

// StartMint is a paid mutator transaction binding the contract method 0x2be09561.
//
// Solidity: function startMint() returns()
func (_TeritoriMinter *TeritoriMinterTransactor) StartMint(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "startMint")
}

// StartMint is a paid mutator transaction binding the contract method 0x2be09561.
//
// Solidity: function startMint() returns()
func (_TeritoriMinter *TeritoriMinterSession) StartMint() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.StartMint(&_TeritoriMinter.TransactOpts)
}

// StartMint is a paid mutator transaction binding the contract method 0x2be09561.
//
// Solidity: function startMint() returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) StartMint() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.StartMint(&_TeritoriMinter.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_TeritoriMinter *TeritoriMinterTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_TeritoriMinter *TeritoriMinterSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.TransferOwnership(&_TeritoriMinter.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _TeritoriMinter.Contract.TransferOwnership(&_TeritoriMinter.TransactOpts, newOwner)
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_TeritoriMinter *TeritoriMinterTransactor) Unpause(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "unpause")
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_TeritoriMinter *TeritoriMinterSession) Unpause() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.Unpause(&_TeritoriMinter.TransactOpts)
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) Unpause() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.Unpause(&_TeritoriMinter.TransactOpts)
}

// WithdrawFund is a paid mutator transaction binding the contract method 0xe07fa3c1.
//
// Solidity: function withdrawFund() returns()
func (_TeritoriMinter *TeritoriMinterTransactor) WithdrawFund(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriMinter.contract.Transact(opts, "withdrawFund")
}

// WithdrawFund is a paid mutator transaction binding the contract method 0xe07fa3c1.
//
// Solidity: function withdrawFund() returns()
func (_TeritoriMinter *TeritoriMinterSession) WithdrawFund() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.WithdrawFund(&_TeritoriMinter.TransactOpts)
}

// WithdrawFund is a paid mutator transaction binding the contract method 0xe07fa3c1.
//
// Solidity: function withdrawFund() returns()
func (_TeritoriMinter *TeritoriMinterTransactorSession) WithdrawFund() (*types.Transaction, error) {
	return _TeritoriMinter.Contract.WithdrawFund(&_TeritoriMinter.TransactOpts)
}

// TeritoriMinterMintRequestIterator is returned from FilterMintRequest and is used to iterate over the raw logs and unpacked data for MintRequest events raised by the TeritoriMinter contract.
type TeritoriMinterMintRequestIterator struct {
	Event *TeritoriMinterMintRequest // Event containing the contract specifics and raw log

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
func (it *TeritoriMinterMintRequestIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriMinterMintRequest)
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
		it.Event = new(TeritoriMinterMintRequest)
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
func (it *TeritoriMinterMintRequestIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriMinterMintRequestIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriMinterMintRequest represents a MintRequest event raised by the TeritoriMinter contract.
type TeritoriMinterMintRequest struct {
	User common.Address
	Raw  types.Log // Blockchain specific contextual infos
}

// FilterMintRequest is a free log retrieval operation binding the contract event 0x0af7474cbbd1ef068605cf3d04b3b0f187241620cc71f4dff74d398eb5e4e206.
//
// Solidity: event MintRequest(address user)
func (_TeritoriMinter *TeritoriMinterFilterer) FilterMintRequest(opts *bind.FilterOpts) (*TeritoriMinterMintRequestIterator, error) {

	logs, sub, err := _TeritoriMinter.contract.FilterLogs(opts, "MintRequest")
	if err != nil {
		return nil, err
	}
	return &TeritoriMinterMintRequestIterator{contract: _TeritoriMinter.contract, event: "MintRequest", logs: logs, sub: sub}, nil
}

// WatchMintRequest is a free log subscription operation binding the contract event 0x0af7474cbbd1ef068605cf3d04b3b0f187241620cc71f4dff74d398eb5e4e206.
//
// Solidity: event MintRequest(address user)
func (_TeritoriMinter *TeritoriMinterFilterer) WatchMintRequest(opts *bind.WatchOpts, sink chan<- *TeritoriMinterMintRequest) (event.Subscription, error) {

	logs, sub, err := _TeritoriMinter.contract.WatchLogs(opts, "MintRequest")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriMinterMintRequest)
				if err := _TeritoriMinter.contract.UnpackLog(event, "MintRequest", log); err != nil {
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

// ParseMintRequest is a log parse operation binding the contract event 0x0af7474cbbd1ef068605cf3d04b3b0f187241620cc71f4dff74d398eb5e4e206.
//
// Solidity: event MintRequest(address user)
func (_TeritoriMinter *TeritoriMinterFilterer) ParseMintRequest(log types.Log) (*TeritoriMinterMintRequest, error) {
	event := new(TeritoriMinterMintRequest)
	if err := _TeritoriMinter.contract.UnpackLog(event, "MintRequest", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriMinterOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the TeritoriMinter contract.
type TeritoriMinterOwnershipTransferredIterator struct {
	Event *TeritoriMinterOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *TeritoriMinterOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriMinterOwnershipTransferred)
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
		it.Event = new(TeritoriMinterOwnershipTransferred)
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
func (it *TeritoriMinterOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriMinterOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriMinterOwnershipTransferred represents a OwnershipTransferred event raised by the TeritoriMinter contract.
type TeritoriMinterOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_TeritoriMinter *TeritoriMinterFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*TeritoriMinterOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _TeritoriMinter.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &TeritoriMinterOwnershipTransferredIterator{contract: _TeritoriMinter.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_TeritoriMinter *TeritoriMinterFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *TeritoriMinterOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _TeritoriMinter.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriMinterOwnershipTransferred)
				if err := _TeritoriMinter.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_TeritoriMinter *TeritoriMinterFilterer) ParseOwnershipTransferred(log types.Log) (*TeritoriMinterOwnershipTransferred, error) {
	event := new(TeritoriMinterOwnershipTransferred)
	if err := _TeritoriMinter.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriMinterPausedIterator is returned from FilterPaused and is used to iterate over the raw logs and unpacked data for Paused events raised by the TeritoriMinter contract.
type TeritoriMinterPausedIterator struct {
	Event *TeritoriMinterPaused // Event containing the contract specifics and raw log

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
func (it *TeritoriMinterPausedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriMinterPaused)
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
		it.Event = new(TeritoriMinterPaused)
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
func (it *TeritoriMinterPausedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriMinterPausedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriMinterPaused represents a Paused event raised by the TeritoriMinter contract.
type TeritoriMinterPaused struct {
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterPaused is a free log retrieval operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_TeritoriMinter *TeritoriMinterFilterer) FilterPaused(opts *bind.FilterOpts) (*TeritoriMinterPausedIterator, error) {

	logs, sub, err := _TeritoriMinter.contract.FilterLogs(opts, "Paused")
	if err != nil {
		return nil, err
	}
	return &TeritoriMinterPausedIterator{contract: _TeritoriMinter.contract, event: "Paused", logs: logs, sub: sub}, nil
}

// WatchPaused is a free log subscription operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_TeritoriMinter *TeritoriMinterFilterer) WatchPaused(opts *bind.WatchOpts, sink chan<- *TeritoriMinterPaused) (event.Subscription, error) {

	logs, sub, err := _TeritoriMinter.contract.WatchLogs(opts, "Paused")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriMinterPaused)
				if err := _TeritoriMinter.contract.UnpackLog(event, "Paused", log); err != nil {
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

// ParsePaused is a log parse operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_TeritoriMinter *TeritoriMinterFilterer) ParsePaused(log types.Log) (*TeritoriMinterPaused, error) {
	event := new(TeritoriMinterPaused)
	if err := _TeritoriMinter.contract.UnpackLog(event, "Paused", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriMinterUnpausedIterator is returned from FilterUnpaused and is used to iterate over the raw logs and unpacked data for Unpaused events raised by the TeritoriMinter contract.
type TeritoriMinterUnpausedIterator struct {
	Event *TeritoriMinterUnpaused // Event containing the contract specifics and raw log

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
func (it *TeritoriMinterUnpausedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriMinterUnpaused)
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
		it.Event = new(TeritoriMinterUnpaused)
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
func (it *TeritoriMinterUnpausedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriMinterUnpausedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriMinterUnpaused represents a Unpaused event raised by the TeritoriMinter contract.
type TeritoriMinterUnpaused struct {
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterUnpaused is a free log retrieval operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_TeritoriMinter *TeritoriMinterFilterer) FilterUnpaused(opts *bind.FilterOpts) (*TeritoriMinterUnpausedIterator, error) {

	logs, sub, err := _TeritoriMinter.contract.FilterLogs(opts, "Unpaused")
	if err != nil {
		return nil, err
	}
	return &TeritoriMinterUnpausedIterator{contract: _TeritoriMinter.contract, event: "Unpaused", logs: logs, sub: sub}, nil
}

// WatchUnpaused is a free log subscription operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_TeritoriMinter *TeritoriMinterFilterer) WatchUnpaused(opts *bind.WatchOpts, sink chan<- *TeritoriMinterUnpaused) (event.Subscription, error) {

	logs, sub, err := _TeritoriMinter.contract.WatchLogs(opts, "Unpaused")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriMinterUnpaused)
				if err := _TeritoriMinter.contract.UnpackLog(event, "Unpaused", log); err != nil {
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

// ParseUnpaused is a log parse operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_TeritoriMinter *TeritoriMinterFilterer) ParseUnpaused(log types.Log) (*TeritoriMinterUnpaused, error) {
	event := new(TeritoriMinterUnpaused)
	if err := _TeritoriMinter.contract.UnpackLog(event, "Unpaused", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriMinterWithdrawFundIterator is returned from FilterWithdrawFund and is used to iterate over the raw logs and unpacked data for WithdrawFund events raised by the TeritoriMinter contract.
type TeritoriMinterWithdrawFundIterator struct {
	Event *TeritoriMinterWithdrawFund // Event containing the contract specifics and raw log

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
func (it *TeritoriMinterWithdrawFundIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriMinterWithdrawFund)
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
		it.Event = new(TeritoriMinterWithdrawFund)
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
func (it *TeritoriMinterWithdrawFundIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriMinterWithdrawFundIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriMinterWithdrawFund represents a WithdrawFund event raised by the TeritoriMinter contract.
type TeritoriMinterWithdrawFund struct {
	Token  common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterWithdrawFund is a free log retrieval operation binding the contract event 0x09ad672d4e7c4892da934d1051932ebe9ec4b6ec8c3f40d569176db3e93e5abe.
//
// Solidity: event WithdrawFund(address token, uint256 amount)
func (_TeritoriMinter *TeritoriMinterFilterer) FilterWithdrawFund(opts *bind.FilterOpts) (*TeritoriMinterWithdrawFundIterator, error) {

	logs, sub, err := _TeritoriMinter.contract.FilterLogs(opts, "WithdrawFund")
	if err != nil {
		return nil, err
	}
	return &TeritoriMinterWithdrawFundIterator{contract: _TeritoriMinter.contract, event: "WithdrawFund", logs: logs, sub: sub}, nil
}

// WatchWithdrawFund is a free log subscription operation binding the contract event 0x09ad672d4e7c4892da934d1051932ebe9ec4b6ec8c3f40d569176db3e93e5abe.
//
// Solidity: event WithdrawFund(address token, uint256 amount)
func (_TeritoriMinter *TeritoriMinterFilterer) WatchWithdrawFund(opts *bind.WatchOpts, sink chan<- *TeritoriMinterWithdrawFund) (event.Subscription, error) {

	logs, sub, err := _TeritoriMinter.contract.WatchLogs(opts, "WithdrawFund")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriMinterWithdrawFund)
				if err := _TeritoriMinter.contract.UnpackLog(event, "WithdrawFund", log); err != nil {
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

// ParseWithdrawFund is a log parse operation binding the contract event 0x09ad672d4e7c4892da934d1051932ebe9ec4b6ec8c3f40d569176db3e93e5abe.
//
// Solidity: event WithdrawFund(address token, uint256 amount)
func (_TeritoriMinter *TeritoriMinterFilterer) ParseWithdrawFund(log types.Log) (*TeritoriMinterWithdrawFund, error) {
	event := new(TeritoriMinterWithdrawFund)
	if err := _TeritoriMinter.contract.UnpackLog(event, "WithdrawFund", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

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

// SquadStakingV3NftInfo is an auto generated low-level Go binding around an user-defined struct.
type SquadStakingV3NftInfo struct {
	Collection common.Address
	TokenId    *big.Int
}

// SquadStakingV3SquadInfoWithIndex is an auto generated low-level Go binding around an user-defined struct.
type SquadStakingV3SquadInfoWithIndex struct {
	Index     *big.Int
	StartTime *big.Int
	EndTime   *big.Int
	Nfts      []SquadStakingV3NftInfo
}

// SquadStakingV3MetaData contains all meta data concerning the SquadStakingV3 contract.
var SquadStakingV3MetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_nftMetadataRegistry\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_minSquadSize\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_maxSquadSize\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_maxSquadCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_cooldownPeriod\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"_bonusMultipliers\",\"type\":\"uint256[]\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Paused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"startTime\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"endTime\",\"type\":\"uint256\"}],\"name\":\"Stake\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Unpaused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"Unstake\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"BONUS_MULTIPLIER_BASE_POINT\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"STAMINA\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"bonusMultipliers\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"cooldownPeriod\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"}],\"name\":\"isSupportedCollection\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"maxSquadCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"maxSquadSize\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"minSquadSize\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"nftMetadataRegistry\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"name\":\"onERC721Received\",\"outputs\":[{\"internalType\":\"bytes4\",\"name\":\"\",\"type\":\"bytes4\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"pause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"_size\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"_bonusMultipliers\",\"type\":\"uint256[]\"}],\"name\":\"setBonusMultiplier\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_cooldownPeriod\",\"type\":\"uint256\"}],\"name\":\"setCooldownPeriod\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_maxSquadCount\",\"type\":\"uint256\"}],\"name\":\"setMaxSquadCount\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_minSquadSize\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_maxSquadSize\",\"type\":\"uint256\"}],\"name\":\"setSquadSize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"collection\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"supported\",\"type\":\"bool\"}],\"name\":\"setSupportedCollection\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"collection\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"internalType\":\"structSquadStakingV3.NftInfo[]\",\"name\":\"nfts\",\"type\":\"tuple[]\"}],\"name\":\"stake\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"collection\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"size\",\"type\":\"uint256\"}],\"name\":\"stakeDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"supportedCollectionAt\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"supportedCollectionLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"supportedCollections\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"collections\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"unpause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"unstake\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"userSquadCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"userSquadInfo\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"startTime\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endTime\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"collection\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"internalType\":\"structSquadStakingV3.NftInfo[]\",\"name\":\"nfts\",\"type\":\"tuple[]\"}],\"internalType\":\"structSquadStakingV3.SquadInfoWithIndex[]\",\"name\":\"squads\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// SquadStakingV3ABI is the input ABI used to generate the binding from.
// Deprecated: Use SquadStakingV3MetaData.ABI instead.
var SquadStakingV3ABI = SquadStakingV3MetaData.ABI

// SquadStakingV3 is an auto generated Go binding around an Ethereum contract.
type SquadStakingV3 struct {
	SquadStakingV3Caller     // Read-only binding to the contract
	SquadStakingV3Transactor // Write-only binding to the contract
	SquadStakingV3Filterer   // Log filterer for contract events
}

// SquadStakingV3Caller is an auto generated read-only Go binding around an Ethereum contract.
type SquadStakingV3Caller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SquadStakingV3Transactor is an auto generated write-only Go binding around an Ethereum contract.
type SquadStakingV3Transactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SquadStakingV3Filterer is an auto generated log filtering Go binding around an Ethereum contract events.
type SquadStakingV3Filterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SquadStakingV3Session is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type SquadStakingV3Session struct {
	Contract     *SquadStakingV3   // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// SquadStakingV3CallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type SquadStakingV3CallerSession struct {
	Contract *SquadStakingV3Caller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts         // Call options to use throughout this session
}

// SquadStakingV3TransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type SquadStakingV3TransactorSession struct {
	Contract     *SquadStakingV3Transactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts         // Transaction auth options to use throughout this session
}

// SquadStakingV3Raw is an auto generated low-level Go binding around an Ethereum contract.
type SquadStakingV3Raw struct {
	Contract *SquadStakingV3 // Generic contract binding to access the raw methods on
}

// SquadStakingV3CallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type SquadStakingV3CallerRaw struct {
	Contract *SquadStakingV3Caller // Generic read-only contract binding to access the raw methods on
}

// SquadStakingV3TransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type SquadStakingV3TransactorRaw struct {
	Contract *SquadStakingV3Transactor // Generic write-only contract binding to access the raw methods on
}

// NewSquadStakingV3 creates a new instance of SquadStakingV3, bound to a specific deployed contract.
func NewSquadStakingV3(address common.Address, backend bind.ContractBackend) (*SquadStakingV3, error) {
	contract, err := bindSquadStakingV3(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3{SquadStakingV3Caller: SquadStakingV3Caller{contract: contract}, SquadStakingV3Transactor: SquadStakingV3Transactor{contract: contract}, SquadStakingV3Filterer: SquadStakingV3Filterer{contract: contract}}, nil
}

// NewSquadStakingV3Caller creates a new read-only instance of SquadStakingV3, bound to a specific deployed contract.
func NewSquadStakingV3Caller(address common.Address, caller bind.ContractCaller) (*SquadStakingV3Caller, error) {
	contract, err := bindSquadStakingV3(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3Caller{contract: contract}, nil
}

// NewSquadStakingV3Transactor creates a new write-only instance of SquadStakingV3, bound to a specific deployed contract.
func NewSquadStakingV3Transactor(address common.Address, transactor bind.ContractTransactor) (*SquadStakingV3Transactor, error) {
	contract, err := bindSquadStakingV3(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3Transactor{contract: contract}, nil
}

// NewSquadStakingV3Filterer creates a new log filterer instance of SquadStakingV3, bound to a specific deployed contract.
func NewSquadStakingV3Filterer(address common.Address, filterer bind.ContractFilterer) (*SquadStakingV3Filterer, error) {
	contract, err := bindSquadStakingV3(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3Filterer{contract: contract}, nil
}

// bindSquadStakingV3 binds a generic wrapper to an already deployed contract.
func bindSquadStakingV3(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := SquadStakingV3MetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_SquadStakingV3 *SquadStakingV3Raw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _SquadStakingV3.Contract.SquadStakingV3Caller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_SquadStakingV3 *SquadStakingV3Raw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SquadStakingV3Transactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_SquadStakingV3 *SquadStakingV3Raw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SquadStakingV3Transactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_SquadStakingV3 *SquadStakingV3CallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _SquadStakingV3.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_SquadStakingV3 *SquadStakingV3TransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_SquadStakingV3 *SquadStakingV3TransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.contract.Transact(opts, method, params...)
}

// BONUSMULTIPLIERBASEPOINT is a free data retrieval call binding the contract method 0x62b2c8fe.
//
// Solidity: function BONUS_MULTIPLIER_BASE_POINT() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) BONUSMULTIPLIERBASEPOINT(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "BONUS_MULTIPLIER_BASE_POINT")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BONUSMULTIPLIERBASEPOINT is a free data retrieval call binding the contract method 0x62b2c8fe.
//
// Solidity: function BONUS_MULTIPLIER_BASE_POINT() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) BONUSMULTIPLIERBASEPOINT() (*big.Int, error) {
	return _SquadStakingV3.Contract.BONUSMULTIPLIERBASEPOINT(&_SquadStakingV3.CallOpts)
}

// BONUSMULTIPLIERBASEPOINT is a free data retrieval call binding the contract method 0x62b2c8fe.
//
// Solidity: function BONUS_MULTIPLIER_BASE_POINT() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) BONUSMULTIPLIERBASEPOINT() (*big.Int, error) {
	return _SquadStakingV3.Contract.BONUSMULTIPLIERBASEPOINT(&_SquadStakingV3.CallOpts)
}

// STAMINA is a free data retrieval call binding the contract method 0x442e6420.
//
// Solidity: function STAMINA() view returns(bytes32)
func (_SquadStakingV3 *SquadStakingV3Caller) STAMINA(opts *bind.CallOpts) ([32]byte, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "STAMINA")

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// STAMINA is a free data retrieval call binding the contract method 0x442e6420.
//
// Solidity: function STAMINA() view returns(bytes32)
func (_SquadStakingV3 *SquadStakingV3Session) STAMINA() ([32]byte, error) {
	return _SquadStakingV3.Contract.STAMINA(&_SquadStakingV3.CallOpts)
}

// STAMINA is a free data retrieval call binding the contract method 0x442e6420.
//
// Solidity: function STAMINA() view returns(bytes32)
func (_SquadStakingV3 *SquadStakingV3CallerSession) STAMINA() ([32]byte, error) {
	return _SquadStakingV3.Contract.STAMINA(&_SquadStakingV3.CallOpts)
}

// BonusMultipliers is a free data retrieval call binding the contract method 0x0bf242d8.
//
// Solidity: function bonusMultipliers(uint256 ) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) BonusMultipliers(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "bonusMultipliers", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BonusMultipliers is a free data retrieval call binding the contract method 0x0bf242d8.
//
// Solidity: function bonusMultipliers(uint256 ) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) BonusMultipliers(arg0 *big.Int) (*big.Int, error) {
	return _SquadStakingV3.Contract.BonusMultipliers(&_SquadStakingV3.CallOpts, arg0)
}

// BonusMultipliers is a free data retrieval call binding the contract method 0x0bf242d8.
//
// Solidity: function bonusMultipliers(uint256 ) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) BonusMultipliers(arg0 *big.Int) (*big.Int, error) {
	return _SquadStakingV3.Contract.BonusMultipliers(&_SquadStakingV3.CallOpts, arg0)
}

// CooldownPeriod is a free data retrieval call binding the contract method 0x04646a49.
//
// Solidity: function cooldownPeriod() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) CooldownPeriod(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "cooldownPeriod")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// CooldownPeriod is a free data retrieval call binding the contract method 0x04646a49.
//
// Solidity: function cooldownPeriod() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) CooldownPeriod() (*big.Int, error) {
	return _SquadStakingV3.Contract.CooldownPeriod(&_SquadStakingV3.CallOpts)
}

// CooldownPeriod is a free data retrieval call binding the contract method 0x04646a49.
//
// Solidity: function cooldownPeriod() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) CooldownPeriod() (*big.Int, error) {
	return _SquadStakingV3.Contract.CooldownPeriod(&_SquadStakingV3.CallOpts)
}

// IsSupportedCollection is a free data retrieval call binding the contract method 0x251f2e8a.
//
// Solidity: function isSupportedCollection(address nft) view returns(bool)
func (_SquadStakingV3 *SquadStakingV3Caller) IsSupportedCollection(opts *bind.CallOpts, nft common.Address) (bool, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "isSupportedCollection", nft)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsSupportedCollection is a free data retrieval call binding the contract method 0x251f2e8a.
//
// Solidity: function isSupportedCollection(address nft) view returns(bool)
func (_SquadStakingV3 *SquadStakingV3Session) IsSupportedCollection(nft common.Address) (bool, error) {
	return _SquadStakingV3.Contract.IsSupportedCollection(&_SquadStakingV3.CallOpts, nft)
}

// IsSupportedCollection is a free data retrieval call binding the contract method 0x251f2e8a.
//
// Solidity: function isSupportedCollection(address nft) view returns(bool)
func (_SquadStakingV3 *SquadStakingV3CallerSession) IsSupportedCollection(nft common.Address) (bool, error) {
	return _SquadStakingV3.Contract.IsSupportedCollection(&_SquadStakingV3.CallOpts, nft)
}

// MaxSquadCount is a free data retrieval call binding the contract method 0x8044ef8f.
//
// Solidity: function maxSquadCount() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) MaxSquadCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "maxSquadCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MaxSquadCount is a free data retrieval call binding the contract method 0x8044ef8f.
//
// Solidity: function maxSquadCount() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) MaxSquadCount() (*big.Int, error) {
	return _SquadStakingV3.Contract.MaxSquadCount(&_SquadStakingV3.CallOpts)
}

// MaxSquadCount is a free data retrieval call binding the contract method 0x8044ef8f.
//
// Solidity: function maxSquadCount() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) MaxSquadCount() (*big.Int, error) {
	return _SquadStakingV3.Contract.MaxSquadCount(&_SquadStakingV3.CallOpts)
}

// MaxSquadSize is a free data retrieval call binding the contract method 0x8994929e.
//
// Solidity: function maxSquadSize() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) MaxSquadSize(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "maxSquadSize")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MaxSquadSize is a free data retrieval call binding the contract method 0x8994929e.
//
// Solidity: function maxSquadSize() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) MaxSquadSize() (*big.Int, error) {
	return _SquadStakingV3.Contract.MaxSquadSize(&_SquadStakingV3.CallOpts)
}

// MaxSquadSize is a free data retrieval call binding the contract method 0x8994929e.
//
// Solidity: function maxSquadSize() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) MaxSquadSize() (*big.Int, error) {
	return _SquadStakingV3.Contract.MaxSquadSize(&_SquadStakingV3.CallOpts)
}

// MinSquadSize is a free data retrieval call binding the contract method 0x4b8544f2.
//
// Solidity: function minSquadSize() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) MinSquadSize(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "minSquadSize")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MinSquadSize is a free data retrieval call binding the contract method 0x4b8544f2.
//
// Solidity: function minSquadSize() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) MinSquadSize() (*big.Int, error) {
	return _SquadStakingV3.Contract.MinSquadSize(&_SquadStakingV3.CallOpts)
}

// MinSquadSize is a free data retrieval call binding the contract method 0x4b8544f2.
//
// Solidity: function minSquadSize() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) MinSquadSize() (*big.Int, error) {
	return _SquadStakingV3.Contract.MinSquadSize(&_SquadStakingV3.CallOpts)
}

// NftMetadataRegistry is a free data retrieval call binding the contract method 0x2c87572b.
//
// Solidity: function nftMetadataRegistry() view returns(address)
func (_SquadStakingV3 *SquadStakingV3Caller) NftMetadataRegistry(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "nftMetadataRegistry")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// NftMetadataRegistry is a free data retrieval call binding the contract method 0x2c87572b.
//
// Solidity: function nftMetadataRegistry() view returns(address)
func (_SquadStakingV3 *SquadStakingV3Session) NftMetadataRegistry() (common.Address, error) {
	return _SquadStakingV3.Contract.NftMetadataRegistry(&_SquadStakingV3.CallOpts)
}

// NftMetadataRegistry is a free data retrieval call binding the contract method 0x2c87572b.
//
// Solidity: function nftMetadataRegistry() view returns(address)
func (_SquadStakingV3 *SquadStakingV3CallerSession) NftMetadataRegistry() (common.Address, error) {
	return _SquadStakingV3.Contract.NftMetadataRegistry(&_SquadStakingV3.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SquadStakingV3 *SquadStakingV3Caller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SquadStakingV3 *SquadStakingV3Session) Owner() (common.Address, error) {
	return _SquadStakingV3.Contract.Owner(&_SquadStakingV3.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_SquadStakingV3 *SquadStakingV3CallerSession) Owner() (common.Address, error) {
	return _SquadStakingV3.Contract.Owner(&_SquadStakingV3.CallOpts)
}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_SquadStakingV3 *SquadStakingV3Caller) Paused(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "paused")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_SquadStakingV3 *SquadStakingV3Session) Paused() (bool, error) {
	return _SquadStakingV3.Contract.Paused(&_SquadStakingV3.CallOpts)
}

// Paused is a free data retrieval call binding the contract method 0x5c975abb.
//
// Solidity: function paused() view returns(bool)
func (_SquadStakingV3 *SquadStakingV3CallerSession) Paused() (bool, error) {
	return _SquadStakingV3.Contract.Paused(&_SquadStakingV3.CallOpts)
}

// StakeDuration is a free data retrieval call binding the contract method 0xa16e3607.
//
// Solidity: function stakeDuration(address collection, uint256 tokenId, uint256 size) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) StakeDuration(opts *bind.CallOpts, collection common.Address, tokenId *big.Int, size *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "stakeDuration", collection, tokenId, size)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StakeDuration is a free data retrieval call binding the contract method 0xa16e3607.
//
// Solidity: function stakeDuration(address collection, uint256 tokenId, uint256 size) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) StakeDuration(collection common.Address, tokenId *big.Int, size *big.Int) (*big.Int, error) {
	return _SquadStakingV3.Contract.StakeDuration(&_SquadStakingV3.CallOpts, collection, tokenId, size)
}

// StakeDuration is a free data retrieval call binding the contract method 0xa16e3607.
//
// Solidity: function stakeDuration(address collection, uint256 tokenId, uint256 size) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) StakeDuration(collection common.Address, tokenId *big.Int, size *big.Int) (*big.Int, error) {
	return _SquadStakingV3.Contract.StakeDuration(&_SquadStakingV3.CallOpts, collection, tokenId, size)
}

// SupportedCollectionAt is a free data retrieval call binding the contract method 0x1e1a3d35.
//
// Solidity: function supportedCollectionAt(uint256 index) view returns(address)
func (_SquadStakingV3 *SquadStakingV3Caller) SupportedCollectionAt(opts *bind.CallOpts, index *big.Int) (common.Address, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "supportedCollectionAt", index)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// SupportedCollectionAt is a free data retrieval call binding the contract method 0x1e1a3d35.
//
// Solidity: function supportedCollectionAt(uint256 index) view returns(address)
func (_SquadStakingV3 *SquadStakingV3Session) SupportedCollectionAt(index *big.Int) (common.Address, error) {
	return _SquadStakingV3.Contract.SupportedCollectionAt(&_SquadStakingV3.CallOpts, index)
}

// SupportedCollectionAt is a free data retrieval call binding the contract method 0x1e1a3d35.
//
// Solidity: function supportedCollectionAt(uint256 index) view returns(address)
func (_SquadStakingV3 *SquadStakingV3CallerSession) SupportedCollectionAt(index *big.Int) (common.Address, error) {
	return _SquadStakingV3.Contract.SupportedCollectionAt(&_SquadStakingV3.CallOpts, index)
}

// SupportedCollectionLength is a free data retrieval call binding the contract method 0x014b5c10.
//
// Solidity: function supportedCollectionLength() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) SupportedCollectionLength(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "supportedCollectionLength")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// SupportedCollectionLength is a free data retrieval call binding the contract method 0x014b5c10.
//
// Solidity: function supportedCollectionLength() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) SupportedCollectionLength() (*big.Int, error) {
	return _SquadStakingV3.Contract.SupportedCollectionLength(&_SquadStakingV3.CallOpts)
}

// SupportedCollectionLength is a free data retrieval call binding the contract method 0x014b5c10.
//
// Solidity: function supportedCollectionLength() view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) SupportedCollectionLength() (*big.Int, error) {
	return _SquadStakingV3.Contract.SupportedCollectionLength(&_SquadStakingV3.CallOpts)
}

// SupportedCollections is a free data retrieval call binding the contract method 0x8178c4df.
//
// Solidity: function supportedCollections(uint256 index) view returns(address[] collections)
func (_SquadStakingV3 *SquadStakingV3Caller) SupportedCollections(opts *bind.CallOpts, index *big.Int) ([]common.Address, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "supportedCollections", index)

	if err != nil {
		return *new([]common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new([]common.Address)).(*[]common.Address)

	return out0, err

}

// SupportedCollections is a free data retrieval call binding the contract method 0x8178c4df.
//
// Solidity: function supportedCollections(uint256 index) view returns(address[] collections)
func (_SquadStakingV3 *SquadStakingV3Session) SupportedCollections(index *big.Int) ([]common.Address, error) {
	return _SquadStakingV3.Contract.SupportedCollections(&_SquadStakingV3.CallOpts, index)
}

// SupportedCollections is a free data retrieval call binding the contract method 0x8178c4df.
//
// Solidity: function supportedCollections(uint256 index) view returns(address[] collections)
func (_SquadStakingV3 *SquadStakingV3CallerSession) SupportedCollections(index *big.Int) ([]common.Address, error) {
	return _SquadStakingV3.Contract.SupportedCollections(&_SquadStakingV3.CallOpts, index)
}

// UserSquadCount is a free data retrieval call binding the contract method 0xa18d50b4.
//
// Solidity: function userSquadCount(address user) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Caller) UserSquadCount(opts *bind.CallOpts, user common.Address) (*big.Int, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "userSquadCount", user)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// UserSquadCount is a free data retrieval call binding the contract method 0xa18d50b4.
//
// Solidity: function userSquadCount(address user) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3Session) UserSquadCount(user common.Address) (*big.Int, error) {
	return _SquadStakingV3.Contract.UserSquadCount(&_SquadStakingV3.CallOpts, user)
}

// UserSquadCount is a free data retrieval call binding the contract method 0xa18d50b4.
//
// Solidity: function userSquadCount(address user) view returns(uint256)
func (_SquadStakingV3 *SquadStakingV3CallerSession) UserSquadCount(user common.Address) (*big.Int, error) {
	return _SquadStakingV3.Contract.UserSquadCount(&_SquadStakingV3.CallOpts, user)
}

// UserSquadInfo is a free data retrieval call binding the contract method 0xca777933.
//
// Solidity: function userSquadInfo(address user) view returns((uint256,uint256,uint256,(address,uint256)[])[] squads)
func (_SquadStakingV3 *SquadStakingV3Caller) UserSquadInfo(opts *bind.CallOpts, user common.Address) ([]SquadStakingV3SquadInfoWithIndex, error) {
	var out []interface{}
	err := _SquadStakingV3.contract.Call(opts, &out, "userSquadInfo", user)

	if err != nil {
		return *new([]SquadStakingV3SquadInfoWithIndex), err
	}

	out0 := *abi.ConvertType(out[0], new([]SquadStakingV3SquadInfoWithIndex)).(*[]SquadStakingV3SquadInfoWithIndex)

	return out0, err

}

// UserSquadInfo is a free data retrieval call binding the contract method 0xca777933.
//
// Solidity: function userSquadInfo(address user) view returns((uint256,uint256,uint256,(address,uint256)[])[] squads)
func (_SquadStakingV3 *SquadStakingV3Session) UserSquadInfo(user common.Address) ([]SquadStakingV3SquadInfoWithIndex, error) {
	return _SquadStakingV3.Contract.UserSquadInfo(&_SquadStakingV3.CallOpts, user)
}

// UserSquadInfo is a free data retrieval call binding the contract method 0xca777933.
//
// Solidity: function userSquadInfo(address user) view returns((uint256,uint256,uint256,(address,uint256)[])[] squads)
func (_SquadStakingV3 *SquadStakingV3CallerSession) UserSquadInfo(user common.Address) ([]SquadStakingV3SquadInfoWithIndex, error) {
	return _SquadStakingV3.Contract.UserSquadInfo(&_SquadStakingV3.CallOpts, user)
}

// OnERC721Received is a paid mutator transaction binding the contract method 0x150b7a02.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) returns(bytes4)
func (_SquadStakingV3 *SquadStakingV3Transactor) OnERC721Received(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "onERC721Received", arg0, arg1, arg2, arg3)
}

// OnERC721Received is a paid mutator transaction binding the contract method 0x150b7a02.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) returns(bytes4)
func (_SquadStakingV3 *SquadStakingV3Session) OnERC721Received(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.OnERC721Received(&_SquadStakingV3.TransactOpts, arg0, arg1, arg2, arg3)
}

// OnERC721Received is a paid mutator transaction binding the contract method 0x150b7a02.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) returns(bytes4)
func (_SquadStakingV3 *SquadStakingV3TransactorSession) OnERC721Received(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.OnERC721Received(&_SquadStakingV3.TransactOpts, arg0, arg1, arg2, arg3)
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) Pause(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "pause")
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_SquadStakingV3 *SquadStakingV3Session) Pause() (*types.Transaction, error) {
	return _SquadStakingV3.Contract.Pause(&_SquadStakingV3.TransactOpts)
}

// Pause is a paid mutator transaction binding the contract method 0x8456cb59.
//
// Solidity: function pause() returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) Pause() (*types.Transaction, error) {
	return _SquadStakingV3.Contract.Pause(&_SquadStakingV3.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_SquadStakingV3 *SquadStakingV3Session) RenounceOwnership() (*types.Transaction, error) {
	return _SquadStakingV3.Contract.RenounceOwnership(&_SquadStakingV3.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _SquadStakingV3.Contract.RenounceOwnership(&_SquadStakingV3.TransactOpts)
}

// SetBonusMultiplier is a paid mutator transaction binding the contract method 0x1f1a31d6.
//
// Solidity: function setBonusMultiplier(uint256[] _size, uint256[] _bonusMultipliers) returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) SetBonusMultiplier(opts *bind.TransactOpts, _size []*big.Int, _bonusMultipliers []*big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "setBonusMultiplier", _size, _bonusMultipliers)
}

// SetBonusMultiplier is a paid mutator transaction binding the contract method 0x1f1a31d6.
//
// Solidity: function setBonusMultiplier(uint256[] _size, uint256[] _bonusMultipliers) returns()
func (_SquadStakingV3 *SquadStakingV3Session) SetBonusMultiplier(_size []*big.Int, _bonusMultipliers []*big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetBonusMultiplier(&_SquadStakingV3.TransactOpts, _size, _bonusMultipliers)
}

// SetBonusMultiplier is a paid mutator transaction binding the contract method 0x1f1a31d6.
//
// Solidity: function setBonusMultiplier(uint256[] _size, uint256[] _bonusMultipliers) returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) SetBonusMultiplier(_size []*big.Int, _bonusMultipliers []*big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetBonusMultiplier(&_SquadStakingV3.TransactOpts, _size, _bonusMultipliers)
}

// SetCooldownPeriod is a paid mutator transaction binding the contract method 0x80ea3de1.
//
// Solidity: function setCooldownPeriod(uint256 _cooldownPeriod) returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) SetCooldownPeriod(opts *bind.TransactOpts, _cooldownPeriod *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "setCooldownPeriod", _cooldownPeriod)
}

// SetCooldownPeriod is a paid mutator transaction binding the contract method 0x80ea3de1.
//
// Solidity: function setCooldownPeriod(uint256 _cooldownPeriod) returns()
func (_SquadStakingV3 *SquadStakingV3Session) SetCooldownPeriod(_cooldownPeriod *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetCooldownPeriod(&_SquadStakingV3.TransactOpts, _cooldownPeriod)
}

// SetCooldownPeriod is a paid mutator transaction binding the contract method 0x80ea3de1.
//
// Solidity: function setCooldownPeriod(uint256 _cooldownPeriod) returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) SetCooldownPeriod(_cooldownPeriod *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetCooldownPeriod(&_SquadStakingV3.TransactOpts, _cooldownPeriod)
}

// SetMaxSquadCount is a paid mutator transaction binding the contract method 0x9427144c.
//
// Solidity: function setMaxSquadCount(uint256 _maxSquadCount) returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) SetMaxSquadCount(opts *bind.TransactOpts, _maxSquadCount *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "setMaxSquadCount", _maxSquadCount)
}

// SetMaxSquadCount is a paid mutator transaction binding the contract method 0x9427144c.
//
// Solidity: function setMaxSquadCount(uint256 _maxSquadCount) returns()
func (_SquadStakingV3 *SquadStakingV3Session) SetMaxSquadCount(_maxSquadCount *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetMaxSquadCount(&_SquadStakingV3.TransactOpts, _maxSquadCount)
}

// SetMaxSquadCount is a paid mutator transaction binding the contract method 0x9427144c.
//
// Solidity: function setMaxSquadCount(uint256 _maxSquadCount) returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) SetMaxSquadCount(_maxSquadCount *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetMaxSquadCount(&_SquadStakingV3.TransactOpts, _maxSquadCount)
}

// SetSquadSize is a paid mutator transaction binding the contract method 0xae7521a4.
//
// Solidity: function setSquadSize(uint256 _minSquadSize, uint256 _maxSquadSize) returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) SetSquadSize(opts *bind.TransactOpts, _minSquadSize *big.Int, _maxSquadSize *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "setSquadSize", _minSquadSize, _maxSquadSize)
}

// SetSquadSize is a paid mutator transaction binding the contract method 0xae7521a4.
//
// Solidity: function setSquadSize(uint256 _minSquadSize, uint256 _maxSquadSize) returns()
func (_SquadStakingV3 *SquadStakingV3Session) SetSquadSize(_minSquadSize *big.Int, _maxSquadSize *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetSquadSize(&_SquadStakingV3.TransactOpts, _minSquadSize, _maxSquadSize)
}

// SetSquadSize is a paid mutator transaction binding the contract method 0xae7521a4.
//
// Solidity: function setSquadSize(uint256 _minSquadSize, uint256 _maxSquadSize) returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) SetSquadSize(_minSquadSize *big.Int, _maxSquadSize *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetSquadSize(&_SquadStakingV3.TransactOpts, _minSquadSize, _maxSquadSize)
}

// SetSupportedCollection is a paid mutator transaction binding the contract method 0x0bed494c.
//
// Solidity: function setSupportedCollection(address collection, bool supported) returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) SetSupportedCollection(opts *bind.TransactOpts, collection common.Address, supported bool) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "setSupportedCollection", collection, supported)
}

// SetSupportedCollection is a paid mutator transaction binding the contract method 0x0bed494c.
//
// Solidity: function setSupportedCollection(address collection, bool supported) returns()
func (_SquadStakingV3 *SquadStakingV3Session) SetSupportedCollection(collection common.Address, supported bool) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetSupportedCollection(&_SquadStakingV3.TransactOpts, collection, supported)
}

// SetSupportedCollection is a paid mutator transaction binding the contract method 0x0bed494c.
//
// Solidity: function setSupportedCollection(address collection, bool supported) returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) SetSupportedCollection(collection common.Address, supported bool) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.SetSupportedCollection(&_SquadStakingV3.TransactOpts, collection, supported)
}

// Stake is a paid mutator transaction binding the contract method 0x801c5236.
//
// Solidity: function stake((address,uint256)[] nfts) returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) Stake(opts *bind.TransactOpts, nfts []SquadStakingV3NftInfo) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "stake", nfts)
}

// Stake is a paid mutator transaction binding the contract method 0x801c5236.
//
// Solidity: function stake((address,uint256)[] nfts) returns()
func (_SquadStakingV3 *SquadStakingV3Session) Stake(nfts []SquadStakingV3NftInfo) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.Stake(&_SquadStakingV3.TransactOpts, nfts)
}

// Stake is a paid mutator transaction binding the contract method 0x801c5236.
//
// Solidity: function stake((address,uint256)[] nfts) returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) Stake(nfts []SquadStakingV3NftInfo) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.Stake(&_SquadStakingV3.TransactOpts, nfts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SquadStakingV3 *SquadStakingV3Session) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.TransferOwnership(&_SquadStakingV3.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.TransferOwnership(&_SquadStakingV3.TransactOpts, newOwner)
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) Unpause(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "unpause")
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_SquadStakingV3 *SquadStakingV3Session) Unpause() (*types.Transaction, error) {
	return _SquadStakingV3.Contract.Unpause(&_SquadStakingV3.TransactOpts)
}

// Unpause is a paid mutator transaction binding the contract method 0x3f4ba83a.
//
// Solidity: function unpause() returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) Unpause() (*types.Transaction, error) {
	return _SquadStakingV3.Contract.Unpause(&_SquadStakingV3.TransactOpts)
}

// Unstake is a paid mutator transaction binding the contract method 0x2e17de78.
//
// Solidity: function unstake(uint256 index) returns()
func (_SquadStakingV3 *SquadStakingV3Transactor) Unstake(opts *bind.TransactOpts, index *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.contract.Transact(opts, "unstake", index)
}

// Unstake is a paid mutator transaction binding the contract method 0x2e17de78.
//
// Solidity: function unstake(uint256 index) returns()
func (_SquadStakingV3 *SquadStakingV3Session) Unstake(index *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.Unstake(&_SquadStakingV3.TransactOpts, index)
}

// Unstake is a paid mutator transaction binding the contract method 0x2e17de78.
//
// Solidity: function unstake(uint256 index) returns()
func (_SquadStakingV3 *SquadStakingV3TransactorSession) Unstake(index *big.Int) (*types.Transaction, error) {
	return _SquadStakingV3.Contract.Unstake(&_SquadStakingV3.TransactOpts, index)
}

// SquadStakingV3OwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the SquadStakingV3 contract.
type SquadStakingV3OwnershipTransferredIterator struct {
	Event *SquadStakingV3OwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *SquadStakingV3OwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SquadStakingV3OwnershipTransferred)
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
		it.Event = new(SquadStakingV3OwnershipTransferred)
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
func (it *SquadStakingV3OwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SquadStakingV3OwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SquadStakingV3OwnershipTransferred represents a OwnershipTransferred event raised by the SquadStakingV3 contract.
type SquadStakingV3OwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_SquadStakingV3 *SquadStakingV3Filterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*SquadStakingV3OwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _SquadStakingV3.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3OwnershipTransferredIterator{contract: _SquadStakingV3.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_SquadStakingV3 *SquadStakingV3Filterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *SquadStakingV3OwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _SquadStakingV3.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SquadStakingV3OwnershipTransferred)
				if err := _SquadStakingV3.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_SquadStakingV3 *SquadStakingV3Filterer) ParseOwnershipTransferred(log types.Log) (*SquadStakingV3OwnershipTransferred, error) {
	event := new(SquadStakingV3OwnershipTransferred)
	if err := _SquadStakingV3.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SquadStakingV3PausedIterator is returned from FilterPaused and is used to iterate over the raw logs and unpacked data for Paused events raised by the SquadStakingV3 contract.
type SquadStakingV3PausedIterator struct {
	Event *SquadStakingV3Paused // Event containing the contract specifics and raw log

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
func (it *SquadStakingV3PausedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SquadStakingV3Paused)
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
		it.Event = new(SquadStakingV3Paused)
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
func (it *SquadStakingV3PausedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SquadStakingV3PausedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SquadStakingV3Paused represents a Paused event raised by the SquadStakingV3 contract.
type SquadStakingV3Paused struct {
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterPaused is a free log retrieval operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_SquadStakingV3 *SquadStakingV3Filterer) FilterPaused(opts *bind.FilterOpts) (*SquadStakingV3PausedIterator, error) {

	logs, sub, err := _SquadStakingV3.contract.FilterLogs(opts, "Paused")
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3PausedIterator{contract: _SquadStakingV3.contract, event: "Paused", logs: logs, sub: sub}, nil
}

// WatchPaused is a free log subscription operation binding the contract event 0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258.
//
// Solidity: event Paused(address account)
func (_SquadStakingV3 *SquadStakingV3Filterer) WatchPaused(opts *bind.WatchOpts, sink chan<- *SquadStakingV3Paused) (event.Subscription, error) {

	logs, sub, err := _SquadStakingV3.contract.WatchLogs(opts, "Paused")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SquadStakingV3Paused)
				if err := _SquadStakingV3.contract.UnpackLog(event, "Paused", log); err != nil {
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
func (_SquadStakingV3 *SquadStakingV3Filterer) ParsePaused(log types.Log) (*SquadStakingV3Paused, error) {
	event := new(SquadStakingV3Paused)
	if err := _SquadStakingV3.contract.UnpackLog(event, "Paused", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SquadStakingV3StakeIterator is returned from FilterStake and is used to iterate over the raw logs and unpacked data for Stake events raised by the SquadStakingV3 contract.
type SquadStakingV3StakeIterator struct {
	Event *SquadStakingV3Stake // Event containing the contract specifics and raw log

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
func (it *SquadStakingV3StakeIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SquadStakingV3Stake)
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
		it.Event = new(SquadStakingV3Stake)
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
func (it *SquadStakingV3StakeIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SquadStakingV3StakeIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SquadStakingV3Stake represents a Stake event raised by the SquadStakingV3 contract.
type SquadStakingV3Stake struct {
	User      common.Address
	StartTime *big.Int
	EndTime   *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterStake is a free log retrieval operation binding the contract event 0x5af417134f72a9d41143ace85b0a26dce6f550f894f2cbc1eeee8810603d91b6.
//
// Solidity: event Stake(address user, uint256 startTime, uint256 endTime)
func (_SquadStakingV3 *SquadStakingV3Filterer) FilterStake(opts *bind.FilterOpts) (*SquadStakingV3StakeIterator, error) {

	logs, sub, err := _SquadStakingV3.contract.FilterLogs(opts, "Stake")
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3StakeIterator{contract: _SquadStakingV3.contract, event: "Stake", logs: logs, sub: sub}, nil
}

// WatchStake is a free log subscription operation binding the contract event 0x5af417134f72a9d41143ace85b0a26dce6f550f894f2cbc1eeee8810603d91b6.
//
// Solidity: event Stake(address user, uint256 startTime, uint256 endTime)
func (_SquadStakingV3 *SquadStakingV3Filterer) WatchStake(opts *bind.WatchOpts, sink chan<- *SquadStakingV3Stake) (event.Subscription, error) {

	logs, sub, err := _SquadStakingV3.contract.WatchLogs(opts, "Stake")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SquadStakingV3Stake)
				if err := _SquadStakingV3.contract.UnpackLog(event, "Stake", log); err != nil {
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

// ParseStake is a log parse operation binding the contract event 0x5af417134f72a9d41143ace85b0a26dce6f550f894f2cbc1eeee8810603d91b6.
//
// Solidity: event Stake(address user, uint256 startTime, uint256 endTime)
func (_SquadStakingV3 *SquadStakingV3Filterer) ParseStake(log types.Log) (*SquadStakingV3Stake, error) {
	event := new(SquadStakingV3Stake)
	if err := _SquadStakingV3.contract.UnpackLog(event, "Stake", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SquadStakingV3UnpausedIterator is returned from FilterUnpaused and is used to iterate over the raw logs and unpacked data for Unpaused events raised by the SquadStakingV3 contract.
type SquadStakingV3UnpausedIterator struct {
	Event *SquadStakingV3Unpaused // Event containing the contract specifics and raw log

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
func (it *SquadStakingV3UnpausedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SquadStakingV3Unpaused)
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
		it.Event = new(SquadStakingV3Unpaused)
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
func (it *SquadStakingV3UnpausedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SquadStakingV3UnpausedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SquadStakingV3Unpaused represents a Unpaused event raised by the SquadStakingV3 contract.
type SquadStakingV3Unpaused struct {
	Account common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterUnpaused is a free log retrieval operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_SquadStakingV3 *SquadStakingV3Filterer) FilterUnpaused(opts *bind.FilterOpts) (*SquadStakingV3UnpausedIterator, error) {

	logs, sub, err := _SquadStakingV3.contract.FilterLogs(opts, "Unpaused")
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3UnpausedIterator{contract: _SquadStakingV3.contract, event: "Unpaused", logs: logs, sub: sub}, nil
}

// WatchUnpaused is a free log subscription operation binding the contract event 0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa.
//
// Solidity: event Unpaused(address account)
func (_SquadStakingV3 *SquadStakingV3Filterer) WatchUnpaused(opts *bind.WatchOpts, sink chan<- *SquadStakingV3Unpaused) (event.Subscription, error) {

	logs, sub, err := _SquadStakingV3.contract.WatchLogs(opts, "Unpaused")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SquadStakingV3Unpaused)
				if err := _SquadStakingV3.contract.UnpackLog(event, "Unpaused", log); err != nil {
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
func (_SquadStakingV3 *SquadStakingV3Filterer) ParseUnpaused(log types.Log) (*SquadStakingV3Unpaused, error) {
	event := new(SquadStakingV3Unpaused)
	if err := _SquadStakingV3.contract.UnpackLog(event, "Unpaused", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SquadStakingV3UnstakeIterator is returned from FilterUnstake and is used to iterate over the raw logs and unpacked data for Unstake events raised by the SquadStakingV3 contract.
type SquadStakingV3UnstakeIterator struct {
	Event *SquadStakingV3Unstake // Event containing the contract specifics and raw log

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
func (it *SquadStakingV3UnstakeIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SquadStakingV3Unstake)
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
		it.Event = new(SquadStakingV3Unstake)
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
func (it *SquadStakingV3UnstakeIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SquadStakingV3UnstakeIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SquadStakingV3Unstake represents a Unstake event raised by the SquadStakingV3 contract.
type SquadStakingV3Unstake struct {
	User common.Address
	Raw  types.Log // Blockchain specific contextual infos
}

// FilterUnstake is a free log retrieval operation binding the contract event 0xe5d648ba8f514a64a4104bf6922acc6e04ecab6464b46d696cf123c27079ddd7.
//
// Solidity: event Unstake(address user)
func (_SquadStakingV3 *SquadStakingV3Filterer) FilterUnstake(opts *bind.FilterOpts) (*SquadStakingV3UnstakeIterator, error) {

	logs, sub, err := _SquadStakingV3.contract.FilterLogs(opts, "Unstake")
	if err != nil {
		return nil, err
	}
	return &SquadStakingV3UnstakeIterator{contract: _SquadStakingV3.contract, event: "Unstake", logs: logs, sub: sub}, nil
}

// WatchUnstake is a free log subscription operation binding the contract event 0xe5d648ba8f514a64a4104bf6922acc6e04ecab6464b46d696cf123c27079ddd7.
//
// Solidity: event Unstake(address user)
func (_SquadStakingV3 *SquadStakingV3Filterer) WatchUnstake(opts *bind.WatchOpts, sink chan<- *SquadStakingV3Unstake) (event.Subscription, error) {

	logs, sub, err := _SquadStakingV3.contract.WatchLogs(opts, "Unstake")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SquadStakingV3Unstake)
				if err := _SquadStakingV3.contract.UnpackLog(event, "Unstake", log); err != nil {
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

// ParseUnstake is a log parse operation binding the contract event 0xe5d648ba8f514a64a4104bf6922acc6e04ecab6464b46d696cf123c27079ddd7.
//
// Solidity: event Unstake(address user)
func (_SquadStakingV3 *SquadStakingV3Filterer) ParseUnstake(log types.Log) (*SquadStakingV3Unstake, error) {
	event := new(SquadStakingV3Unstake)
	if err := _SquadStakingV3.contract.UnpackLog(event, "Unstake", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

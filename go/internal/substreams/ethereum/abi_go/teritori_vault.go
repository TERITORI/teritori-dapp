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

// NFTVaultSaleOption is an auto generated low-level Go binding around an user-defined struct.
type NFTVaultSaleOption struct {
	Token  common.Address
	Amount *big.Int
}

// TeritoriVaultMetaData contains all meta data concerning the TeritoriVault contract.
var TeritoriVaultMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_feeNumerator\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_feeDenominator\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"buyer\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"indexed\":false,\"internalType\":\"structNFTVault.SaleOption\",\"name\":\"saleOption\",\"type\":\"tuple\"}],\"name\":\"BuyNFT\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"indexed\":false,\"internalType\":\"structNFTVault.SaleOption\",\"name\":\"saleOption\",\"type\":\"tuple\"}],\"name\":\"ListNFT\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"supported\",\"type\":\"bool\"}],\"name\":\"SetSupportedNft\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"supported\",\"type\":\"bool\"}],\"name\":\"SetSupportedToken\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"indexed\":false,\"internalType\":\"structNFTVault.SaleOption\",\"name\":\"saleOption\",\"type\":\"tuple\"}],\"name\":\"UpdateSaleOption\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"WithdrawNFT\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"buyNFT\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"feeDenominator\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"feeNumerator\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"}],\"name\":\"isSupportedNft\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"}],\"name\":\"isSupportedToken\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"internalType\":\"structNFTVault.SaleOption\",\"name\":\"saleOption\",\"type\":\"tuple\"}],\"name\":\"listNFT\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"nftSales\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"internalType\":\"structNFTVault.SaleOption\",\"name\":\"saleOption\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"name\":\"onERC721Received\",\"outputs\":[{\"internalType\":\"bytes4\",\"name\":\"\",\"type\":\"bytes4\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"royaltyInfo\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_feeNumerator\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_feeDenominator\",\"type\":\"uint256\"}],\"name\":\"setFeeNumerator\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"supported\",\"type\":\"bool\"}],\"name\":\"setSupportedNft\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"supported\",\"type\":\"bool\"}],\"name\":\"setSupportedToken\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"internalType\":\"structNFTVault.SaleOption\",\"name\":\"saleOption\",\"type\":\"tuple\"}],\"name\":\"updateSaleOption\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address[]\",\"name\":\"tokens\",\"type\":\"address[]\"}],\"name\":\"withdrawAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"nft\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"withdrawNFT\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// TeritoriVaultABI is the input ABI used to generate the binding from.
// Deprecated: Use TeritoriVaultMetaData.ABI instead.
var TeritoriVaultABI = TeritoriVaultMetaData.ABI

// TeritoriVault is an auto generated Go binding around an Ethereum contract.
type TeritoriVault struct {
	TeritoriVaultCaller     // Read-only binding to the contract
	TeritoriVaultTransactor // Write-only binding to the contract
	TeritoriVaultFilterer   // Log filterer for contract events
}

// TeritoriVaultCaller is an auto generated read-only Go binding around an Ethereum contract.
type TeritoriVaultCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TeritoriVaultTransactor is an auto generated write-only Go binding around an Ethereum contract.
type TeritoriVaultTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TeritoriVaultFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type TeritoriVaultFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TeritoriVaultSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type TeritoriVaultSession struct {
	Contract     *TeritoriVault    // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// TeritoriVaultCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type TeritoriVaultCallerSession struct {
	Contract *TeritoriVaultCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts        // Call options to use throughout this session
}

// TeritoriVaultTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type TeritoriVaultTransactorSession struct {
	Contract     *TeritoriVaultTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts        // Transaction auth options to use throughout this session
}

// TeritoriVaultRaw is an auto generated low-level Go binding around an Ethereum contract.
type TeritoriVaultRaw struct {
	Contract *TeritoriVault // Generic contract binding to access the raw methods on
}

// TeritoriVaultCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type TeritoriVaultCallerRaw struct {
	Contract *TeritoriVaultCaller // Generic read-only contract binding to access the raw methods on
}

// TeritoriVaultTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type TeritoriVaultTransactorRaw struct {
	Contract *TeritoriVaultTransactor // Generic write-only contract binding to access the raw methods on
}

// NewTeritoriVault creates a new instance of TeritoriVault, bound to a specific deployed contract.
func NewTeritoriVault(address common.Address, backend bind.ContractBackend) (*TeritoriVault, error) {
	contract, err := bindTeritoriVault(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &TeritoriVault{TeritoriVaultCaller: TeritoriVaultCaller{contract: contract}, TeritoriVaultTransactor: TeritoriVaultTransactor{contract: contract}, TeritoriVaultFilterer: TeritoriVaultFilterer{contract: contract}}, nil
}

// NewTeritoriVaultCaller creates a new read-only instance of TeritoriVault, bound to a specific deployed contract.
func NewTeritoriVaultCaller(address common.Address, caller bind.ContractCaller) (*TeritoriVaultCaller, error) {
	contract, err := bindTeritoriVault(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultCaller{contract: contract}, nil
}

// NewTeritoriVaultTransactor creates a new write-only instance of TeritoriVault, bound to a specific deployed contract.
func NewTeritoriVaultTransactor(address common.Address, transactor bind.ContractTransactor) (*TeritoriVaultTransactor, error) {
	contract, err := bindTeritoriVault(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultTransactor{contract: contract}, nil
}

// NewTeritoriVaultFilterer creates a new log filterer instance of TeritoriVault, bound to a specific deployed contract.
func NewTeritoriVaultFilterer(address common.Address, filterer bind.ContractFilterer) (*TeritoriVaultFilterer, error) {
	contract, err := bindTeritoriVault(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultFilterer{contract: contract}, nil
}

// bindTeritoriVault binds a generic wrapper to an already deployed contract.
func bindTeritoriVault(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := TeritoriVaultMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_TeritoriVault *TeritoriVaultRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _TeritoriVault.Contract.TeritoriVaultCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_TeritoriVault *TeritoriVaultRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriVault.Contract.TeritoriVaultTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_TeritoriVault *TeritoriVaultRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _TeritoriVault.Contract.TeritoriVaultTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_TeritoriVault *TeritoriVaultCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _TeritoriVault.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_TeritoriVault *TeritoriVaultTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriVault.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_TeritoriVault *TeritoriVaultTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _TeritoriVault.Contract.contract.Transact(opts, method, params...)
}

// FeeDenominator is a free data retrieval call binding the contract method 0x180b0d7e.
//
// Solidity: function feeDenominator() view returns(uint256)
func (_TeritoriVault *TeritoriVaultCaller) FeeDenominator(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _TeritoriVault.contract.Call(opts, &out, "feeDenominator")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// FeeDenominator is a free data retrieval call binding the contract method 0x180b0d7e.
//
// Solidity: function feeDenominator() view returns(uint256)
func (_TeritoriVault *TeritoriVaultSession) FeeDenominator() (*big.Int, error) {
	return _TeritoriVault.Contract.FeeDenominator(&_TeritoriVault.CallOpts)
}

// FeeDenominator is a free data retrieval call binding the contract method 0x180b0d7e.
//
// Solidity: function feeDenominator() view returns(uint256)
func (_TeritoriVault *TeritoriVaultCallerSession) FeeDenominator() (*big.Int, error) {
	return _TeritoriVault.Contract.FeeDenominator(&_TeritoriVault.CallOpts)
}

// FeeNumerator is a free data retrieval call binding the contract method 0xe86dea4a.
//
// Solidity: function feeNumerator() view returns(uint256)
func (_TeritoriVault *TeritoriVaultCaller) FeeNumerator(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _TeritoriVault.contract.Call(opts, &out, "feeNumerator")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// FeeNumerator is a free data retrieval call binding the contract method 0xe86dea4a.
//
// Solidity: function feeNumerator() view returns(uint256)
func (_TeritoriVault *TeritoriVaultSession) FeeNumerator() (*big.Int, error) {
	return _TeritoriVault.Contract.FeeNumerator(&_TeritoriVault.CallOpts)
}

// FeeNumerator is a free data retrieval call binding the contract method 0xe86dea4a.
//
// Solidity: function feeNumerator() view returns(uint256)
func (_TeritoriVault *TeritoriVaultCallerSession) FeeNumerator() (*big.Int, error) {
	return _TeritoriVault.Contract.FeeNumerator(&_TeritoriVault.CallOpts)
}

// IsSupportedNft is a free data retrieval call binding the contract method 0x47d948bd.
//
// Solidity: function isSupportedNft(address nft) view returns(bool)
func (_TeritoriVault *TeritoriVaultCaller) IsSupportedNft(opts *bind.CallOpts, nft common.Address) (bool, error) {
	var out []interface{}
	err := _TeritoriVault.contract.Call(opts, &out, "isSupportedNft", nft)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsSupportedNft is a free data retrieval call binding the contract method 0x47d948bd.
//
// Solidity: function isSupportedNft(address nft) view returns(bool)
func (_TeritoriVault *TeritoriVaultSession) IsSupportedNft(nft common.Address) (bool, error) {
	return _TeritoriVault.Contract.IsSupportedNft(&_TeritoriVault.CallOpts, nft)
}

// IsSupportedNft is a free data retrieval call binding the contract method 0x47d948bd.
//
// Solidity: function isSupportedNft(address nft) view returns(bool)
func (_TeritoriVault *TeritoriVaultCallerSession) IsSupportedNft(nft common.Address) (bool, error) {
	return _TeritoriVault.Contract.IsSupportedNft(&_TeritoriVault.CallOpts, nft)
}

// IsSupportedToken is a free data retrieval call binding the contract method 0x240028e8.
//
// Solidity: function isSupportedToken(address token) view returns(bool)
func (_TeritoriVault *TeritoriVaultCaller) IsSupportedToken(opts *bind.CallOpts, token common.Address) (bool, error) {
	var out []interface{}
	err := _TeritoriVault.contract.Call(opts, &out, "isSupportedToken", token)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsSupportedToken is a free data retrieval call binding the contract method 0x240028e8.
//
// Solidity: function isSupportedToken(address token) view returns(bool)
func (_TeritoriVault *TeritoriVaultSession) IsSupportedToken(token common.Address) (bool, error) {
	return _TeritoriVault.Contract.IsSupportedToken(&_TeritoriVault.CallOpts, token)
}

// IsSupportedToken is a free data retrieval call binding the contract method 0x240028e8.
//
// Solidity: function isSupportedToken(address token) view returns(bool)
func (_TeritoriVault *TeritoriVaultCallerSession) IsSupportedToken(token common.Address) (bool, error) {
	return _TeritoriVault.Contract.IsSupportedToken(&_TeritoriVault.CallOpts, token)
}

// NftSales is a free data retrieval call binding the contract method 0xab67f1cf.
//
// Solidity: function nftSales(address , uint256 ) view returns(address owner, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultCaller) NftSales(opts *bind.CallOpts, arg0 common.Address, arg1 *big.Int) (struct {
	Owner      common.Address
	SaleOption NFTVaultSaleOption
}, error) {
	var out []interface{}
	err := _TeritoriVault.contract.Call(opts, &out, "nftSales", arg0, arg1)

	outstruct := new(struct {
		Owner      common.Address
		SaleOption NFTVaultSaleOption
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Owner = *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	outstruct.SaleOption = *abi.ConvertType(out[1], new(NFTVaultSaleOption)).(*NFTVaultSaleOption)

	return *outstruct, err

}

// NftSales is a free data retrieval call binding the contract method 0xab67f1cf.
//
// Solidity: function nftSales(address , uint256 ) view returns(address owner, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultSession) NftSales(arg0 common.Address, arg1 *big.Int) (struct {
	Owner      common.Address
	SaleOption NFTVaultSaleOption
}, error) {
	return _TeritoriVault.Contract.NftSales(&_TeritoriVault.CallOpts, arg0, arg1)
}

// NftSales is a free data retrieval call binding the contract method 0xab67f1cf.
//
// Solidity: function nftSales(address , uint256 ) view returns(address owner, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultCallerSession) NftSales(arg0 common.Address, arg1 *big.Int) (struct {
	Owner      common.Address
	SaleOption NFTVaultSaleOption
}, error) {
	return _TeritoriVault.Contract.NftSales(&_TeritoriVault.CallOpts, arg0, arg1)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_TeritoriVault *TeritoriVaultCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _TeritoriVault.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_TeritoriVault *TeritoriVaultSession) Owner() (common.Address, error) {
	return _TeritoriVault.Contract.Owner(&_TeritoriVault.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_TeritoriVault *TeritoriVaultCallerSession) Owner() (common.Address, error) {
	return _TeritoriVault.Contract.Owner(&_TeritoriVault.CallOpts)
}

// RoyaltyInfo is a free data retrieval call binding the contract method 0x538bd5ea.
//
// Solidity: function royaltyInfo(address nft, uint256 tokenId, uint256 amount) view returns(address, uint256)
func (_TeritoriVault *TeritoriVaultCaller) RoyaltyInfo(opts *bind.CallOpts, nft common.Address, tokenId *big.Int, amount *big.Int) (common.Address, *big.Int, error) {
	var out []interface{}
	err := _TeritoriVault.contract.Call(opts, &out, "royaltyInfo", nft, tokenId, amount)

	if err != nil {
		return *new(common.Address), *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	out1 := *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)

	return out0, out1, err

}

// RoyaltyInfo is a free data retrieval call binding the contract method 0x538bd5ea.
//
// Solidity: function royaltyInfo(address nft, uint256 tokenId, uint256 amount) view returns(address, uint256)
func (_TeritoriVault *TeritoriVaultSession) RoyaltyInfo(nft common.Address, tokenId *big.Int, amount *big.Int) (common.Address, *big.Int, error) {
	return _TeritoriVault.Contract.RoyaltyInfo(&_TeritoriVault.CallOpts, nft, tokenId, amount)
}

// RoyaltyInfo is a free data retrieval call binding the contract method 0x538bd5ea.
//
// Solidity: function royaltyInfo(address nft, uint256 tokenId, uint256 amount) view returns(address, uint256)
func (_TeritoriVault *TeritoriVaultCallerSession) RoyaltyInfo(nft common.Address, tokenId *big.Int, amount *big.Int) (common.Address, *big.Int, error) {
	return _TeritoriVault.Contract.RoyaltyInfo(&_TeritoriVault.CallOpts, nft, tokenId, amount)
}

// BuyNFT is a paid mutator transaction binding the contract method 0xa82ba76f.
//
// Solidity: function buyNFT(address nft, uint256 tokenId) payable returns()
func (_TeritoriVault *TeritoriVaultTransactor) BuyNFT(opts *bind.TransactOpts, nft common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "buyNFT", nft, tokenId)
}

// BuyNFT is a paid mutator transaction binding the contract method 0xa82ba76f.
//
// Solidity: function buyNFT(address nft, uint256 tokenId) payable returns()
func (_TeritoriVault *TeritoriVaultSession) BuyNFT(nft common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.Contract.BuyNFT(&_TeritoriVault.TransactOpts, nft, tokenId)
}

// BuyNFT is a paid mutator transaction binding the contract method 0xa82ba76f.
//
// Solidity: function buyNFT(address nft, uint256 tokenId) payable returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) BuyNFT(nft common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.Contract.BuyNFT(&_TeritoriVault.TransactOpts, nft, tokenId)
}

// ListNFT is a paid mutator transaction binding the contract method 0xb2d27775.
//
// Solidity: function listNFT(address nft, uint256 tokenId, (address,uint256) saleOption) returns()
func (_TeritoriVault *TeritoriVaultTransactor) ListNFT(opts *bind.TransactOpts, nft common.Address, tokenId *big.Int, saleOption NFTVaultSaleOption) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "listNFT", nft, tokenId, saleOption)
}

// ListNFT is a paid mutator transaction binding the contract method 0xb2d27775.
//
// Solidity: function listNFT(address nft, uint256 tokenId, (address,uint256) saleOption) returns()
func (_TeritoriVault *TeritoriVaultSession) ListNFT(nft common.Address, tokenId *big.Int, saleOption NFTVaultSaleOption) (*types.Transaction, error) {
	return _TeritoriVault.Contract.ListNFT(&_TeritoriVault.TransactOpts, nft, tokenId, saleOption)
}

// ListNFT is a paid mutator transaction binding the contract method 0xb2d27775.
//
// Solidity: function listNFT(address nft, uint256 tokenId, (address,uint256) saleOption) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) ListNFT(nft common.Address, tokenId *big.Int, saleOption NFTVaultSaleOption) (*types.Transaction, error) {
	return _TeritoriVault.Contract.ListNFT(&_TeritoriVault.TransactOpts, nft, tokenId, saleOption)
}

// OnERC721Received is a paid mutator transaction binding the contract method 0x150b7a02.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) returns(bytes4)
func (_TeritoriVault *TeritoriVaultTransactor) OnERC721Received(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "onERC721Received", arg0, arg1, arg2, arg3)
}

// OnERC721Received is a paid mutator transaction binding the contract method 0x150b7a02.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) returns(bytes4)
func (_TeritoriVault *TeritoriVaultSession) OnERC721Received(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _TeritoriVault.Contract.OnERC721Received(&_TeritoriVault.TransactOpts, arg0, arg1, arg2, arg3)
}

// OnERC721Received is a paid mutator transaction binding the contract method 0x150b7a02.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) returns(bytes4)
func (_TeritoriVault *TeritoriVaultTransactorSession) OnERC721Received(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _TeritoriVault.Contract.OnERC721Received(&_TeritoriVault.TransactOpts, arg0, arg1, arg2, arg3)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_TeritoriVault *TeritoriVaultTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_TeritoriVault *TeritoriVaultSession) RenounceOwnership() (*types.Transaction, error) {
	return _TeritoriVault.Contract.RenounceOwnership(&_TeritoriVault.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _TeritoriVault.Contract.RenounceOwnership(&_TeritoriVault.TransactOpts)
}

// SetFeeNumerator is a paid mutator transaction binding the contract method 0x3951c782.
//
// Solidity: function setFeeNumerator(uint256 _feeNumerator, uint256 _feeDenominator) returns()
func (_TeritoriVault *TeritoriVaultTransactor) SetFeeNumerator(opts *bind.TransactOpts, _feeNumerator *big.Int, _feeDenominator *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "setFeeNumerator", _feeNumerator, _feeDenominator)
}

// SetFeeNumerator is a paid mutator transaction binding the contract method 0x3951c782.
//
// Solidity: function setFeeNumerator(uint256 _feeNumerator, uint256 _feeDenominator) returns()
func (_TeritoriVault *TeritoriVaultSession) SetFeeNumerator(_feeNumerator *big.Int, _feeDenominator *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.Contract.SetFeeNumerator(&_TeritoriVault.TransactOpts, _feeNumerator, _feeDenominator)
}

// SetFeeNumerator is a paid mutator transaction binding the contract method 0x3951c782.
//
// Solidity: function setFeeNumerator(uint256 _feeNumerator, uint256 _feeDenominator) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) SetFeeNumerator(_feeNumerator *big.Int, _feeDenominator *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.Contract.SetFeeNumerator(&_TeritoriVault.TransactOpts, _feeNumerator, _feeDenominator)
}

// SetSupportedNft is a paid mutator transaction binding the contract method 0x387d47a6.
//
// Solidity: function setSupportedNft(address nft, bool supported) returns()
func (_TeritoriVault *TeritoriVaultTransactor) SetSupportedNft(opts *bind.TransactOpts, nft common.Address, supported bool) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "setSupportedNft", nft, supported)
}

// SetSupportedNft is a paid mutator transaction binding the contract method 0x387d47a6.
//
// Solidity: function setSupportedNft(address nft, bool supported) returns()
func (_TeritoriVault *TeritoriVaultSession) SetSupportedNft(nft common.Address, supported bool) (*types.Transaction, error) {
	return _TeritoriVault.Contract.SetSupportedNft(&_TeritoriVault.TransactOpts, nft, supported)
}

// SetSupportedNft is a paid mutator transaction binding the contract method 0x387d47a6.
//
// Solidity: function setSupportedNft(address nft, bool supported) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) SetSupportedNft(nft common.Address, supported bool) (*types.Transaction, error) {
	return _TeritoriVault.Contract.SetSupportedNft(&_TeritoriVault.TransactOpts, nft, supported)
}

// SetSupportedToken is a paid mutator transaction binding the contract method 0xe7986466.
//
// Solidity: function setSupportedToken(address token, bool supported) returns()
func (_TeritoriVault *TeritoriVaultTransactor) SetSupportedToken(opts *bind.TransactOpts, token common.Address, supported bool) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "setSupportedToken", token, supported)
}

// SetSupportedToken is a paid mutator transaction binding the contract method 0xe7986466.
//
// Solidity: function setSupportedToken(address token, bool supported) returns()
func (_TeritoriVault *TeritoriVaultSession) SetSupportedToken(token common.Address, supported bool) (*types.Transaction, error) {
	return _TeritoriVault.Contract.SetSupportedToken(&_TeritoriVault.TransactOpts, token, supported)
}

// SetSupportedToken is a paid mutator transaction binding the contract method 0xe7986466.
//
// Solidity: function setSupportedToken(address token, bool supported) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) SetSupportedToken(token common.Address, supported bool) (*types.Transaction, error) {
	return _TeritoriVault.Contract.SetSupportedToken(&_TeritoriVault.TransactOpts, token, supported)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_TeritoriVault *TeritoriVaultTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_TeritoriVault *TeritoriVaultSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _TeritoriVault.Contract.TransferOwnership(&_TeritoriVault.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _TeritoriVault.Contract.TransferOwnership(&_TeritoriVault.TransactOpts, newOwner)
}

// UpdateSaleOption is a paid mutator transaction binding the contract method 0xe545e79b.
//
// Solidity: function updateSaleOption(address nft, uint256 tokenId, (address,uint256) saleOption) returns()
func (_TeritoriVault *TeritoriVaultTransactor) UpdateSaleOption(opts *bind.TransactOpts, nft common.Address, tokenId *big.Int, saleOption NFTVaultSaleOption) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "updateSaleOption", nft, tokenId, saleOption)
}

// UpdateSaleOption is a paid mutator transaction binding the contract method 0xe545e79b.
//
// Solidity: function updateSaleOption(address nft, uint256 tokenId, (address,uint256) saleOption) returns()
func (_TeritoriVault *TeritoriVaultSession) UpdateSaleOption(nft common.Address, tokenId *big.Int, saleOption NFTVaultSaleOption) (*types.Transaction, error) {
	return _TeritoriVault.Contract.UpdateSaleOption(&_TeritoriVault.TransactOpts, nft, tokenId, saleOption)
}

// UpdateSaleOption is a paid mutator transaction binding the contract method 0xe545e79b.
//
// Solidity: function updateSaleOption(address nft, uint256 tokenId, (address,uint256) saleOption) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) UpdateSaleOption(nft common.Address, tokenId *big.Int, saleOption NFTVaultSaleOption) (*types.Transaction, error) {
	return _TeritoriVault.Contract.UpdateSaleOption(&_TeritoriVault.TransactOpts, nft, tokenId, saleOption)
}

// Withdraw is a paid mutator transaction binding the contract method 0x51cff8d9.
//
// Solidity: function withdraw(address token) returns()
func (_TeritoriVault *TeritoriVaultTransactor) Withdraw(opts *bind.TransactOpts, token common.Address) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "withdraw", token)
}

// Withdraw is a paid mutator transaction binding the contract method 0x51cff8d9.
//
// Solidity: function withdraw(address token) returns()
func (_TeritoriVault *TeritoriVaultSession) Withdraw(token common.Address) (*types.Transaction, error) {
	return _TeritoriVault.Contract.Withdraw(&_TeritoriVault.TransactOpts, token)
}

// Withdraw is a paid mutator transaction binding the contract method 0x51cff8d9.
//
// Solidity: function withdraw(address token) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) Withdraw(token common.Address) (*types.Transaction, error) {
	return _TeritoriVault.Contract.Withdraw(&_TeritoriVault.TransactOpts, token)
}

// WithdrawAll is a paid mutator transaction binding the contract method 0x6568a279.
//
// Solidity: function withdrawAll(address[] tokens) returns()
func (_TeritoriVault *TeritoriVaultTransactor) WithdrawAll(opts *bind.TransactOpts, tokens []common.Address) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "withdrawAll", tokens)
}

// WithdrawAll is a paid mutator transaction binding the contract method 0x6568a279.
//
// Solidity: function withdrawAll(address[] tokens) returns()
func (_TeritoriVault *TeritoriVaultSession) WithdrawAll(tokens []common.Address) (*types.Transaction, error) {
	return _TeritoriVault.Contract.WithdrawAll(&_TeritoriVault.TransactOpts, tokens)
}

// WithdrawAll is a paid mutator transaction binding the contract method 0x6568a279.
//
// Solidity: function withdrawAll(address[] tokens) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) WithdrawAll(tokens []common.Address) (*types.Transaction, error) {
	return _TeritoriVault.Contract.WithdrawAll(&_TeritoriVault.TransactOpts, tokens)
}

// WithdrawNFT is a paid mutator transaction binding the contract method 0x6088e93a.
//
// Solidity: function withdrawNFT(address nft, uint256 tokenId) returns()
func (_TeritoriVault *TeritoriVaultTransactor) WithdrawNFT(opts *bind.TransactOpts, nft common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.contract.Transact(opts, "withdrawNFT", nft, tokenId)
}

// WithdrawNFT is a paid mutator transaction binding the contract method 0x6088e93a.
//
// Solidity: function withdrawNFT(address nft, uint256 tokenId) returns()
func (_TeritoriVault *TeritoriVaultSession) WithdrawNFT(nft common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.Contract.WithdrawNFT(&_TeritoriVault.TransactOpts, nft, tokenId)
}

// WithdrawNFT is a paid mutator transaction binding the contract method 0x6088e93a.
//
// Solidity: function withdrawNFT(address nft, uint256 tokenId) returns()
func (_TeritoriVault *TeritoriVaultTransactorSession) WithdrawNFT(nft common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _TeritoriVault.Contract.WithdrawNFT(&_TeritoriVault.TransactOpts, nft, tokenId)
}

// TeritoriVaultBuyNFTIterator is returned from FilterBuyNFT and is used to iterate over the raw logs and unpacked data for BuyNFT events raised by the TeritoriVault contract.
type TeritoriVaultBuyNFTIterator struct {
	Event *TeritoriVaultBuyNFT // Event containing the contract specifics and raw log

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
func (it *TeritoriVaultBuyNFTIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriVaultBuyNFT)
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
		it.Event = new(TeritoriVaultBuyNFT)
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
func (it *TeritoriVaultBuyNFTIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriVaultBuyNFTIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriVaultBuyNFT represents a BuyNFT event raised by the TeritoriVault contract.
type TeritoriVaultBuyNFT struct {
	Buyer      common.Address
	Nft        common.Address
	TokenId    *big.Int
	SaleOption NFTVaultSaleOption
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterBuyNFT is a free log retrieval operation binding the contract event 0xd0543b8c90871f7530f89d5e5e4bed0e907f284a94d6bdc298b5b29ac3552310.
//
// Solidity: event BuyNFT(address indexed buyer, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) FilterBuyNFT(opts *bind.FilterOpts, buyer []common.Address, nft []common.Address, tokenId []*big.Int) (*TeritoriVaultBuyNFTIterator, error) {

	var buyerRule []interface{}
	for _, buyerItem := range buyer {
		buyerRule = append(buyerRule, buyerItem)
	}
	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _TeritoriVault.contract.FilterLogs(opts, "BuyNFT", buyerRule, nftRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultBuyNFTIterator{contract: _TeritoriVault.contract, event: "BuyNFT", logs: logs, sub: sub}, nil
}

// WatchBuyNFT is a free log subscription operation binding the contract event 0xd0543b8c90871f7530f89d5e5e4bed0e907f284a94d6bdc298b5b29ac3552310.
//
// Solidity: event BuyNFT(address indexed buyer, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) WatchBuyNFT(opts *bind.WatchOpts, sink chan<- *TeritoriVaultBuyNFT, buyer []common.Address, nft []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var buyerRule []interface{}
	for _, buyerItem := range buyer {
		buyerRule = append(buyerRule, buyerItem)
	}
	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _TeritoriVault.contract.WatchLogs(opts, "BuyNFT", buyerRule, nftRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriVaultBuyNFT)
				if err := _TeritoriVault.contract.UnpackLog(event, "BuyNFT", log); err != nil {
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

// ParseBuyNFT is a log parse operation binding the contract event 0xd0543b8c90871f7530f89d5e5e4bed0e907f284a94d6bdc298b5b29ac3552310.
//
// Solidity: event BuyNFT(address indexed buyer, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) ParseBuyNFT(log types.Log) (*TeritoriVaultBuyNFT, error) {
	event := new(TeritoriVaultBuyNFT)
	if err := _TeritoriVault.contract.UnpackLog(event, "BuyNFT", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriVaultListNFTIterator is returned from FilterListNFT and is used to iterate over the raw logs and unpacked data for ListNFT events raised by the TeritoriVault contract.
type TeritoriVaultListNFTIterator struct {
	Event *TeritoriVaultListNFT // Event containing the contract specifics and raw log

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
func (it *TeritoriVaultListNFTIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriVaultListNFT)
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
		it.Event = new(TeritoriVaultListNFT)
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
func (it *TeritoriVaultListNFTIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriVaultListNFTIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriVaultListNFT represents a ListNFT event raised by the TeritoriVault contract.
type TeritoriVaultListNFT struct {
	Owner      common.Address
	Nft        common.Address
	TokenId    *big.Int
	SaleOption NFTVaultSaleOption
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterListNFT is a free log retrieval operation binding the contract event 0xdbb82f19b494aeb71ab4169b3dd3c3c9ed3883dd9b1a9f0c6f292c295558840f.
//
// Solidity: event ListNFT(address indexed owner, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) FilterListNFT(opts *bind.FilterOpts, owner []common.Address, nft []common.Address, tokenId []*big.Int) (*TeritoriVaultListNFTIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _TeritoriVault.contract.FilterLogs(opts, "ListNFT", ownerRule, nftRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultListNFTIterator{contract: _TeritoriVault.contract, event: "ListNFT", logs: logs, sub: sub}, nil
}

// WatchListNFT is a free log subscription operation binding the contract event 0xdbb82f19b494aeb71ab4169b3dd3c3c9ed3883dd9b1a9f0c6f292c295558840f.
//
// Solidity: event ListNFT(address indexed owner, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) WatchListNFT(opts *bind.WatchOpts, sink chan<- *TeritoriVaultListNFT, owner []common.Address, nft []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _TeritoriVault.contract.WatchLogs(opts, "ListNFT", ownerRule, nftRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriVaultListNFT)
				if err := _TeritoriVault.contract.UnpackLog(event, "ListNFT", log); err != nil {
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

// ParseListNFT is a log parse operation binding the contract event 0xdbb82f19b494aeb71ab4169b3dd3c3c9ed3883dd9b1a9f0c6f292c295558840f.
//
// Solidity: event ListNFT(address indexed owner, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) ParseListNFT(log types.Log) (*TeritoriVaultListNFT, error) {
	event := new(TeritoriVaultListNFT)
	if err := _TeritoriVault.contract.UnpackLog(event, "ListNFT", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriVaultOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the TeritoriVault contract.
type TeritoriVaultOwnershipTransferredIterator struct {
	Event *TeritoriVaultOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *TeritoriVaultOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriVaultOwnershipTransferred)
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
		it.Event = new(TeritoriVaultOwnershipTransferred)
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
func (it *TeritoriVaultOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriVaultOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriVaultOwnershipTransferred represents a OwnershipTransferred event raised by the TeritoriVault contract.
type TeritoriVaultOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_TeritoriVault *TeritoriVaultFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*TeritoriVaultOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _TeritoriVault.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultOwnershipTransferredIterator{contract: _TeritoriVault.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_TeritoriVault *TeritoriVaultFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *TeritoriVaultOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _TeritoriVault.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriVaultOwnershipTransferred)
				if err := _TeritoriVault.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_TeritoriVault *TeritoriVaultFilterer) ParseOwnershipTransferred(log types.Log) (*TeritoriVaultOwnershipTransferred, error) {
	event := new(TeritoriVaultOwnershipTransferred)
	if err := _TeritoriVault.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriVaultSetSupportedNftIterator is returned from FilterSetSupportedNft and is used to iterate over the raw logs and unpacked data for SetSupportedNft events raised by the TeritoriVault contract.
type TeritoriVaultSetSupportedNftIterator struct {
	Event *TeritoriVaultSetSupportedNft // Event containing the contract specifics and raw log

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
func (it *TeritoriVaultSetSupportedNftIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriVaultSetSupportedNft)
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
		it.Event = new(TeritoriVaultSetSupportedNft)
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
func (it *TeritoriVaultSetSupportedNftIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriVaultSetSupportedNftIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriVaultSetSupportedNft represents a SetSupportedNft event raised by the TeritoriVault contract.
type TeritoriVaultSetSupportedNft struct {
	Nft       common.Address
	Supported bool
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterSetSupportedNft is a free log retrieval operation binding the contract event 0xb4458a938755cc3590e415ab56d0e37acbf92f0f1f893091a7e4d9cc8d4aa226.
//
// Solidity: event SetSupportedNft(address indexed nft, bool supported)
func (_TeritoriVault *TeritoriVaultFilterer) FilterSetSupportedNft(opts *bind.FilterOpts, nft []common.Address) (*TeritoriVaultSetSupportedNftIterator, error) {

	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}

	logs, sub, err := _TeritoriVault.contract.FilterLogs(opts, "SetSupportedNft", nftRule)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultSetSupportedNftIterator{contract: _TeritoriVault.contract, event: "SetSupportedNft", logs: logs, sub: sub}, nil
}

// WatchSetSupportedNft is a free log subscription operation binding the contract event 0xb4458a938755cc3590e415ab56d0e37acbf92f0f1f893091a7e4d9cc8d4aa226.
//
// Solidity: event SetSupportedNft(address indexed nft, bool supported)
func (_TeritoriVault *TeritoriVaultFilterer) WatchSetSupportedNft(opts *bind.WatchOpts, sink chan<- *TeritoriVaultSetSupportedNft, nft []common.Address) (event.Subscription, error) {

	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}

	logs, sub, err := _TeritoriVault.contract.WatchLogs(opts, "SetSupportedNft", nftRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriVaultSetSupportedNft)
				if err := _TeritoriVault.contract.UnpackLog(event, "SetSupportedNft", log); err != nil {
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

// ParseSetSupportedNft is a log parse operation binding the contract event 0xb4458a938755cc3590e415ab56d0e37acbf92f0f1f893091a7e4d9cc8d4aa226.
//
// Solidity: event SetSupportedNft(address indexed nft, bool supported)
func (_TeritoriVault *TeritoriVaultFilterer) ParseSetSupportedNft(log types.Log) (*TeritoriVaultSetSupportedNft, error) {
	event := new(TeritoriVaultSetSupportedNft)
	if err := _TeritoriVault.contract.UnpackLog(event, "SetSupportedNft", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriVaultSetSupportedTokenIterator is returned from FilterSetSupportedToken and is used to iterate over the raw logs and unpacked data for SetSupportedToken events raised by the TeritoriVault contract.
type TeritoriVaultSetSupportedTokenIterator struct {
	Event *TeritoriVaultSetSupportedToken // Event containing the contract specifics and raw log

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
func (it *TeritoriVaultSetSupportedTokenIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriVaultSetSupportedToken)
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
		it.Event = new(TeritoriVaultSetSupportedToken)
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
func (it *TeritoriVaultSetSupportedTokenIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriVaultSetSupportedTokenIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriVaultSetSupportedToken represents a SetSupportedToken event raised by the TeritoriVault contract.
type TeritoriVaultSetSupportedToken struct {
	Token     common.Address
	Supported bool
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterSetSupportedToken is a free log retrieval operation binding the contract event 0x16ef4de07b0452a43221c91064fb645963a8e2e60bd8a7514da58d56e315c422.
//
// Solidity: event SetSupportedToken(address indexed token, bool supported)
func (_TeritoriVault *TeritoriVaultFilterer) FilterSetSupportedToken(opts *bind.FilterOpts, token []common.Address) (*TeritoriVaultSetSupportedTokenIterator, error) {

	var tokenRule []interface{}
	for _, tokenItem := range token {
		tokenRule = append(tokenRule, tokenItem)
	}

	logs, sub, err := _TeritoriVault.contract.FilterLogs(opts, "SetSupportedToken", tokenRule)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultSetSupportedTokenIterator{contract: _TeritoriVault.contract, event: "SetSupportedToken", logs: logs, sub: sub}, nil
}

// WatchSetSupportedToken is a free log subscription operation binding the contract event 0x16ef4de07b0452a43221c91064fb645963a8e2e60bd8a7514da58d56e315c422.
//
// Solidity: event SetSupportedToken(address indexed token, bool supported)
func (_TeritoriVault *TeritoriVaultFilterer) WatchSetSupportedToken(opts *bind.WatchOpts, sink chan<- *TeritoriVaultSetSupportedToken, token []common.Address) (event.Subscription, error) {

	var tokenRule []interface{}
	for _, tokenItem := range token {
		tokenRule = append(tokenRule, tokenItem)
	}

	logs, sub, err := _TeritoriVault.contract.WatchLogs(opts, "SetSupportedToken", tokenRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriVaultSetSupportedToken)
				if err := _TeritoriVault.contract.UnpackLog(event, "SetSupportedToken", log); err != nil {
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

// ParseSetSupportedToken is a log parse operation binding the contract event 0x16ef4de07b0452a43221c91064fb645963a8e2e60bd8a7514da58d56e315c422.
//
// Solidity: event SetSupportedToken(address indexed token, bool supported)
func (_TeritoriVault *TeritoriVaultFilterer) ParseSetSupportedToken(log types.Log) (*TeritoriVaultSetSupportedToken, error) {
	event := new(TeritoriVaultSetSupportedToken)
	if err := _TeritoriVault.contract.UnpackLog(event, "SetSupportedToken", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriVaultUpdateSaleOptionIterator is returned from FilterUpdateSaleOption and is used to iterate over the raw logs and unpacked data for UpdateSaleOption events raised by the TeritoriVault contract.
type TeritoriVaultUpdateSaleOptionIterator struct {
	Event *TeritoriVaultUpdateSaleOption // Event containing the contract specifics and raw log

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
func (it *TeritoriVaultUpdateSaleOptionIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriVaultUpdateSaleOption)
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
		it.Event = new(TeritoriVaultUpdateSaleOption)
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
func (it *TeritoriVaultUpdateSaleOptionIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriVaultUpdateSaleOptionIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriVaultUpdateSaleOption represents a UpdateSaleOption event raised by the TeritoriVault contract.
type TeritoriVaultUpdateSaleOption struct {
	Owner      common.Address
	Nft        common.Address
	TokenId    *big.Int
	SaleOption NFTVaultSaleOption
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterUpdateSaleOption is a free log retrieval operation binding the contract event 0xfebd96fe37988b3050485b2537a18e0b7f99450857fb33834ab82a0c362684e1.
//
// Solidity: event UpdateSaleOption(address indexed owner, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) FilterUpdateSaleOption(opts *bind.FilterOpts, owner []common.Address, nft []common.Address, tokenId []*big.Int) (*TeritoriVaultUpdateSaleOptionIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _TeritoriVault.contract.FilterLogs(opts, "UpdateSaleOption", ownerRule, nftRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultUpdateSaleOptionIterator{contract: _TeritoriVault.contract, event: "UpdateSaleOption", logs: logs, sub: sub}, nil
}

// WatchUpdateSaleOption is a free log subscription operation binding the contract event 0xfebd96fe37988b3050485b2537a18e0b7f99450857fb33834ab82a0c362684e1.
//
// Solidity: event UpdateSaleOption(address indexed owner, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) WatchUpdateSaleOption(opts *bind.WatchOpts, sink chan<- *TeritoriVaultUpdateSaleOption, owner []common.Address, nft []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _TeritoriVault.contract.WatchLogs(opts, "UpdateSaleOption", ownerRule, nftRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriVaultUpdateSaleOption)
				if err := _TeritoriVault.contract.UnpackLog(event, "UpdateSaleOption", log); err != nil {
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

// ParseUpdateSaleOption is a log parse operation binding the contract event 0xfebd96fe37988b3050485b2537a18e0b7f99450857fb33834ab82a0c362684e1.
//
// Solidity: event UpdateSaleOption(address indexed owner, address indexed nft, uint256 indexed tokenId, (address,uint256) saleOption)
func (_TeritoriVault *TeritoriVaultFilterer) ParseUpdateSaleOption(log types.Log) (*TeritoriVaultUpdateSaleOption, error) {
	event := new(TeritoriVaultUpdateSaleOption)
	if err := _TeritoriVault.contract.UnpackLog(event, "UpdateSaleOption", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TeritoriVaultWithdrawNFTIterator is returned from FilterWithdrawNFT and is used to iterate over the raw logs and unpacked data for WithdrawNFT events raised by the TeritoriVault contract.
type TeritoriVaultWithdrawNFTIterator struct {
	Event *TeritoriVaultWithdrawNFT // Event containing the contract specifics and raw log

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
func (it *TeritoriVaultWithdrawNFTIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TeritoriVaultWithdrawNFT)
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
		it.Event = new(TeritoriVaultWithdrawNFT)
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
func (it *TeritoriVaultWithdrawNFTIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TeritoriVaultWithdrawNFTIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TeritoriVaultWithdrawNFT represents a WithdrawNFT event raised by the TeritoriVault contract.
type TeritoriVaultWithdrawNFT struct {
	Owner   common.Address
	Nft     common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterWithdrawNFT is a free log retrieval operation binding the contract event 0xe7a9bbc68ffc5ef55c4992454bd401d15a750ba00be3c3f868b16d92d8a0d30e.
//
// Solidity: event WithdrawNFT(address indexed owner, address indexed nft, uint256 indexed tokenId)
func (_TeritoriVault *TeritoriVaultFilterer) FilterWithdrawNFT(opts *bind.FilterOpts, owner []common.Address, nft []common.Address, tokenId []*big.Int) (*TeritoriVaultWithdrawNFTIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _TeritoriVault.contract.FilterLogs(opts, "WithdrawNFT", ownerRule, nftRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &TeritoriVaultWithdrawNFTIterator{contract: _TeritoriVault.contract, event: "WithdrawNFT", logs: logs, sub: sub}, nil
}

// WatchWithdrawNFT is a free log subscription operation binding the contract event 0xe7a9bbc68ffc5ef55c4992454bd401d15a750ba00be3c3f868b16d92d8a0d30e.
//
// Solidity: event WithdrawNFT(address indexed owner, address indexed nft, uint256 indexed tokenId)
func (_TeritoriVault *TeritoriVaultFilterer) WatchWithdrawNFT(opts *bind.WatchOpts, sink chan<- *TeritoriVaultWithdrawNFT, owner []common.Address, nft []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var nftRule []interface{}
	for _, nftItem := range nft {
		nftRule = append(nftRule, nftItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _TeritoriVault.contract.WatchLogs(opts, "WithdrawNFT", ownerRule, nftRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TeritoriVaultWithdrawNFT)
				if err := _TeritoriVault.contract.UnpackLog(event, "WithdrawNFT", log); err != nil {
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

// ParseWithdrawNFT is a log parse operation binding the contract event 0xe7a9bbc68ffc5ef55c4992454bd401d15a750ba00be3c3f868b16d92d8a0d30e.
//
// Solidity: event WithdrawNFT(address indexed owner, address indexed nft, uint256 indexed tokenId)
func (_TeritoriVault *TeritoriVaultFilterer) ParseWithdrawNFT(log types.Log) (*TeritoriVaultWithdrawNFT, error) {
	event := new(TeritoriVaultWithdrawNFT)
	if err := _TeritoriVault.contract.UnpackLog(event, "WithdrawNFT", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

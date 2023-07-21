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

// DistributorMetaData contains all meta data concerning the Distributor contract.
var DistributorMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Claim\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"merkleRoot\",\"type\":\"bytes32\"}],\"name\":\"UpdateMerkleRoot\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"reporter\",\"type\":\"address\"}],\"name\":\"UpdateReporter\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"allocation\",\"type\":\"uint256\"},{\"internalType\":\"bytes32[]\",\"name\":\"proofs\",\"type\":\"bytes32[]\"}],\"name\":\"claim\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"merkleRoot\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"reporter\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"rescueFunds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"_merkleRoot\",\"type\":\"bytes32\"}],\"name\":\"updateMerkleRoot\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_reporter\",\"type\":\"address\"}],\"name\":\"updateReporter\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userClaimedAmount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]",
}

// DistributorABI is the input ABI used to generate the binding from.
// Deprecated: Use DistributorMetaData.ABI instead.
var DistributorABI = DistributorMetaData.ABI

// Distributor is an auto generated Go binding around an Ethereum contract.
type Distributor struct {
	DistributorCaller     // Read-only binding to the contract
	DistributorTransactor // Write-only binding to the contract
	DistributorFilterer   // Log filterer for contract events
}

// DistributorCaller is an auto generated read-only Go binding around an Ethereum contract.
type DistributorCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DistributorTransactor is an auto generated write-only Go binding around an Ethereum contract.
type DistributorTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DistributorFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type DistributorFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DistributorSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type DistributorSession struct {
	Contract     *Distributor      // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// DistributorCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type DistributorCallerSession struct {
	Contract *DistributorCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts      // Call options to use throughout this session
}

// DistributorTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type DistributorTransactorSession struct {
	Contract     *DistributorTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts      // Transaction auth options to use throughout this session
}

// DistributorRaw is an auto generated low-level Go binding around an Ethereum contract.
type DistributorRaw struct {
	Contract *Distributor // Generic contract binding to access the raw methods on
}

// DistributorCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type DistributorCallerRaw struct {
	Contract *DistributorCaller // Generic read-only contract binding to access the raw methods on
}

// DistributorTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type DistributorTransactorRaw struct {
	Contract *DistributorTransactor // Generic write-only contract binding to access the raw methods on
}

// NewDistributor creates a new instance of Distributor, bound to a specific deployed contract.
func NewDistributor(address common.Address, backend bind.ContractBackend) (*Distributor, error) {
	contract, err := bindDistributor(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Distributor{DistributorCaller: DistributorCaller{contract: contract}, DistributorTransactor: DistributorTransactor{contract: contract}, DistributorFilterer: DistributorFilterer{contract: contract}}, nil
}

// NewDistributorCaller creates a new read-only instance of Distributor, bound to a specific deployed contract.
func NewDistributorCaller(address common.Address, caller bind.ContractCaller) (*DistributorCaller, error) {
	contract, err := bindDistributor(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &DistributorCaller{contract: contract}, nil
}

// NewDistributorTransactor creates a new write-only instance of Distributor, bound to a specific deployed contract.
func NewDistributorTransactor(address common.Address, transactor bind.ContractTransactor) (*DistributorTransactor, error) {
	contract, err := bindDistributor(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &DistributorTransactor{contract: contract}, nil
}

// NewDistributorFilterer creates a new log filterer instance of Distributor, bound to a specific deployed contract.
func NewDistributorFilterer(address common.Address, filterer bind.ContractFilterer) (*DistributorFilterer, error) {
	contract, err := bindDistributor(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &DistributorFilterer{contract: contract}, nil
}

// bindDistributor binds a generic wrapper to an already deployed contract.
func bindDistributor(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := DistributorMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Distributor *DistributorRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Distributor.Contract.DistributorCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Distributor *DistributorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Distributor.Contract.DistributorTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Distributor *DistributorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Distributor.Contract.DistributorTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Distributor *DistributorCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Distributor.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Distributor *DistributorTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Distributor.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Distributor *DistributorTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Distributor.Contract.contract.Transact(opts, method, params...)
}

// MerkleRoot is a free data retrieval call binding the contract method 0x2eb4a7ab.
//
// Solidity: function merkleRoot() view returns(bytes32)
func (_Distributor *DistributorCaller) MerkleRoot(opts *bind.CallOpts) ([32]byte, error) {
	var out []interface{}
	err := _Distributor.contract.Call(opts, &out, "merkleRoot")

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// MerkleRoot is a free data retrieval call binding the contract method 0x2eb4a7ab.
//
// Solidity: function merkleRoot() view returns(bytes32)
func (_Distributor *DistributorSession) MerkleRoot() ([32]byte, error) {
	return _Distributor.Contract.MerkleRoot(&_Distributor.CallOpts)
}

// MerkleRoot is a free data retrieval call binding the contract method 0x2eb4a7ab.
//
// Solidity: function merkleRoot() view returns(bytes32)
func (_Distributor *DistributorCallerSession) MerkleRoot() ([32]byte, error) {
	return _Distributor.Contract.MerkleRoot(&_Distributor.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Distributor *DistributorCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Distributor.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Distributor *DistributorSession) Owner() (common.Address, error) {
	return _Distributor.Contract.Owner(&_Distributor.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Distributor *DistributorCallerSession) Owner() (common.Address, error) {
	return _Distributor.Contract.Owner(&_Distributor.CallOpts)
}

// Reporter is a free data retrieval call binding the contract method 0x010ec441.
//
// Solidity: function reporter() view returns(address)
func (_Distributor *DistributorCaller) Reporter(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Distributor.contract.Call(opts, &out, "reporter")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Reporter is a free data retrieval call binding the contract method 0x010ec441.
//
// Solidity: function reporter() view returns(address)
func (_Distributor *DistributorSession) Reporter() (common.Address, error) {
	return _Distributor.Contract.Reporter(&_Distributor.CallOpts)
}

// Reporter is a free data retrieval call binding the contract method 0x010ec441.
//
// Solidity: function reporter() view returns(address)
func (_Distributor *DistributorCallerSession) Reporter() (common.Address, error) {
	return _Distributor.Contract.Reporter(&_Distributor.CallOpts)
}

// UserClaimedAmount is a free data retrieval call binding the contract method 0x948b4ca4.
//
// Solidity: function userClaimedAmount(address , address ) view returns(uint256)
func (_Distributor *DistributorCaller) UserClaimedAmount(opts *bind.CallOpts, arg0 common.Address, arg1 common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Distributor.contract.Call(opts, &out, "userClaimedAmount", arg0, arg1)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// UserClaimedAmount is a free data retrieval call binding the contract method 0x948b4ca4.
//
// Solidity: function userClaimedAmount(address , address ) view returns(uint256)
func (_Distributor *DistributorSession) UserClaimedAmount(arg0 common.Address, arg1 common.Address) (*big.Int, error) {
	return _Distributor.Contract.UserClaimedAmount(&_Distributor.CallOpts, arg0, arg1)
}

// UserClaimedAmount is a free data retrieval call binding the contract method 0x948b4ca4.
//
// Solidity: function userClaimedAmount(address , address ) view returns(uint256)
func (_Distributor *DistributorCallerSession) UserClaimedAmount(arg0 common.Address, arg1 common.Address) (*big.Int, error) {
	return _Distributor.Contract.UserClaimedAmount(&_Distributor.CallOpts, arg0, arg1)
}

// Claim is a paid mutator transaction binding the contract method 0x3d13f874.
//
// Solidity: function claim(address token, uint256 allocation, bytes32[] proofs) returns()
func (_Distributor *DistributorTransactor) Claim(opts *bind.TransactOpts, token common.Address, allocation *big.Int, proofs [][32]byte) (*types.Transaction, error) {
	return _Distributor.contract.Transact(opts, "claim", token, allocation, proofs)
}

// Claim is a paid mutator transaction binding the contract method 0x3d13f874.
//
// Solidity: function claim(address token, uint256 allocation, bytes32[] proofs) returns()
func (_Distributor *DistributorSession) Claim(token common.Address, allocation *big.Int, proofs [][32]byte) (*types.Transaction, error) {
	return _Distributor.Contract.Claim(&_Distributor.TransactOpts, token, allocation, proofs)
}

// Claim is a paid mutator transaction binding the contract method 0x3d13f874.
//
// Solidity: function claim(address token, uint256 allocation, bytes32[] proofs) returns()
func (_Distributor *DistributorTransactorSession) Claim(token common.Address, allocation *big.Int, proofs [][32]byte) (*types.Transaction, error) {
	return _Distributor.Contract.Claim(&_Distributor.TransactOpts, token, allocation, proofs)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Distributor *DistributorTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Distributor.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Distributor *DistributorSession) RenounceOwnership() (*types.Transaction, error) {
	return _Distributor.Contract.RenounceOwnership(&_Distributor.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Distributor *DistributorTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _Distributor.Contract.RenounceOwnership(&_Distributor.TransactOpts)
}

// RescueFunds is a paid mutator transaction binding the contract method 0x78e3214f.
//
// Solidity: function rescueFunds(address token, uint256 amount) returns()
func (_Distributor *DistributorTransactor) RescueFunds(opts *bind.TransactOpts, token common.Address, amount *big.Int) (*types.Transaction, error) {
	return _Distributor.contract.Transact(opts, "rescueFunds", token, amount)
}

// RescueFunds is a paid mutator transaction binding the contract method 0x78e3214f.
//
// Solidity: function rescueFunds(address token, uint256 amount) returns()
func (_Distributor *DistributorSession) RescueFunds(token common.Address, amount *big.Int) (*types.Transaction, error) {
	return _Distributor.Contract.RescueFunds(&_Distributor.TransactOpts, token, amount)
}

// RescueFunds is a paid mutator transaction binding the contract method 0x78e3214f.
//
// Solidity: function rescueFunds(address token, uint256 amount) returns()
func (_Distributor *DistributorTransactorSession) RescueFunds(token common.Address, amount *big.Int) (*types.Transaction, error) {
	return _Distributor.Contract.RescueFunds(&_Distributor.TransactOpts, token, amount)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Distributor *DistributorTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _Distributor.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Distributor *DistributorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Distributor.Contract.TransferOwnership(&_Distributor.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Distributor *DistributorTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Distributor.Contract.TransferOwnership(&_Distributor.TransactOpts, newOwner)
}

// UpdateMerkleRoot is a paid mutator transaction binding the contract method 0x4783f0ef.
//
// Solidity: function updateMerkleRoot(bytes32 _merkleRoot) returns()
func (_Distributor *DistributorTransactor) UpdateMerkleRoot(opts *bind.TransactOpts, _merkleRoot [32]byte) (*types.Transaction, error) {
	return _Distributor.contract.Transact(opts, "updateMerkleRoot", _merkleRoot)
}

// UpdateMerkleRoot is a paid mutator transaction binding the contract method 0x4783f0ef.
//
// Solidity: function updateMerkleRoot(bytes32 _merkleRoot) returns()
func (_Distributor *DistributorSession) UpdateMerkleRoot(_merkleRoot [32]byte) (*types.Transaction, error) {
	return _Distributor.Contract.UpdateMerkleRoot(&_Distributor.TransactOpts, _merkleRoot)
}

// UpdateMerkleRoot is a paid mutator transaction binding the contract method 0x4783f0ef.
//
// Solidity: function updateMerkleRoot(bytes32 _merkleRoot) returns()
func (_Distributor *DistributorTransactorSession) UpdateMerkleRoot(_merkleRoot [32]byte) (*types.Transaction, error) {
	return _Distributor.Contract.UpdateMerkleRoot(&_Distributor.TransactOpts, _merkleRoot)
}

// UpdateReporter is a paid mutator transaction binding the contract method 0x423d0f2e.
//
// Solidity: function updateReporter(address _reporter) returns()
func (_Distributor *DistributorTransactor) UpdateReporter(opts *bind.TransactOpts, _reporter common.Address) (*types.Transaction, error) {
	return _Distributor.contract.Transact(opts, "updateReporter", _reporter)
}

// UpdateReporter is a paid mutator transaction binding the contract method 0x423d0f2e.
//
// Solidity: function updateReporter(address _reporter) returns()
func (_Distributor *DistributorSession) UpdateReporter(_reporter common.Address) (*types.Transaction, error) {
	return _Distributor.Contract.UpdateReporter(&_Distributor.TransactOpts, _reporter)
}

// UpdateReporter is a paid mutator transaction binding the contract method 0x423d0f2e.
//
// Solidity: function updateReporter(address _reporter) returns()
func (_Distributor *DistributorTransactorSession) UpdateReporter(_reporter common.Address) (*types.Transaction, error) {
	return _Distributor.Contract.UpdateReporter(&_Distributor.TransactOpts, _reporter)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Distributor *DistributorTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Distributor.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Distributor *DistributorSession) Receive() (*types.Transaction, error) {
	return _Distributor.Contract.Receive(&_Distributor.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Distributor *DistributorTransactorSession) Receive() (*types.Transaction, error) {
	return _Distributor.Contract.Receive(&_Distributor.TransactOpts)
}

// DistributorClaimIterator is returned from FilterClaim and is used to iterate over the raw logs and unpacked data for Claim events raised by the Distributor contract.
type DistributorClaimIterator struct {
	Event *DistributorClaim // Event containing the contract specifics and raw log

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
func (it *DistributorClaimIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DistributorClaim)
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
		it.Event = new(DistributorClaim)
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
func (it *DistributorClaimIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DistributorClaimIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DistributorClaim represents a Claim event raised by the Distributor contract.
type DistributorClaim struct {
	User   common.Address
	Token  common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterClaim is a free log retrieval operation binding the contract event 0x70eb43c4a8ae8c40502dcf22436c509c28d6ff421cf07c491be56984bd987068.
//
// Solidity: event Claim(address indexed user, address indexed token, uint256 amount)
func (_Distributor *DistributorFilterer) FilterClaim(opts *bind.FilterOpts, user []common.Address, token []common.Address) (*DistributorClaimIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}
	var tokenRule []interface{}
	for _, tokenItem := range token {
		tokenRule = append(tokenRule, tokenItem)
	}

	logs, sub, err := _Distributor.contract.FilterLogs(opts, "Claim", userRule, tokenRule)
	if err != nil {
		return nil, err
	}
	return &DistributorClaimIterator{contract: _Distributor.contract, event: "Claim", logs: logs, sub: sub}, nil
}

// WatchClaim is a free log subscription operation binding the contract event 0x70eb43c4a8ae8c40502dcf22436c509c28d6ff421cf07c491be56984bd987068.
//
// Solidity: event Claim(address indexed user, address indexed token, uint256 amount)
func (_Distributor *DistributorFilterer) WatchClaim(opts *bind.WatchOpts, sink chan<- *DistributorClaim, user []common.Address, token []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}
	var tokenRule []interface{}
	for _, tokenItem := range token {
		tokenRule = append(tokenRule, tokenItem)
	}

	logs, sub, err := _Distributor.contract.WatchLogs(opts, "Claim", userRule, tokenRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DistributorClaim)
				if err := _Distributor.contract.UnpackLog(event, "Claim", log); err != nil {
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

// ParseClaim is a log parse operation binding the contract event 0x70eb43c4a8ae8c40502dcf22436c509c28d6ff421cf07c491be56984bd987068.
//
// Solidity: event Claim(address indexed user, address indexed token, uint256 amount)
func (_Distributor *DistributorFilterer) ParseClaim(log types.Log) (*DistributorClaim, error) {
	event := new(DistributorClaim)
	if err := _Distributor.contract.UnpackLog(event, "Claim", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DistributorOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the Distributor contract.
type DistributorOwnershipTransferredIterator struct {
	Event *DistributorOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *DistributorOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DistributorOwnershipTransferred)
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
		it.Event = new(DistributorOwnershipTransferred)
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
func (it *DistributorOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DistributorOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DistributorOwnershipTransferred represents a OwnershipTransferred event raised by the Distributor contract.
type DistributorOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Distributor *DistributorFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*DistributorOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Distributor.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &DistributorOwnershipTransferredIterator{contract: _Distributor.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Distributor *DistributorFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *DistributorOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Distributor.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DistributorOwnershipTransferred)
				if err := _Distributor.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_Distributor *DistributorFilterer) ParseOwnershipTransferred(log types.Log) (*DistributorOwnershipTransferred, error) {
	event := new(DistributorOwnershipTransferred)
	if err := _Distributor.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DistributorUpdateMerkleRootIterator is returned from FilterUpdateMerkleRoot and is used to iterate over the raw logs and unpacked data for UpdateMerkleRoot events raised by the Distributor contract.
type DistributorUpdateMerkleRootIterator struct {
	Event *DistributorUpdateMerkleRoot // Event containing the contract specifics and raw log

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
func (it *DistributorUpdateMerkleRootIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DistributorUpdateMerkleRoot)
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
		it.Event = new(DistributorUpdateMerkleRoot)
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
func (it *DistributorUpdateMerkleRootIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DistributorUpdateMerkleRootIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DistributorUpdateMerkleRoot represents a UpdateMerkleRoot event raised by the Distributor contract.
type DistributorUpdateMerkleRoot struct {
	MerkleRoot [32]byte
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterUpdateMerkleRoot is a free log retrieval operation binding the contract event 0xae8bdbc15b982b030d313524fca26f653a8826332c662cb93c670068172d217e.
//
// Solidity: event UpdateMerkleRoot(bytes32 indexed merkleRoot)
func (_Distributor *DistributorFilterer) FilterUpdateMerkleRoot(opts *bind.FilterOpts, merkleRoot [][32]byte) (*DistributorUpdateMerkleRootIterator, error) {

	var merkleRootRule []interface{}
	for _, merkleRootItem := range merkleRoot {
		merkleRootRule = append(merkleRootRule, merkleRootItem)
	}

	logs, sub, err := _Distributor.contract.FilterLogs(opts, "UpdateMerkleRoot", merkleRootRule)
	if err != nil {
		return nil, err
	}
	return &DistributorUpdateMerkleRootIterator{contract: _Distributor.contract, event: "UpdateMerkleRoot", logs: logs, sub: sub}, nil
}

// WatchUpdateMerkleRoot is a free log subscription operation binding the contract event 0xae8bdbc15b982b030d313524fca26f653a8826332c662cb93c670068172d217e.
//
// Solidity: event UpdateMerkleRoot(bytes32 indexed merkleRoot)
func (_Distributor *DistributorFilterer) WatchUpdateMerkleRoot(opts *bind.WatchOpts, sink chan<- *DistributorUpdateMerkleRoot, merkleRoot [][32]byte) (event.Subscription, error) {

	var merkleRootRule []interface{}
	for _, merkleRootItem := range merkleRoot {
		merkleRootRule = append(merkleRootRule, merkleRootItem)
	}

	logs, sub, err := _Distributor.contract.WatchLogs(opts, "UpdateMerkleRoot", merkleRootRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DistributorUpdateMerkleRoot)
				if err := _Distributor.contract.UnpackLog(event, "UpdateMerkleRoot", log); err != nil {
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

// ParseUpdateMerkleRoot is a log parse operation binding the contract event 0xae8bdbc15b982b030d313524fca26f653a8826332c662cb93c670068172d217e.
//
// Solidity: event UpdateMerkleRoot(bytes32 indexed merkleRoot)
func (_Distributor *DistributorFilterer) ParseUpdateMerkleRoot(log types.Log) (*DistributorUpdateMerkleRoot, error) {
	event := new(DistributorUpdateMerkleRoot)
	if err := _Distributor.contract.UnpackLog(event, "UpdateMerkleRoot", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DistributorUpdateReporterIterator is returned from FilterUpdateReporter and is used to iterate over the raw logs and unpacked data for UpdateReporter events raised by the Distributor contract.
type DistributorUpdateReporterIterator struct {
	Event *DistributorUpdateReporter // Event containing the contract specifics and raw log

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
func (it *DistributorUpdateReporterIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DistributorUpdateReporter)
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
		it.Event = new(DistributorUpdateReporter)
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
func (it *DistributorUpdateReporterIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DistributorUpdateReporterIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DistributorUpdateReporter represents a UpdateReporter event raised by the Distributor contract.
type DistributorUpdateReporter struct {
	Reporter common.Address
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterUpdateReporter is a free log retrieval operation binding the contract event 0x34657497f5ff25ea59cd441ce7294d87db6c261cb1b8b63d1a0834ab238b580f.
//
// Solidity: event UpdateReporter(address indexed reporter)
func (_Distributor *DistributorFilterer) FilterUpdateReporter(opts *bind.FilterOpts, reporter []common.Address) (*DistributorUpdateReporterIterator, error) {

	var reporterRule []interface{}
	for _, reporterItem := range reporter {
		reporterRule = append(reporterRule, reporterItem)
	}

	logs, sub, err := _Distributor.contract.FilterLogs(opts, "UpdateReporter", reporterRule)
	if err != nil {
		return nil, err
	}
	return &DistributorUpdateReporterIterator{contract: _Distributor.contract, event: "UpdateReporter", logs: logs, sub: sub}, nil
}

// WatchUpdateReporter is a free log subscription operation binding the contract event 0x34657497f5ff25ea59cd441ce7294d87db6c261cb1b8b63d1a0834ab238b580f.
//
// Solidity: event UpdateReporter(address indexed reporter)
func (_Distributor *DistributorFilterer) WatchUpdateReporter(opts *bind.WatchOpts, sink chan<- *DistributorUpdateReporter, reporter []common.Address) (event.Subscription, error) {

	var reporterRule []interface{}
	for _, reporterItem := range reporter {
		reporterRule = append(reporterRule, reporterItem)
	}

	logs, sub, err := _Distributor.contract.WatchLogs(opts, "UpdateReporter", reporterRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DistributorUpdateReporter)
				if err := _Distributor.contract.UnpackLog(event, "UpdateReporter", log); err != nil {
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

// ParseUpdateReporter is a log parse operation binding the contract event 0x34657497f5ff25ea59cd441ce7294d87db6c261cb1b8b63d1a0834ab238b580f.
//
// Solidity: event UpdateReporter(address indexed reporter)
func (_Distributor *DistributorFilterer) ParseUpdateReporter(log types.Log) (*DistributorUpdateReporter, error) {
	event := new(DistributorUpdateReporter)
	if err := _Distributor.contract.UnpackLog(event, "UpdateReporter", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

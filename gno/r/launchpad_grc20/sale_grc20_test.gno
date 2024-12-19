package launchpad_grc20

import (
	"std"
	"testing"
	"time"

	"gno.land/p/demo/merkle"
)

func TestNewSale(t *testing.T) {
	type testNewSaleInput struct {
		tokenName      string
		startTimestamp int64
		endTimestamp   int64
		pricePerToken  uint64
		limitPerAddr   uint64
		minGoal        uint64
		maxGoal        uint64
		mintToken      bool
		addr           std.Address
		merkleRoot     string
	}

	type testNewSaleExpected struct {
		panic          bool
		tokenName      string
		startTimestamp int64
		endTimestamp   int64
		pricePerToken  uint64
		limitPerAddr   uint64
		minGoal        uint64
		maxGoal        uint64
		mintToken      bool
		merkleRoot     string
	}

	type testNewSale struct {
		input    testNewSaleInput
		expected testNewSaleExpected
	}

	type testNewSaleTestTable = map[string]testNewSale

	startTimestamp := time.Now().Unix() + 1000
	endTimestamp := time.Now().Unix() + 2000

	bob := std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")
	alice := std.Address("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")

	tests := testNewSaleTestTable{
		"Success with mint token": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				addr:           bob,
				merkleRoot:     "",
			},
			expected: testNewSaleExpected{
				panic:          false,
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				merkleRoot:     "",
			},
		},
		"Success without mint token": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleNotMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      false,
				addr:           bob,
				merkleRoot:     "",
			},
			expected: testNewSaleExpected{
				panic:          false,
				tokenName:      "TestNewSaleNotMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      false,
				merkleRoot:     "",
			},
		},
		"Success with merkleRoot": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				addr:           bob,
				merkleRoot:     "merkleRoot",
			},
			expected: testNewSaleExpected{
				panic:          false,
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				merkleRoot:     "merkleRoot",
			},
		},
		"Fail with token not mintable": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleNotMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				addr:           bob,
				merkleRoot:     "",
			},
			expected: testNewSaleExpected{
				panic: true,
			},
		},
		"Fail with startTimestamp in the past": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: time.Now().Unix() - 1000,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				addr:           bob,
				merkleRoot:     "",
			},
			expected: testNewSaleExpected{
				panic: true,
			},
		},
		"Fail with endTimestamp less than startTimestamp": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   startTimestamp - 1000,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				addr:           bob,
				merkleRoot:     "",
			},
			expected: testNewSaleExpected{
				panic: true,
			},
		},
		"Fail with minGoal greater than maxGoal": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        1000,
				maxGoal:        100,
				mintToken:      true,
				addr:           bob,
				merkleRoot:     "",
			},
			expected: testNewSaleExpected{
				panic: true,
			},
		},
		"Fail with pricePerToken equal to 0": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  0,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				addr:           bob,
				merkleRoot:     "",
			},
			expected: testNewSaleExpected{
				panic: true,
			},
		},
		"Fail with not owner of the token": {
			input: testNewSaleInput{
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: startTimestamp,
				endTimestamp:   endTimestamp,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
				mintToken:      true,
				addr:           alice,
				merkleRoot:     "",
			},
			expected: testNewSaleExpected{
				panic: true,
			},
		},
	}

	std.TestSetOrigCaller(bob)

	NewToken("TestNewSaleMintableToken", "TestNewSaleMintableToken", "image", 18, 21_000_000, 23_000_000, true, true)
	NewToken("TestNewSaleNotMintableToken", "TestNewSaleNotMintableToken", "image", 18, 21_000_000, 23_000_000, false, true)

	for testName, test := range tests {
		t.Run(testName, func(t *testing.T) {
			if test.expected.panic {
				defer func() {
					if r := recover(); r == nil {
						t.Errorf("Expected panic, got none")
					}
				}()
			}

			std.TestSetOrigCaller(test.input.addr)
			saleID := NewSale(test.input.tokenName, test.input.merkleRoot, test.input.startTimestamp, test.input.endTimestamp, test.input.pricePerToken, test.input.limitPerAddr, test.input.minGoal, test.input.maxGoal, test.input.mintToken)
			sale := mustGetSale(saleID)

			if !test.expected.panic {
				if sale.token.GetName() != test.expected.tokenName {
					t.Errorf("Expected tokenName to be %s, got %s", test.expected.tokenName, sale.token.GetName())
				}
				if sale.startTimestamp != test.expected.startTimestamp {
					t.Errorf("Expected startTimestamp to be %d, got %d", test.expected.startTimestamp, sale.startTimestamp)
				}
				if sale.endTimestamp != test.expected.endTimestamp {
					t.Errorf("Expected endTimestamp to be %d, got %d", test.expected.endTimestamp, sale.endTimestamp)
				}
				if sale.pricePerToken != test.expected.pricePerToken {
					t.Errorf("Expected pricePerToken to be %d, got %d", test.expected.pricePerToken, sale.pricePerToken)
				}
				if sale.limitPerAddr != test.expected.limitPerAddr {
					t.Errorf("Expected limitPerAddr to be %d, got %d", test.expected.limitPerAddr, sale.limitPerAddr)
				}
				if sale.minGoal != test.expected.minGoal {
					t.Errorf("Expected minGoal to be %d, got %d", test.expected.minGoal, sale.minGoal)
				}
				if sale.maxGoal != test.expected.maxGoal {
					t.Errorf("Expected maxGoal to be %d, got %d", test.expected.maxGoal, sale.maxGoal)
				}
				if sale.token.allowMint != test.expected.mintToken {
					t.Errorf("Expected mintToken to be %t, got %t", test.expected.mintToken, sale.token.allowMint)
				}
				if sale.merkleRoot != test.expected.merkleRoot {
					t.Errorf("Expected merkleRoot to be %s, got %s", test.expected.merkleRoot, sale.merkleRoot)
				}
			}
		})
	}
}

func TestBuy(t *testing.T) {
	type testBuyInput struct {
		saleID uint64
		amount uint64
		coins  std.Coins
		addr   std.Address
		proofs []merkle.Node
	}

	type testBuyExpected struct {
		panic   bool
		balance uint64
	}

	type testBuy struct {
		input    testBuyInput
		expected testBuyExpected
	}

	type testBuyTestTable = map[string]testBuy

	startTimestamp := time.Now().Unix()
	endTimestamp := time.Now().Unix() + 1000

	bob := std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")
	alice := std.Address("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")
	carol := std.Address("g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth")

	leaves := []merkle.Hashable{
		Leaf{[]byte("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")},
		Leaf{[]byte("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")},
	}

	tree := merkle.NewTree(leaves)
	root := tree.Root()
	proofs, _ := tree.Proof(leaves[0])

	std.TestSetOrigCaller(bob)

	NewToken("TestBuyToken", "TestBuyToken", "image", 18, 21_000_000, 23_000_000, true, true)
	NewToken("TestPrivateBuyToken", "TestPrivateBuyToken", "image", 18, 21_000_000, 23_000_000, true, true)
	saleID := NewSale("TestBuyToken", "", startTimestamp, endTimestamp, 100, 15, 0, 20, true)
	privateSaleID := NewSale("TestPrivateBuyToken", root, startTimestamp, endTimestamp, 100, 15, 0, 20, true)

	coins := std.NewCoins(std.NewCoin("ugnot", 100*10))
	badCoin := std.NewCoins(std.NewCoin("notugnot", 100*10))
	manyCoins := std.NewCoins(std.NewCoin("ugnot", 100*10), std.NewCoin("notugnot", 100*10))
	notEnoughCoins := std.NewCoins(std.NewCoin("ugnot", 100*5))
	tooManyCoins := std.NewCoins(std.NewCoin("ugnot", 100*11))
	emptyCoins := std.NewCoins()

	tests := testBuyTestTable{
		"Success": {
			input: testBuyInput{
				saleID: saleID,
				amount: 10,
				coins:  coins,
				addr:   bob,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic:   false,
				balance: 10,
			},
		},
		"Success private sale": {
			input: testBuyInput{
				saleID: privateSaleID,
				amount: 1,
				coins:  coins,
				addr:   bob,
				proofs: proofs,
			},
			expected: testBuyExpected{
				panic:   false,
				balance: 1,
			},
		},
		"Not in the tree / bad proofs": {
			input: testBuyInput{
				saleID: privateSaleID,
				amount: 1,
				coins:  coins,
				addr:   carol,
				proofs: proofs,
			},
			expected: testBuyExpected{
				panic: true,
			},
		},
		"Limit per addr reached": {
			input: testBuyInput{
				saleID: saleID,
				amount: 10,
				coins:  coins,
				addr:   bob,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic:   true,
				balance: 10,
			},
		},
		"Exceeds maximum goal": {
			input: testBuyInput{
				saleID: saleID,
				amount: 15,
				coins:  coins,
				addr:   alice,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic: true,
			},
		},
		"Send empty coins": {
			input: testBuyInput{
				saleID: saleID,
				amount: 10,
				coins:  emptyCoins,
				addr:   alice,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic: true,
			},
		},
		"Send bad coins": {
			input: testBuyInput{
				saleID: saleID,
				amount: 10,
				coins:  badCoin,
				addr:   alice,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic: true,
			},
		},
		"Send many coins": {
			input: testBuyInput{
				saleID: saleID,
				amount: 10,
				coins:  manyCoins,
				addr:   alice,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic: true,
			},
		},
		"Send not enough coins": {
			input: testBuyInput{
				saleID: saleID,
				amount: 10,
				coins:  notEnoughCoins,
				addr:   alice,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic: true,
			},
		},
		"Amount is 0": {
			input: testBuyInput{
				saleID: saleID,
				amount: 0,
				coins:  coins,
				addr:   alice,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic: true,
			},
		},
		"Send too many coins": {
			input: testBuyInput{
				saleID: saleID,
				amount: 10,
				coins:  tooManyCoins,
				addr:   alice,
				proofs: nil,
			},
			expected: testBuyExpected{
				panic:   false,
				balance: 10,
			},
		},
	}

	for testName, test := range tests {
		t.Run(testName, func(t *testing.T) {
			if test.expected.panic {
				defer func() {
					if r := recover(); r == nil {
						t.Errorf("Expected panic, got none")
					}
				}()
			}

			std.TestSetOrigCaller(test.input.addr)
			std.TestSetOrigSend(test.input.coins, nil)
			Buy(test.input.saleID, test.input.amount, test.input.proofs)
			sale := mustGetSale(test.input.saleID)
			if !test.expected.panic {
				buyer, exists := sale.buyers.Get(test.input.addr.String())
				if !exists {
					t.Errorf("Expected buyer to not exist, got %d", buyer)
				}
				if buyer.(uint64) != test.expected.balance {
					t.Errorf("Expected balance to be %d, got %d", test.expected.balance, buyer.(uint64))
				}
			}
		})
	}
}

func TestFinalize(t *testing.T) {
	type testFinalizeInput struct {
		saleID      uint64
		buyer       std.Address
		amount      uint64
		skipHeights int64
	}

	type testFinalizeExpected struct {
		panic bool
	}

	type testFinalize struct {
		input    testFinalizeInput
		expected testFinalizeExpected
	}

	type testFinalizeTestTable = map[string]testFinalize

	startTimestamp := time.Now().Unix() - 5
	endTimestamp := time.Now().Unix() - 2

	onGoingEndTimestamp := time.Now().Unix() + 100
	onGoingEndTimestamp2 := time.Now().Unix() + 200

	bob := std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")
	alice := std.Address("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")

	std.TestSetOrigCaller(bob)

	NewToken("TestFinalizeToken", "TestFinalizeToken", "image", 18, 21_000_000, 23_000_000, true, true)
	saleID := NewSale("TestFinalizeToken", "", startTimestamp, endTimestamp, 100, 15, 10, 20, true)
	onGoingSaleID := NewSale("TestFinalizeToken", "", startTimestamp, onGoingEndTimestamp, 100, 15, 10, 20, true)
	onGoingSaleID2 := NewSale("TestFinalizeToken", "", startTimestamp, onGoingEndTimestamp2, 100, 15, 10, 20, true)

	tests := testFinalizeTestTable{
		"Success with 0 tokens sold": {
			input: testFinalizeInput{
				saleID:      saleID,
				buyer:       alice,
				amount:      0,
				skipHeights: 0,
			},
			expected: testFinalizeExpected{
				panic: false,
			},
		},
		"Fail sale not found": {
			input: testFinalizeInput{
				saleID:      100,
				buyer:       bob,
				amount:      0,
				skipHeights: 0,
			},
			expected: testFinalizeExpected{
				panic: true,
			},
		},
		"Fail sale already finalized": {
			input: testFinalizeInput{
				saleID:      saleID,
				buyer:       bob,
				amount:      0,
				skipHeights: 0,
			},
			expected: testFinalizeExpected{
				panic: true,
			},
		},
		"Fail sale still ongoing": {
			input: testFinalizeInput{
				saleID:      onGoingSaleID,
				buyer:       bob,
				amount:      0,
				skipHeights: 0,
			},
			expected: testFinalizeExpected{
				panic: true,
			},
		},
		"Success with min goal not reached but some token sold": {
			input: testFinalizeInput{
				saleID:      onGoingSaleID,
				buyer:       alice,
				amount:      2,
				skipHeights: 20, // 20 blocks passed ~= 100 seconds (close the onGoingEndTimestamp1)
			},
			expected: testFinalizeExpected{
				panic: false,
			},
		},
		"Success with min goal reached": {
			input: testFinalizeInput{
				saleID:      onGoingSaleID2,
				buyer:       alice,
				amount:      15,
				skipHeights: 20, // 20 blocks passed ~= 100 seconds again (close the onGoingEndTimestamp2)
			},
			expected: testFinalizeExpected{
				panic: false,
			},
		},
	}

	banker := std.GetBanker(std.BankerTypeReadonly)

	for testName, test := range tests {
		t.Run(testName, func(t *testing.T) {
			if test.expected.panic {
				defer func() {
					if r := recover(); r == nil {
						t.Errorf("Expected panic, got none")
					}
				}()
			}

			std.TestSetOrigCaller(test.input.buyer)

			buyerBalance := banker.GetCoins(test.input.buyer).AmountOf("ugnot")
			sale := mustGetSale(test.input.saleID)

			coins := std.NewCoins(std.NewCoin("ugnot", int64(test.input.amount*sale.pricePerToken)))
			std.TestSetOrigSend(coins, nil)

			if test.input.amount != 0 {
				Buy(test.input.saleID, test.input.amount, nil)
			}

			std.TestSkipHeights(test.input.skipHeights)

			Finalize(test.input.saleID)

			if !test.expected.panic {
				if !sale.finalized {
					t.Errorf("Expected sale to be finalized, got %t", sale.finalized)
				}

				if sale.alreadySold != test.input.amount {
					t.Errorf("Expected alreadySold to be %d, got %d", test.input.amount, sale.alreadySold)
				}

				if sale.alreadySold < sale.minGoal {
					if sale.token.BalanceOf(test.input.buyer) != 0 {
						t.Errorf("Expected tokens balance to be 0 since min goal not reach, got %d", sale.token.BalanceOf(test.input.buyer))
					}

					// Since coins come from nowhere in the testing context, the refund just add news coins to addr
					if banker.GetCoins(test.input.buyer).AmountOf("ugnot") != buyerBalance+coins.AmountOf("ugnot") {
						t.Errorf("Expected money to be refund and be %d since min goal not reach but got %d", buyerBalance, banker.GetCoins(test.input.buyer).AmountOf("ugnot"))
					}
				} else {
					if sale.token.BalanceOf(test.input.buyer) != test.input.amount {
						t.Errorf("Expected balance to be %d, got %d", test.input.amount, sale.token.BalanceOf(test.input.buyer))
					}
				}
			}
		})
	}
}

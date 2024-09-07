package launchpad_grc20

import (
	"std"
	"testing"
	"time"
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
			saleID := NewSale(test.input.tokenName, test.input.startTimestamp, test.input.endTimestamp, test.input.pricePerToken, test.input.limitPerAddr, test.input.minGoal, test.input.maxGoal, test.input.mintToken)
			sale := mustGetSale(saleID)

			if !test.expected.panic {
				if sale.token.banker.GetName() != test.expected.tokenName {
					t.Errorf("Expected tokenName to be %s, got %s", test.expected.tokenName, sale.token.banker.GetName())
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
			}
		})
	}
}

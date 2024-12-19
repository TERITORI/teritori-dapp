package launchpad_grc20

import (
	"std"
	"testing"
)

func TestNewToken(t *testing.T) {
	type testNewTokenInput struct {
		name      string
		symbol    string
		image     string
		decimals  uint
		initial   uint64
		maximum   uint64
		allowMint bool
		allowBurn bool
	}

	type testNewTokenExpected struct {
		panic     bool
		name      string
		symbol    string
		image     string
		decimals  uint
		initial   uint64
		maximum   uint64
		allowMint bool
		allowBurn bool
	}

	type testNewToken struct {
		input    testNewTokenInput
		expected testNewTokenExpected
	}

	type testNewTokenTestTable = map[string]testNewToken

	tests := testNewTokenTestTable{
		"Success": {
			input: testNewTokenInput{
				name:      "TestNewToken",
				symbol:    "TST",
				image:     "image",
				decimals:  18,
				initial:   1000000000000000000,
				maximum:   1000000000000000000,
				allowMint: true,
				allowBurn: true,
			},
			expected: testNewTokenExpected{
				panic:     false,
				name:      "TestNewToken",
				symbol:    "TST",
				image:     "image",
				decimals:  18,
				initial:   1000000000000000000,
				maximum:   1000000000000000000,
				allowMint: true,
				allowBurn: true,
			},
		},
		"Decimals greater than 18": {
			input: testNewTokenInput{
				name:      "TestNewToken2",
				symbol:    "TST",
				image:     "image",
				decimals:  19,
				initial:   1000000000000000000,
				maximum:   1000000000000000000,
				allowMint: true,
				allowBurn: true,
			},
			expected: testNewTokenExpected{
				panic: true,
			},
		},
		"Token already exists": {
			input: testNewTokenInput{
				name:      "TestNewToken",
				symbol:    "TST",
				image:     "image",
				decimals:  18,
				initial:   1000000000000000000,
				maximum:   1000000000000000000,
				allowMint: true,
				allowBurn: true,
			},
			expected: testNewTokenExpected{
				panic: true,
			},
		},
		"Initial supply exceeds total supply cap": {
			input: testNewTokenInput{
				name:      "TestNewToken2",
				symbol:    "TST2",
				image:     "image",
				decimals:  18,
				initial:   1000000000000000001,
				maximum:   1000000000000000000,
				allowMint: true,
				allowBurn: true,
			},
			expected: testNewTokenExpected{
				panic: true,
			},
		},
	}

	for testName, test := range tests {
		t.Run(testName, func(t *testing.T) {
			defer func() {
				if r := recover(); (r != nil) != test.expected.panic {
					t.Errorf("panic = %v, want %v", r != nil, test.expected.panic)
				}
			}()

			NewToken(test.input.name, test.input.symbol, test.input.image, test.input.decimals, test.input.initial, test.input.maximum, test.input.allowMint, test.input.allowBurn)

			inst := mustGetToken(test.input.name)
			if inst.GetName() != test.expected.name {
				t.Errorf("name = %v, want %v", inst.GetName(), test.expected.name)
			}
			if inst.GetSymbol() != test.expected.symbol {
				t.Errorf("symbol = %v, want %v", inst.GetSymbol(), test.expected.symbol)
			}
			if inst.image != test.expected.image {
				t.Errorf("image = %v, want %v", inst.image, test.expected.image)
			}
			if inst.GetDecimals() != test.expected.decimals {
				t.Errorf("decimals = %v, want %v", inst.GetDecimals(), test.expected.decimals)
			}
			if inst.TotalSupply() != test.expected.initial {
				t.Errorf("initial = %v, want %v", inst.TotalSupply(), test.expected.initial)
			}
			if inst.totalSupplyCap != test.expected.maximum {
				t.Errorf("maximum = %v, want %v", inst.totalSupplyCap, test.expected.maximum)
			}
			if inst.allowMint != test.expected.allowMint {
				t.Errorf("allowMint = %v, want %v", inst.allowMint, test.expected.allowMint)
			}
			if inst.allowBurn != test.expected.allowBurn {
				t.Errorf("allowBurn = %v, want %v", inst.allowBurn, test.expected.allowBurn)
			}
		})
	}
}

func TestMint(t *testing.T) {
	type testMintInput struct {
		name   string
		to     std.Address
		amount uint64
	}

	type testMintExpected struct {
		panic       bool
		totalSupply uint64
	}

	type testMint struct {
		input    testMintInput
		expected testMintExpected
	}

	type testMintTestTable = map[string]testMint

	bob := std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")
	alice := std.Address("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")

	std.TestSetOrigCaller(bob)

	NewToken("TestMintTokenMintable", "TestMintTokenMintable", "image", 18, 21_000_000, 23_000_000, true, true)
	NewToken("TestMintTokenNotMintable", "TestMintTokenNotMintable", "image", 18, 21_000_000, 23_000_000, false, true)

	tests := testMintTestTable{
		"Success": {
			input: testMintInput{
				name:   "TestMintTokenMintable",
				to:     bob,
				amount: 1,
			},
			expected: testMintExpected{
				panic:       false,
				totalSupply: 21_000_001,
			},
		},
		"Token does not exist": {
			input: testMintInput{
				name:   "TestToken2",
				to:     bob,
				amount: 1000000000000000000,
			},
			expected: testMintExpected{
				panic: true,
			},
		},
		"Minting not allowed": {
			input: testMintInput{
				name:   "TestMintTokenNotMintable",
				to:     bob,
				amount: 1000000000000000000,
			},
			expected: testMintExpected{
				panic: true,
			},
		},
		"Total supply cap exceeded": {
			input: testMintInput{
				name:   "TestMintTokenMintable",
				to:     bob,
				amount: 1000000000000000000,
			},
			expected: testMintExpected{
				panic: true,
			},
		},
		"Is not the owner": {
			input: testMintInput{
				name:   "TestMintTokenMintable",
				to:     alice,
				amount: 1000000000000000000,
			},
			expected: testMintExpected{
				panic: true,
			},
		},
	}

	for testName, test := range tests {
		t.Run(testName, func(t *testing.T) {
			defer func() {
				if r := recover(); (r != nil) != test.expected.panic {
					t.Errorf("panic = %v, want %v", r != nil, test.expected.panic)
				}
			}()

			Mint(test.input.name, test.input.to, test.input.amount)

			inst := mustGetToken(test.input.name)
			if inst.TotalSupply() != test.expected.totalSupply {
				t.Errorf("totalSupply = %v, want %v", inst.TotalSupply(), test.expected.totalSupply)
			}
		})
	}
}

func TestBurn(t *testing.T) {
	type testBurnInput struct {
		name   string
		from   std.Address
		amount uint64
	}

	type testBurnExpected struct {
		panic       bool
		totalSupply uint64
	}

	type testBurn struct {
		input    testBurnInput
		expected testBurnExpected
	}

	type testBurnTestTable = map[string]testBurn

	bob := std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")
	alice := std.Address("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")

	std.TestSetOrigCaller(bob)

	NewToken("TestBurnTokenBurnable", "TestBurnTokenBurnable", "image", 18, 21_000_000, 23_000_000, true, true)
	NewToken("TestBurnTokenNotBurnable", "TestBurnTokenNotBurnable", "image", 18, 21_000_000, 23_000_000, true, false)

	tests := testBurnTestTable{
		"Success": {
			input: testBurnInput{
				name:   "TestBurnTokenBurnable",
				from:   bob,
				amount: 1,
			},
			expected: testBurnExpected{
				panic:       false,
				totalSupply: 20_999_999,
			},
		},
		"Token does not exist": {
			input: testBurnInput{
				name:   "TestToken2",
				from:   bob,
				amount: 1000000000000000000,
			},
			expected: testBurnExpected{
				panic: true,
			},
		},
		"Burning not allowed": {
			input: testBurnInput{
				name:   "TestBurnTokenNotBurnable",
				from:   bob,
				amount: 1000000000000000000,
			},
			expected: testBurnExpected{
				panic: true,
			},
		},
		"Not enough in balance": {
			input: testBurnInput{
				name:   "TestBurnTokenBurnable",
				from:   bob,
				amount: 1000000000000000000,
			},
			expected: testBurnExpected{
				panic: true,
			},
		},
		"Is not the owner": {
			input: testBurnInput{
				name:   "TestBurnTokenBurnable",
				from:   alice,
				amount: 1000000000000000000,
			},
			expected: testBurnExpected{
				panic: true,
			},
		},
	}

	for testName, test := range tests {
		t.Run(testName, func(t *testing.T) {
			defer func() {
				if r := recover(); (r != nil) != test.expected.panic {
					t.Errorf("panic = %v, want %v", r != nil, test.expected.panic)
				}
			}()

			Burn(test.input.name, test.input.from, test.input.amount)

			inst := mustGetToken(test.input.name)
			if !test.expected.panic {
				if inst.TotalSupply() != test.expected.totalSupply {
					t.Errorf("totalSupply = %v, want %v", inst.TotalSupply(), test.expected.totalSupply)
				}
			}
		})
	}
}

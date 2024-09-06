package launchpad_grc20

import "testing"

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
				name:      "TestToken",
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
				name:      "TestToken",
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
				name:      "TestToke2n",
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
				name:      "TestToken",
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
				name:      "TestToken2",
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
			if inst.banker.GetName() != test.expected.name {
				t.Errorf("name = %v, want %v", inst.banker.GetName(), test.expected.name)
			}
			if inst.banker.GetSymbol() != test.expected.symbol {
				t.Errorf("symbol = %v, want %v", inst.banker.GetSymbol(), test.expected.symbol)
			}
			if inst.image != test.expected.image {
				t.Errorf("image = %v, want %v", inst.image, test.expected.image)
			}
			if inst.banker.GetDecimals() != test.expected.decimals {
				t.Errorf("decimals = %v, want %v", inst.banker.GetDecimals(), test.expected.decimals)
			}
			if inst.banker.TotalSupply() != test.expected.initial {
				t.Errorf("initial = %v, want %v", inst.banker.TotalSupply(), test.expected.initial)
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

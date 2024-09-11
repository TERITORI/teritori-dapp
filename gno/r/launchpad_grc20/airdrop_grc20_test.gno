package launchpad_grc20

import (
	"fmt"
	"std"
	"strconv"
	"testing"
	"time"

	"gno.land/p/demo/merkle"
)

func TestNewAirdrop(t *testing.T) {
	type testNewAidropInput struct {
		tokenName     string
		root          string
		amountPerAddr uint64
		start         uint64
		end           uint64
	}

	type testNewAirdropExpected struct {
		panic         bool
		tokenName     string
		root          string
		amountPerAddr uint64
		start         uint64
		end           uint64
	}

	type testNewAirdrop struct {
		input    testNewAidropInput
		expected testNewAirdropExpected
	}

	type testNewAirdropTestTable = map[string]testNewAirdrop

	tests := testNewAirdropTestTable{
		"Success": {
			input: testNewAidropInput{
				tokenName:     "TestNewAirdropMintableToken",
				root:          "root",
				amountPerAddr: 100,
				start:         0,
				end:           0,
			},
			expected: testNewAirdropExpected{
				panic:         false,
				tokenName:     "TestNewAirdropMintableToken",
				root:          "root",
				amountPerAddr: 100,
				start:         0,
				end:           0,
			},
		},
		"Token that does not exist": {
			input: testNewAidropInput{
				tokenName:     "ThisTokenDoesNotExist",
				root:          "root",
				amountPerAddr: 100,
				start:         0,
				end:           0,
			},
			expected: testNewAirdropExpected{
				panic: true,
			},
		},
		"Token that is not mintable": {
			input: testNewAidropInput{
				tokenName:     "TestNewAirdropNotMintableToken",
				root:          "root",
				amountPerAddr: 100,
				start:         0,
				end:           0,
			},
			expected: testNewAirdropExpected{
				panic: true,
			},
		},
		"Airdrop should start in the future or be equal to 0": {
			input: testNewAidropInput{
				tokenName:     "TestNewAirdropMintableToken",
				root:          "root",
				amountPerAddr: 100,
				start:         100,
				end:           0,
			},
			expected: testNewAirdropExpected{
				panic: true,
			},
		},
		"Airdrop should end in the future or be equal to 0": {
			input: testNewAidropInput{
				tokenName:     "TestNewAirdropMintableToken",
				root:          "root",
				amountPerAddr: 100,
				start:         0,
				end:           100,
			},
			expected: testNewAirdropExpected{
				panic: true,
			},
		},
		"Airdrop should start before it ends": {
			input: testNewAidropInput{
				tokenName:     "TestNewAirdropMintableToken",
				root:          "root",
				amountPerAddr: 100,
				start:         100,
				end:           50,
			},
			expected: testNewAirdropExpected{
				panic: true,
			},
		},
	}

	// Create tokens for testing
	NewToken("TestNewAirdropMintableToken", "TestNewAirdropMintableToken", "noimage", 18, 21_000_000, 23_000_000, true, true)
	NewToken("TestNewAirdropNotMintableToken", "TestNewAirdropNotMintableToken", "noimage", 18, 21_000_000, 23_000_000, false, true)
	for testName, test := range tests {
		t.Run(testName, func(t *testing.T) {
			if test.expected.panic {
				defer func() {
					if r := recover(); r == nil {
						t.Errorf("Expected panic, got none")
					}
				}()
			}

			airdropID := NewAirdrop(test.input.tokenName, test.input.root, test.input.amountPerAddr, int64(test.input.start), int64(test.input.end))
			airdrop := mustGetAirdrop(airdropID)

			if !test.expected.panic {
				if airdrop.merkleRoot != test.expected.root {
					t.Errorf("Expected root to be %s, got %s", test.expected.root, airdrop.merkleRoot)
				}
				if airdrop.amountPerAddr != test.expected.amountPerAddr {
					t.Errorf("Expected amountPerAddr to be %d, got %d", test.expected.amountPerAddr, airdrop.amountPerAddr)
				}
				if airdrop.startTimestamp != int64(test.expected.start) {
					t.Errorf("Expected startTimestamp to be %d, got %d", test.expected.start, airdrop.startTimestamp)
				}
				if airdrop.endTimestamp != int64(test.expected.end) {
					t.Errorf("Expected endTimestamp to be %d, got %d", test.expected.end, airdrop.endTimestamp)
				}
			}
		})
	}
}

func TestClaimJSON(t *testing.T) {
	type testClaimJSONInput struct {
		airdropID uint64
		proofs    string
	}

	type testClaimJSONExpected struct {
		panic bool
	}

	type testClaimJSON struct {
		input    testClaimJSONInput
		expected testClaimJSONExpected
	}

	type testClaimJSONTestTable = map[string]testClaimJSON

	leaves := []merkle.Hashable{
		Leaf{[]byte("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")},
		Leaf{[]byte("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")},
	}

	tree := merkle.NewTree(leaves)
	root := tree.Root()
	proofs, _ := tree.Proof(leaves[0])

	erroneousProofs := []merkle.Node{
		{[]byte("badproof")},
		{[]byte("badproof")},
	}

	now := time.Now().Unix()
	NewToken("TestClaimJSONAirDropToken", "TestClaimJSONAirDropToken", "noimage", 18, 21_000_000, 23_000_000, true, true)
	airdropID := NewAirdrop("TestClaimJSONAirDropToken", root, 100, 0, 0)

	// since we use gnoland/p/demo/merkle, we cannot use the unexported proof.position field, so i put 0 as a placeholder
	// it means that this test only works for the first leaf in the tree
	proofsJSON := "["
	for i, proof := range proofs {
		proofsJSON += fmt.Sprintf("{\"hash\":\"%s\", \"pos\":\"%s\"}", proof.Hash(), "0")
		if i != len(proofs)-1 {
			proofsJSON += ", "
		}
	}
	proofsJSON += "]"

	tests := testClaimJSONTestTable{
		"Success": {
			input: testClaimJSONInput{
				airdropID: airdropID,
				proofs:    proofsJSON,
			},
			expected: testClaimJSONExpected{
				panic: false,
			},
		},
		"Bad JSON format": {
			input: testClaimJSONInput{
				airdropID: airdropID,
				proofs:    "badjson",
			},
			expected: testClaimJSONExpected{
				panic: true,
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

			std.TestSetOrigCaller(std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg"))
			ClaimJSON(test.input.airdropID, test.input.proofs)
		})
	}
}

func TestClaim(t *testing.T) {
	type testClaimInput struct {
		airdropID uint64
		addr      std.Address
		proofs    []merkle.Node
	}

	type testClaimExpected struct {
		panic   bool
		balance uint64
	}

	type testClaim struct {
		input    testClaimInput
		expected testClaimExpected
	}

	type testClaimTestTable = map[string]testClaim

	leaves := []merkle.Hashable{
		Leaf{[]byte("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")},
		Leaf{[]byte("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")},
	}

	tree := merkle.NewTree(leaves)
	root := tree.Root()
	proofs, _ := tree.Proof(leaves[0])

	erroneousProofs := []merkle.Node{
		{[]byte("badproof")},
		{[]byte("badproof")},
	}

	now := time.Now().Unix()
	std.TestSetOrigCaller(std.Address("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv"))
	NewToken("TestClaimAirDropToken", "TestClaimAirDropToken", "noimage", 18, 21_000_000, 23_000_000, true, true)
	notStartedAirDropID := NewAirdrop("TestClaimAirDropToken", root, 100, now+100, now+200)
	airdropID := NewAirdrop("TestClaimAirDropToken", root, 100, 0, 0)

	tests := testClaimTestTable{
		"Success": {
			input: testClaimInput{
				airdropID: airdropID,
				addr:      std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg"),
				proofs:    proofs,
			},
			expected: testClaimExpected{
				panic:   false,
				balance: 100,
			},
		},
		"Already claimed": {
			input: testClaimInput{
				airdropID: airdropID,
				addr:      std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg"),
				proofs:    proofs,
			},
			expected: testClaimExpected{
				panic: true,
			},
		},
		"Invalid proof": {
			input: testClaimInput{
				airdropID: airdropID,
				addr:      std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg"),
				proofs:    erroneousProofs,
			},
			expected: testClaimExpected{
				panic: true,
			},
		},
		"Invalid addr": {
			input: testClaimInput{
				airdropID: airdropID,
				addr:      std.Address("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv"),
				proofs:    proofs,
			},
			expected: testClaimExpected{
				panic: true,
			},
		},
		"Airdrop not ongoing": {
			input: testClaimInput{
				airdropID: notStartedAirDropID,
				addr:      std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg"),
				proofs:    proofs,
			},
			expected: testClaimExpected{
				panic: true,
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
			Claim(test.input.airdropID, test.input.proofs)
			airdrop := mustGetAirdrop(test.input.airdropID)

			if !test.expected.panic {
				if !airdrop.hasAlreadyClaimed(test.input.addr) {
					t.Errorf("Expected address be set as claimed, but it is not")
				}
				if airdrop.token.banker.BalanceOf(test.input.addr) != test.expected.balance {
					t.Errorf("Expected balance to be %d, got %d", test.expected.balance, airdrop.token.banker.BalanceOf(test.input.addr))
				}
			}
		})
	}
}

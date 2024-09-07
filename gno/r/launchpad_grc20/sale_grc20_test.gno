func TestNewSale(t *testing.T) {
	type testNewSaleInput struct {
		tokenName     string
		startTimestamp int64
		endTimestamp   int64
		pricePerToken  uint64
		limitPerAddr   uint64
		minGoal        uint64
		maxGoal        uint64
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
	}

	type testNewSale struct {
		input    testNewSaleInput
		expected testNewSaleExpected
	}

	type testNewSaleTestTable = map[string]testNewSale
	
	tests := testNewSaleTestTable{
		"Success": {
			input: testNewSaleInput{
				tokenName:     "TestNewSaleMintableToken",
				startTimestamp: 0,
				endTimestamp:   0,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
			},
			expected: testNewSaleExpected{
				panic:          false,
				tokenName:      "TestNewSaleMintableToken",
				startTimestamp: 0,
				endTimestamp:   0,
				pricePerToken:  100,
				limitPerAddr:   100,
				minGoal:        100,
				maxGoal:        100,
			},
		},
	}

	NewToken("TestNewSaleMintableToken", "TestNewSaleMintableToken", "image", 18, 21_000_000, 23_000_000, true, true)
}
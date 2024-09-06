package launchpad_grc20

func createTestingTokens() {
	// Create tokens for testing
	NewToken("MintableTestToken", "MintableTestToken", "noimage", 18, 21_000_000, 23_000_000, true, true)
	NewToken("NotMinableTestToken", "NotMinableTestToken", "noimage", 18, 21_000_000, 23_000_000, false, true)
}

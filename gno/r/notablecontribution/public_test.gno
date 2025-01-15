package notablecontribution
import (
	"std"
	"testing"

	"gno.land/p/demo/testutils"
)

func TestNotableContributionLifecycle(t *testing.T) {
	defaultAddress := std.GetOrigCaller()
 user1Address := std.Address(testutils.TestAddress("user 1"))

	result := GnorkleEntrypoint("request")
	if result != "[]" {
		t.Fatalf("expected empty request result, got %s", result)
	}

	RequestNotableContribution("omarsy", UserGithub, "200032", NotableContributionTypeCommit, "", "https://github.com/gnolang/gno/commit/200032", "13/10/2024 15:51:23")

	var errMsg string
	func() {
		defer func() {
			if r := recover(); r != nil {
				errMsg = r.(error).Error()
			}
		}()
		RequestNotableContribution("omarsy", UserGithub, "200032", NotableContributionTypeCommit, "", "https://github.com/gnolang/gno/commit/200032", "13/10/2024 15:51:23")
	}()
	if errMsg != "feed already exists" {
		t.Fatalf("expected feed already exists, got %s", errMsg)
	}

	result = GnorkleEntrypoint("request")
	expResult := `[{"id":"omarsy:github:200032:commit","type":"0","value_type":"string","tasks":[{"user":{"ID":"omarsy","Type":"github"},"notablecontribution":{"ID":"200032", "Type":"commit","Description":"","URL":"https://github.com/gnolang/gno/commit/200032","Date":"13/10/2024 15:51:23"}}]}]`
	if result != expResult {
		t.Fatalf("expected request result %s, got %s", expResult, result)
	}

	// Try to trigger feed ingestion from the non-authorized user.
	std.TestSetOrigCaller(user1Address)
	func() {
		defer func() {
			if r := recover(); r != nil {
				errMsg = r.(error).Error()
			}
		}()
		GnorkleEntrypoint("ingest,omarsy:github:200032:commit,OK")
	}()
	if errMsg != "caller not whitelisted" {
		t.Fatalf("expected caller not whitelisted, got %s", errMsg)
	}
  std.TestSetOrigCaller(defaultAddress)
  
  GnorkleEntrypoint("ingest,omarsy:github:200032:commit,OK")

  result = GnorkleEntrypoint("request")
  if result != `[]` {
    t.Fatalf("expected empty request result, got %s", result)
  }

  result = Render("")
  expectedResult := `{"omarsy:github":[{"ID":"200032", "Type":"commit","Description":"","URL":"https://github.com/gnolang/gno/commit/200032","Date":"13/10/2024 15:51:23"}]}`
  if result != expectedResult {
    t.Fatalf("expected render result %s, got %s", expectedResult, result) 
  }
}

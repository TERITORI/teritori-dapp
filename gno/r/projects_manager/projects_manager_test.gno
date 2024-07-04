package projects_manager

import (
	"std"
	"testing"
	"time"

	"gno.land/p/demo/json"
)

func TestJSONRender(t *testing.T) {
	createdAt := time.Date(2021, time.August, 1, 0, 0, 0, 0, time.UTC)
	duration := time.Hour * 24 * 30
	expireAt := createdAt.Add(duration)

	// golden contract
	contract := Contract{
		id:                   1,
		sender:               std.Address("sender"),
		contractor:           std.Address("contractor2"),
		contractorCandidates: []std.Address{"contractor1", "contractor2"},
		funder:               "funder",
		paymentDenom:         "denom",
		metadata:             "metadata",
		status:               CREATED,
		expireAt:             expireAt,
		funderFeedback:       "funderFeedback",
		contractorFeedback:   "contractorFeedback",
		milestones: []Milestone{
			{
				id:       1,
				title:    "title",
				desc:     "desc",
				amount:   100,
				paid:     0,
				duration: duration,
				link:     "link",
				funded:   false,
				priority: MS_PRIORITY_HIGH,
				status:   MS_OPEN,
			},
		},
		pausedBy:         "pausedBy",
		conflictHandler:  "conflictHandler",
		handlerCandidate: "handlerCandidate",
		handlerSuggestor: "handlerSuggestor",
		createdAt:        createdAt,
		budget:           1000,
		funded:           false,
		rejectReason:     "rejectReason",
		conflicts: []Conflict{
			{
				initiator:         "initiator",
				createdAt:         createdAt,
				respondedAt:       nil,
				resolvedAt:        nil,
				initiatorMessage:  "initiatorMessage",
				responseMessage:   nil,
				resolutionMessage: nil,
				outcome:           nil,
			},
		},
	}

	output, err := json.Marshal(contract.ToJSON())
	if err != nil {
		t.Fatalf("Error marshalling contract to JSON: %s", err)
	}

	expected := `{"id":"1","sender":"sender","contractor":"contractor2","contractorCandidates":["contractor1","contractor2"],"funder":"funder","paymentDenom":"denom","metadata":"metadata","status":"CREATED","expireAt":"2021-08-31T00:00:00Z","funderFeedback":"funderFeedback","contractorFeedback":"contractorFeedback","milestones":[{"id":"1","title":"title","desc":"desc","amount":"100","paid":"0","duration":2592000,"link":"link","funded":false,"priority":"MS_PRIORITY_HIGH","status":"MS_OPEN"}],"pausedBy":"pausedBy","conflictHandler":"conflictHandler","handlerCandidate":"handlerCandidate","handlerSuggestor":"handlerSuggestor","createdAt":"2021-08-01T00:00:00Z","budget":"1000","funded":false,"rejectReason":"rejectReason","conflicts":[{"initiator":"initiator","createdAt":"2021-08-01T00:00:00Z","initiatorMessage":"initiatorMessage"}]}`
	if string(output) != expected {
		t.Errorf("Expected output to be `%s`, got:\n`%s`", expected, string(output))
	}
}

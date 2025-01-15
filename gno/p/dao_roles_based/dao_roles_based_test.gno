package dao_roles_based

// Test Dao Creation (done)
// Test Dao Has Role (done)
// Test Dao IsMember (done)
// Test Dao Proposal (done)
// Test Dao Vote
// Test Dao Execute

import (
	"std"
	"testing"

	"gno.land/p/demo/json"
	"gno.land/p/demo/testutils"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
	carol = testutils.TestAddress("carol")
	dave  = testutils.TestAddress("dave")
)

type MockExecutableMessage struct{}

func (msg MockExecutableMessage) Type() string {
	return "MockExecutableMessage"
}

func (msg MockExecutableMessage) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{})
}

func (msg MockExecutableMessage) FromJSON(ast *json.Node) {
}

func (msg MockExecutableMessage) String() string {
	return "MockExecutableMessage"
}

type MockMessageHandler struct{}

func (h MockMessageHandler) Execute(iMsg ExecutableMessage) {
}

func (h MockMessageHandler) Instantiate() ExecutableMessage {
	return MockExecutableMessage{}
}

func (h MockMessageHandler) Type() string {
	return MockExecutableMessage{}.Type()
}

func TestNewDaoRolesBasedJSON(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := [][]string{{alice.String(), "admin"}, {bob.String()}, {carol.String()}}
	resourcesJSON := `[]`
	handlers := []MessageHandler{}

	dao := NewDaoRolesBasedJSON(name, description, roles, members, resourcesJSON, handlers)
	roles = dao.MemberModule.GetRoles()
	if len(roles) != 1 {
		t.Errorf("Expected 1 role, got %d", len(roles))
	}
	if roles[0] != "admin" {
		t.Errorf("Expected role 'admin', got %s", roles[0])
	}

	for _, member := range members {
		address := member[0]
		if !dao.IsMember(address) {
			t.Errorf("Expected member %s to be a member", address)
		}
		if len(member) == 2 && !dao.HasRole(address, member[1]) {
			t.Errorf("Expected member %s to have role %s", address, member[1])
		}
	}

	resourcesLen := dao.ResourcesModule.resources.Size()
	if resourcesLen != 0 {
		t.Errorf("Expected 0 resources, got %d", resourcesLen)
	}
}

func TestProposeJSON(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := [][]string{{alice.String(), "admin"}, {bob.String()}, {carol.String()}}

	messagesHandlers := []MessageHandler{
		&MockMessageHandler{},
	}

	resourcesJSON := `[{"resource":"MockExecutableMessage","condition":{"type":"members-threshold","threshold":"60"}}]`
	std.TestSetOrigCaller(alice)
	dao := NewDaoRolesBasedJSON(name, description, roles, members, resourcesJSON, messagesHandlers)

	validProposalJSON := `{"title":"My Proposal","description":"My Proposal Description","message":{"type":"MockExecutableMessage","payload":{}}}`

	type testNewProposalInput struct {
		proposalJSON string
		proposer     std.Address
	}

	type tesNewProposalExpected struct {
		title        string
		description  string
		proposer     std.Address
		messsageType string
		panic        bool
	}

	type testNewProposal struct {
		input    testNewProposalInput
		expected tesNewProposalExpected
	}

	type testNewProposalTable map[string]testNewProposal

	tests := testNewProposalTable{
		"Success": {
			input: testNewProposalInput{
				proposalJSON: validProposalJSON,
				proposer:     alice,
			},
			expected: tesNewProposalExpected{
				title:        "My Proposal",
				description:  "My Proposal Description",
				proposer:     alice,
				messsageType: "MockExecutableMessage",
				panic:        false,
			},
		},
		"Bad JSON format": {
			input: testNewProposalInput{
				proposalJSON: `badjson`,
				proposer:     alice,
			},
			expected: tesNewProposalExpected{
				panic: true,
			},
		},
		"Non-member": {
			input: testNewProposalInput{
				proposalJSON: validProposalJSON,
				proposer:     dave,
			},
			expected: tesNewProposalExpected{
				panic: true,
			},
		},
		"Unknown message type": {
			input: testNewProposalInput{
				proposalJSON: `{"title":"My Proposal","description":"My Proposal Description","message":{"type":"UnknownMessage","payload":{""}}}`,
				proposer:     alice,
			},
			expected: tesNewProposalExpected{
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

			std.TestSetOrigCaller(test.input.proposer)
			dao.ProposeJSON(test.input.proposalJSON)

			proposal := dao.ProposalModule.getProposal(1)
			if proposal.title != test.expected.title {
				t.Errorf("Expected title %s, got %s", test.expected.title, proposal.title)
			}
			if proposal.description != test.expected.description {
				t.Errorf("Expected description %s, got %s", test.expected.description, proposal.description)
			}
			if proposal.proposer.String() != test.expected.proposer.String() {
				t.Errorf("Expected proposer %s, got %s", test.expected.proposer, proposal.proposer)
			}
			if proposal.message.Type() != test.expected.messsageType {
				t.Errorf("Expected message type %s, got %s", test.expected.messsageType, proposal.message.Type())
			}
		})
	}
}

func TestVote(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := [][]string{{alice.String(), "admin"}, {bob.String()}, {carol.String()}}

	messagesHandlers := []MessageHandler{
		&MockMessageHandler{},
	}

	resourcesJSON := `[{"resource":"MockExecutableMessage","condition":{"type":"members-threshold","threshold":"10"}}]`
	std.TestSetOrigCaller(alice)
	dao := NewDaoRolesBasedJSON(name, description, roles, members, resourcesJSON, messagesHandlers)
	proposalJSON := `{"title":"My Proposal","description":"My Proposal Description","message":{"type":"MockExecutableMessage","payload":{}}}`
	std.TestSetOrigCaller(alice)
	dao.ProposeJSON(proposalJSON)

	type testVoteInput struct {
		proposalID uint64
		vote       string
		voter      std.Address
	}

	type testVoteExpected struct {
		eval  bool
		panic bool
	}

	type testVote struct {
		input    testVoteInput
		expected testVoteExpected
	}

	type testVoteTable map[string]testVote

	tests := testVoteTable{
		"Success no": {
			input: testVoteInput{
				proposalID: 1,
				vote:       "no",
				voter:      alice,
			},
			expected: testVoteExpected{
				eval:  false,
				panic: false,
			},
		},
		"Success yes": {
			input: testVoteInput{
				proposalID: 1,
				vote:       "yes",
				voter:      alice,
			},
			expected: testVoteExpected{
				eval:  true,
				panic: false,
			},
		},
		"Unknown proposal": {
			input: testVoteInput{
				proposalID: 2,
				vote:       "yes",
				voter:      alice,
			},
			expected: testVoteExpected{
				eval:  false,
				panic: true,
			},
		},
		"Non-member": {
			input: testVoteInput{
				proposalID: 1,
				vote:       "yes",
				voter:      dave,
			},
			expected: testVoteExpected{
				eval:  false,
				panic: true,
			},
		},
		"Invalid vote": {
			input: testVoteInput{
				proposalID: 1,
				vote:       "invalid",
				voter:      alice,
			},
			expected: testVoteExpected{
				eval:  false,
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

			std.TestSetOrigCaller(test.input.voter)
			dao.Vote(test.input.proposalID, test.input.vote)

			proposal := dao.ProposalModule.getProposal(test.input.proposalID)
			eval := proposal.state.Eval(proposal.votes)
			if eval != test.expected.eval {
				t.Errorf("Expected eval %t, got %t", test.expected.eval, eval)
			}
		})
	}
}

func TestExecuteProposal(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := [][]string{{alice.String(), "admin"}, {bob.String()}, {carol.String()}}

	messagesHandlers := []MessageHandler{
		&MockMessageHandler{},
	}

	resourcesJSON := `[{"resource":"MockExecutableMessage","condition":{"type":"members-threshold","threshold":"10"}}]`
	std.TestSetOrigCaller(alice)
	dao := NewDaoRolesBasedJSON(name, description, roles, members, resourcesJSON, messagesHandlers)
	proposalJSON := `{"title":"My Proposal","description":"My Proposal Description","message":{"type":"MockExecutableMessage","payload":{}}}`
	std.TestSetOrigCaller(alice)
	dao.ProposeJSON(proposalJSON)

	type testExecuteInput struct {
		proposalID uint64
		executor   std.Address
		haveVote   bool
		voter      std.Address
	}

	type testExecuteExpected struct {
		panic bool
	}

	type testExecute struct {
		input    testExecuteInput
		expected testExecuteExpected
	}

	type testExecuteTable map[string]testExecute

	tests := testExecuteTable{
		"Conditions not met": {
			input: testExecuteInput{
				proposalID: 1,
				executor:   alice,
				haveVote:   false,
				voter:      alice,
			},
			expected: testExecuteExpected{
				panic: true,
			},
		},
		"Success": {
			input: testExecuteInput{
				proposalID: 1,
				executor:   alice,
				haveVote:   true,
				voter:      alice,
			},
			expected: testExecuteExpected{
				panic: false,
			},
		},
		"Unknown proposal": {
			input: testExecuteInput{
				proposalID: 2,
				executor:   alice,
				haveVote:   false,
				voter:      alice,
			},
			expected: testExecuteExpected{
				panic: true,
			},
		},
		"Non-member": {
			input: testExecuteInput{
				proposalID: 1,
				executor:   dave,
				haveVote:   false,
				voter:      alice,
			},
			expected: testExecuteExpected{
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

			if test.input.haveVote {
				std.TestSetOrigCaller(test.input.voter)
				dao.Vote(test.input.proposalID, "yes")
			}

			std.TestSetOrigCaller(test.input.executor)
			dao.Execute(test.input.proposalID)

			proposal := dao.ProposalModule.getProposal(test.input.proposalID)

			if proposal.status != ProposalStatusExecuted {
				t.Errorf("Expected status %s, got %s", ProposalStatusExecuted, proposal.status)
			}
		})
	}
}

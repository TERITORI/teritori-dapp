package basedao

import (
	"std"
	"testing"

	"gno.land/p/demo/testutils"
	"gno.land/p/demo/urequire"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/daokit"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
	carol = testutils.TestAddress("carol")
	dave  = testutils.TestAddress("dave")
)

func TestNewDAO(t *testing.T) {
	conf := &Config{
		Name:        "My DAO",
		Description: "My DAO Description",
		Roles:       []string{"admin"},
		Members: []Member{
			{
				alice.String(),
				[]string{"admin"},
			},
			{
				bob.String(),
				[]string{},
			},
			{
				carol.String(),
				[]string{},
			},
		},
	}

	std.TestSetOrigCaller(alice)
	dao := New(conf)
	roles := dao.Members.GetRoles()
	if len(roles) != 1 {
		t.Errorf("Expected 1 role, got %d", len(roles))
	}
	if roles[0] != "admin" {
		t.Errorf("Expected role 'admin', got %s", roles[0])
	}

	for _, member := range conf.Members {
		address := member.Address
		if !dao.Members.IsMember(address) {
			t.Errorf("Expected member %s to be a member", address)
		}
		if len(member.Roles) == 1 && !dao.Members.HasRole(address, member.Roles[0]) {
			t.Errorf("Expected member %s to have role %s", address, member.Roles[0])
		}
	}

	urequire.Equal(t, 5, dao.Core.ResourcesCount(), "expected 5 resources")
}

func TestPropose(t *testing.T) {
	conf := &Config{
		Name:        "My DAO",
		Description: "My DAO Description",
		Roles:       []string{"admin"},
		Members: []Member{
			{
				alice.String(),
				[]string{"admin"},
			},
			{
				bob.String(),
				[]string{},
			},
			{
				carol.String(),
				[]string{},
			},
		},
	}

	std.TestSetOrigCaller(alice)
	dao := New(conf)

	validHandlerKind := "valid"

	mockCalled := false
	mockHandler := daokit.NewMessageHandler("valid", func(_ interface{}) { mockCalled = true })
	dao.Core.SetResource(&daokit.Resource{
		Handler:   mockHandler,
		Condition: daocond.MembersThreshold(0.2, dao.Members.IsMember, dao.Members.MembersCount),
	})

	validProposalRequest := daokit.ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Message:     mockHandler.Instantiate(),
	}

	unknownProposalRequest := daokit.ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Message:     &MockExecutableMessage{kind: "unknown"},
	}

	type testNewProposalInput struct {
		proposalReq daokit.ProposalRequest
		proposer    std.Address
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
				proposalReq: validProposalRequest,
				proposer:    alice,
			},
			expected: tesNewProposalExpected{
				title:        "My Proposal",
				description:  "My Proposal Description",
				proposer:     alice,
				messsageType: "MockExecutableMessage",
				panic:        false,
			},
		},
		"Non-member": {
			input: testNewProposalInput{
				proposalReq: validProposalRequest,
				proposer:    dave,
			},
			expected: tesNewProposalExpected{
				panic: true,
			},
		},
		"Unknown message type": {
			input: testNewProposalInput{
				proposalReq: unknownProposalRequest,
				proposer:    alice,
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
			dao.Propose(test.input.proposalReq)

			proposal := dao.Core.ProposalModule.GetProposal(1)
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
	conf := &Config{
		Name:        "My DAO",
		Description: "My DAO Description",
		Roles:       []string{"admin"},
		Members: []Member{
			{
				alice.String(),
				[]string{"admin"},
			},
			{
				bob.String(),
				[]string{},
			},
			{
				carol.String(),
				[]string{},
			},
		},
	}

	dao := &DAO{}

	condition := CreateCondition("members-treshold", &dao, 0.2)
	resources := []Resource{
		{
			"MockExecutableMessage",
			MockMessageHandler{t: t, kind: "valid"},
			condition,
		},
	}

	std.TestSetOrigCaller(alice)
	dao = New(name, description, roles, members, resources, condition)
	validProposalRequest := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "MockExecutableMessage",
		Payload:     map[string]interface{}{},
	}

	std.TestSetOrigCaller(alice)
	dao.Propose(validProposalRequest)

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
			eval := proposal.conditionState.Eval(proposal.votes)
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
	members := []Member{
		{
			alice.String(),
			[]string{"admin"},
		},
		{
			bob.String(),
			[]string{},
		},
		{
			carol.String(),
			[]string{},
		},
	}

	dao := &DAO{}

	condition := CreateCondition("members-treshold", &dao, 0.2)
	resources := []Resource{
		{
			"MockExecutableMessage",
			MockMessageHandler{},
			condition,
		},
	}

	std.TestSetOrigCaller(alice)
	dao = New(name, description, roles, members, resources, condition)
	validProposalRequest := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "MockExecutableMessage",
		Payload:     map[string]interface{}{},
	}
	std.TestSetOrigCaller(alice)
	dao.Propose(validProposalRequest)

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

func TestInstantExecute(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := []Member{
		{
			alice.String(),
			[]string{"admin"},
		},
		{
			bob.String(),
			[]string{},
		},
		{
			carol.String(),
			[]string{},
		},
	}

	dao := &DAO{}

	condition := CreateCondition("members-treshold", &dao, 0.2)
	resources := []Resource{
		{
			"MockExecutableMessage",
			MockMessageHandler{},
			condition,
		},
	}

	std.TestSetOrigCaller(alice)
	dao = New(name, description, roles, members, resources, condition)

	validProposalRequest := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "MockExecutableMessage",
		Payload:     map[string]interface{}{},
	}

	unknownProposalRequest := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "UnknownMessage",
		Payload:     map[string]interface{}{},
	}

	std.TestSetOrigCaller(alice)

	type testInstantExecuteInput struct {
		proposalReq ProposalRequest
		executor    std.Address
	}

	type testInstantExecuteExpected struct {
		panic bool
	}

	type testInstantExecute struct {
		input    testInstantExecuteInput
		expected testInstantExecuteExpected
	}

	type testInstantExecuteTable map[string]testInstantExecute

	tests := testInstantExecuteTable{
		"Success": {
			input: testInstantExecuteInput{
				proposalReq: validProposalRequest,
				executor:    alice,
			},
			expected: testInstantExecuteExpected{
				panic: false,
			},
		},
		"Unknown message type": {
			input: testInstantExecuteInput{
				proposalReq: unknownProposalRequest,
				executor:    alice,
			},
			expected: testInstantExecuteExpected{
				panic: true,
			},
		},
		"Non-member": {
			input: testInstantExecuteInput{
				proposalReq: validProposalRequest,
				executor:    dave,
			},
			expected: testInstantExecuteExpected{
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

			std.TestSetOrigCaller(test.input.executor)
			dao.InstantExecute(test.input.proposalReq)
		})
	}
}

func TestGetMembers(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := []Member{
		{
			alice.String(),
			[]string{"admin"},
		},
		{
			bob.String(),
			[]string{},
		},
		{
			carol.String(),
			[]string{},
		},
	}

	dao := &DAO{}

	condition := CreateCondition("members-treshold", &dao, 0.2)
	resources := []Resource{
		{
			"MockExecutableMessage",
			MockMessageHandler{},
			condition,
		},
	}

	std.TestSetOrigCaller(alice)
	dao = New(name, description, roles, members, resources, condition)

	expectedMembers := []string{alice.String(), bob.String(), carol.String()}
	m := dao.Members.GetMembers()
	if len(m) != len(expectedMembers) {
		t.Errorf("Expected %d members, got %d", len(expectedMembers), len(m))
	}

	for _, eMember := range expectedMembers {
		if !dao.Members.IsMember(eMember) {
			t.Errorf("Expected member %s to be a member", eMember)
		}
	}
}

func TestAddMemberProposal(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := []Member{
		{
			alice.String(),
			[]string{"admin"},
		},
	}

	dao := &DAO{}

	condition := CreateCondition("members-treshold", &dao, 0.2)
	resources := []Resource{
		{
			"MockExecutableMessage",
			MockMessageHandler{},
			condition,
		},
	}

	std.TestSetOrigCaller(alice)
	dao = New(name, description, roles, members, resources, condition)

	validProposalRequest := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.AddNewMember",
		Payload: map[string]interface{}{
			"address": bob.String(),
			"roles":   []string{"admin"},
		},
	}

	std.TestSetOrigCaller(alice)

	if dao.Members.IsMember(bob.String()) {
		t.Errorf("Expected member %s to not be a member", bob.String())
	}

	dao.InstantExecute(validProposalRequest)

	if !dao.Members.IsMember(bob.String()) {
		t.Errorf("Expected member %s to be a member", bob.String())
	}

	if !dao.Members.HasRole(bob.String(), "admin") {
		t.Errorf("Expected member %s to have role 'admin'", bob.String())
	}

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	proposalWithUnknowkRole := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.AddNewMember",
		Payload: map[string]interface{}{
			"address": bob.String(),
			"roles":   []string{"unknown"},
		},
	}
	std.TestSetOrigCaller(alice)
	dao.InstantExecute(proposalWithUnknowkRole)
}

func TestRemoveMemberProposal(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := []Member{
		{
			alice.String(),
			[]string{"admin"},
		},
		{
			bob.String(),
			[]string{"admin"},
		},
	}

	dao := &DAO{}

	condition := CreateCondition("members-treshold", &dao, 0.2)
	resources := []Resource{
		{
			"MockExecutableMessage",
			MockMessageHandler{},
			condition,
		},
	}

	std.TestSetOrigCaller(alice)
	dao = New(name, description, roles, members, resources, condition)

	validProposalRequest := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.RemoveMember",
		Payload: map[string]interface{}{
			"address": bob.String(),
		},
	}

	std.TestSetOrigCaller(alice)

	if !dao.Members.IsMember(bob.String()) {
		t.Errorf("Expected member %s to be a member", bob.String())
	}

	if !dao.Members.HasRole(bob.String(), "admin") {
		t.Errorf("Expected member %s to have role 'admin'", bob.String())
	}

	dao.InstantExecute(validProposalRequest)

	if dao.Members.IsMember(bob.String()) {
		t.Errorf("Expected user %s to not be a member", bob.String())
	}

	if dao.Members.HasRole(bob.String(), "admin") {
		t.Errorf("Expected user %s to not have role 'admin'", bob.String())
	}
}

func TestAddRoleToUserProposal(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := []Member{
		{
			alice.String(),
			[]string{"admin"},
		},
		{
			bob.String(),
			[]string{},
		},
	}

	dao := &DAO{}

	condition := CreateCondition("members-treshold", &dao, 0.2)
	resources := []Resource{
		{
			"MockExecutableMessage",
			MockMessageHandler{},
			condition,
		},
	}

	std.TestSetOrigCaller(alice)
	dao = New(name, description, roles, members, resources, condition)

	validProposalRequest := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.AddRoleToUser",
		Payload: map[string]interface{}{
			"address": bob.String(),
			"role":    "admin",
		},
	}
	std.TestSetOrigCaller(alice)

	if dao.Members.HasRole(bob.String(), "admin") {
		t.Errorf("Expected member %s to not have role 'admin'", bob.String())
	}

	dao.InstantExecute(validProposalRequest)

	if !dao.Members.HasRole(bob.String(), "admin") {
		t.Errorf("Expected member %s to have role 'admin'", bob.String())
	}

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	proposalWithUnknowkRole := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.AddRoleToUser",
		Payload: map[string]interface{}{
			"address": alice.String(),
			"role":    "unknown",
		},
	}
	std.TestSetOrigCaller(alice)
	dao.InstantExecute(proposalWithUnknowkRole)

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	proposalWithNonMember := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.AddRoleToUser",
		Payload: map[string]interface{}{
			"address": carol.String(),
			"role":    "admin",
		},
	}
	std.TestSetOrigCaller(alice)
	dao.InstantExecute(proposalWithNonMember)

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	proposalWithAlreadyRole := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.AddRoleToUser",
		Payload: map[string]interface{}{
			"address": bob.String(),
			"role":    "admin",
		},
	}
	std.TestSetOrigCaller(alice)
	dao.InstantExecute(proposalWithAlreadyRole)
}

func TestRemoveRoleFromUserProposal(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := []Member{
		{
			alice.String(),
			[]string{"admin"},
		},
		{
			bob.String(),
			[]string{"admin"},
		},
	}

	dao := &DAO{}

	condition := CreateCondition("members-treshold", &dao, 0.2)
	resources := []Resource{
		{
			"MockExecutableMessage",
			MockMessageHandler{},
			condition,
		},
	}

	std.TestSetOrigCaller(alice)
	dao = New(name, description, roles, members, resources, condition)

	validProposalRequest := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.RemoveRoleFromUser",
		Payload: map[string]interface{}{
			"address": bob.String(),
			"role":    "admin",
		},
	}
	std.TestSetOrigCaller(alice)

	if !dao.Members.HasRole(bob.String(), "admin") {
		t.Errorf("Expected member %s to have role 'admin'", bob.String())
	}

	dao.InstantExecute(validProposalRequest)

	if dao.Members.HasRole(bob.String(), "admin") {
		t.Errorf("Expected member %s to not have role 'admin'", bob.String())
	}

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	proposalWithUnknowkRole := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.RemoveRoleFromUser",
		Payload: map[string]interface{}{
			"address": alice.String(),
			"role":    "unknown",
		},
	}
	std.TestSetOrigCaller(alice)
	dao.InstantExecute(proposalWithUnknowkRole)

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	proposalWithNonMember := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.RemoveRoleFromUser",
		Payload: map[string]interface{}{
			"address": carol.String(),
			"role":    "admin",
		},
	}
	std.TestSetOrigCaller(alice)
	dao.InstantExecute(proposalWithNonMember)

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic, got none")
		}
	}()

	proposalWithNonRole := ProposalRequest{
		Title:       "My Proposal",
		Description: "My Proposal Description",
		Type:        "gno.land/p/teritori/daokit.RemoveRoleFromUser",
		Payload: map[string]interface{}{
			"address": bob.String(),
			"role":    "admin",
		},
	}
	std.TestSetOrigCaller(alice)
	dao.InstantExecute(proposalWithNonRole)
}

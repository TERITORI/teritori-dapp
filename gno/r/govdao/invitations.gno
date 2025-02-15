package govdao

import (
	"std"

	"gno.land/p/demo/avl"
)

// TODO: If a member is removed from the DAO, remove all the invitations he sent and received ? (or downgrade to tier 3 if enough invitations ???)
// TODO: if at some point with one message to downgrade user tier, we need to remove the latest invitation
// T1 => 3 invitations
// T2 => 2 invitations
// T3 => 1 invitation
// Invitations is only about adding T3 members
// A user need 2 invitations to become a T3 member
// A member can only delegate one invitation to another user

const (
	T1Invitations = 3
	T2Invitations = 2
	T3Invitations = 1
)

var (
	invitationsSentTree     = avl.NewTree() // std.Addr -> []std.Address
	invitationsReceivedTree = avl.NewTree() // std.Addr -> []std.Address
)

func Delegate(target string) {
	caller := std.PrevRealm().Addr()

	if caller.String() == target {
		panic("caller cannot delegate an invitation to themselves")
	}

	if !dao.Members.IsMember(caller.String()) {
		panic("caller is not a member of the govdao")
	}

	invitationsSent := getInvitationsSent(caller.String())
	for _, addr := range invitationsSent {
		if addr.String() == target {
			panic("caller has already delegated an invitation to this target")
		}
	}

	roles := dao.Members.GetMemberRoles(caller.String())
	if len(roles) == 0 {
		panic("caller is member but has no roles, this should not happen")
	}

	tier := roles[0]
	allowedInvitations := getAllowedInvitations(tier)
	if len(invitationsSent) >= allowedInvitations {
		panic("caller has already delegated the maximum number of invitations")
	}

	invitationsSent = append(invitationsSent, std.Address(target))
	invitationsSentTree.Set(caller.String(), invitationsSent)

	invitationsReceived := getInvitationsReceived(target)
	invitationsReceived = append(invitationsReceived, std.Address(caller))
	invitationsReceivedTree.Set(target, invitationsReceived)

	if len(invitationsReceived) == 2 && !dao.Members.IsMember(target) {
		dao.Members.AddMember(target, []string{Tier3})
	}
}

func Withdraw(target string) {
	caller := std.PrevRealm().Addr()
	if !dao.Members.IsMember(caller.String()) {
		panic("caller is not a member of the govdao")
	}

	invitationsSent := getInvitationsSent(caller.String())
	found := false
	for i, addr := range invitationsSent {
		if addr.String() == target {
			invitationsSent = append(invitationsSent[:i], invitationsSent[i+1:]...)
			found = true
			break
		}
	}
	if !found {
		panic("caller has not delegated an invitation to this target")
	}
	invitationsSentTree.Set(caller.String(), invitationsSent)

	invitationsReceived := getInvitationsReceived(target)
	found = false
	for i, addr := range invitationsReceived {
		if addr.String() == caller.String() {
			invitationsReceived = append(invitationsReceived[:i], invitationsReceived[i+1:]...)
			found = true
			break
		}
	}
	if !found {
		panic("target has not received an invitation from the caller, should not happen at this point")
	}
	invitationsReceivedTree.Set(target, invitationsReceived)

	if len(invitationsReceived) == 1 && dao.Members.HasRole(target, Tier3) {
		invitationsSent = getInvitationsSent(target)
		for _, addr := range getInvitationsSent(target) {
			Withdraw(addr.String())
		}
		dao.Members.RemoveMember(target)
	}
}

func getAllowedInvitations(tier string) int {
	switch tier {
	case Tier1:
		return T1Invitations
	case Tier2:
		return T2Invitations
	case Tier3:
		return T3Invitations
	default:
		panic("caller has an unknown role/tier")
	}
}

func getInvitationsSent(addr string) []std.Address {
	invitationsSentRaw, ok := invitationsSentTree.Get(addr)
	if !ok {
		return []std.Address{}
	}
	invitationsSent, valid := invitationsSentRaw.([]std.Address)
	if !valid {
		panic("invalid type for invitationsSent, should not happen")
	}
	return invitationsSent
}

func getInvitationsReceived(addr string) []std.Address {
	invitationsReceivedRaw, ok := invitationsReceivedTree.Get(addr)
	if !ok {
		return []std.Address{}
	}
	invitationsReceived, valid := invitationsReceivedRaw.([]std.Address)
	if !valid {
		panic("invalid type for invitationsReceived, should not happen")
	}
	return invitationsReceived
}

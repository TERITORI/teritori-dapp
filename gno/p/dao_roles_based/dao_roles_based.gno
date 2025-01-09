package dao_roles_based

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/teritori/daocond"
)

type DaoRolesBased struct {
	MemberModule    *MemberModule
	ResourcesModule *ResourcesModule
	ProposalModule  *ProposalModule
}

func NewDaoRolesBasedJSON(rolesJSON, membersJSON, resourcesJSON string) *DaoRolesBased {
	// parse & set roles, members, resources
	dao := &DaoRolesBased{
		MemberModule:    newMemberModule(),
		ResourcesModule: newResourcesModule(),
		ProposalModule:  newProposalModule(),
	}

	roles := dao.parseRolesJSON(rolesJSON)
	dao.MemberModule.setRoles(roles)

	members := dao.parseMembersJSON(membersJSON)
	dao.MemberModule.setMembers(members)

	resources := dao.parseResourcesJSON(resourcesJSON)
	dao.ResourcesModule.setResources(resources)

	return dao
}

func (d *DaoRolesBased) NewProposal(title, description string) {
	// 3th caller is the proposer, 2nd is the dao realm, 1st is the dao_roles_based module
	proposer := std.GetCallerAt(3)
	if !d.MemberModule.IsMember(proposer.String()) {
		panic("proposer is not a member")
	}

	if len(title) < 9 {
		panic("title should be at least 9 characters long")
	}

	if len(description) < 15 {
		panic("description should be at least 15 characters long")
	}

	d.ProposalModule.newProposal(title, description, proposer)
}

func (d *DaoRolesBased) HasRole(memberId string, role string) bool {
	return d.MemberModule.HasRole(memberId, role)
}

func (d *DaoRolesBased) IsMember(memberId string) bool {
	return d.MemberModule.IsMember(memberId)
}

func (d *DaoRolesBased) MembersCount() uint64 {
	return d.MemberModule.MembersCount()
}

func (d *DaoRolesBased) parseRolesJSON(rolesJSON string) []string {
	nodes, err := json.Unmarshal([]byte(rolesJSON))
	if err != nil {
		panic("invalid roles json format")
	}
	roles := nodes.MustArray()
	rolesStr := make([]string, len(roles))
	for i, role := range roles {
		rolesStr[i] = role.MustString()
	}
	return rolesStr
}

func (d *DaoRolesBased) parseMembersJSON(membersJSON string) [][]string {
	nodes, err := json.Unmarshal([]byte(membersJSON))
	if err != nil {
		panic("invalid members json format")
	}
	membersNodesArray := nodes.MustArray()
	members := make([][]string, len(membersNodesArray))
	for i, memberNode := range membersNodesArray {
		memberObj := memberNode.MustObject()
		memberRolesObj := memberObj["roles"].MustArray()
		member := make([]string, len(memberRolesObj)+1)
		member[0] = memberObj["address"].MustString()
		for j, role := range memberRolesObj {
			member[j+1] = role.MustString()
		}
		members[i] = member
	}
	return members
}

func (d *DaoRolesBased) parseResourcesJSON(resourcesJSON string) *avl.Tree {
	nodes, err := json.Unmarshal([]byte(resourcesJSON))
	if err != nil {
		panic("invalid resources json format")
	}
	resourcesNodesArray := nodes.MustArray()
	resources := avl.NewTree()
	for _, resourceNode := range resourcesNodesArray {
		resourceObj := resourceNode.MustObject()
		condition := daocond.ConditionFromJSON(resourceObj["condition"], d.HasRole, d.IsMember, d.MembersCount)
		resources.Set(resourceObj["resource"].MustString(), condition)
	}
	return resources
}

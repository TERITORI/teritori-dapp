package basedao

import (
	"errors"
	"std"

	"gno.land/p/demo/mux"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/daokit"
)

// XXX: todo:

type SubAddr struct {
	Base std.Address
	Path string
}

// end todo

type DAO struct {
	Core         *daokit.Core
	Members      *membersStore
	RenderRouter *mux.Router
}

type Config struct {
	Name             string
	Description      string
	ImageURI         string
	Roles            []string
	Members          []Member
	InitialCondition daocond.Condition
	SetProfileString ProfileStringSetter
}

func New(conf *Config) *DAO {
	members := newMembersStore()
	members.setMembers(conf.Members)

	dao := &DAO{
		Core:    daokit.NewCore(),
		Members: members,
	}

	if conf.InitialCondition == nil {
		conf.InitialCondition = daocond.MembersThreshold(0.6, members.IsMember, members.MembersCount)
	}

	// register management messages
	for _, m := range []daokit.MessageHandler{
		NewAddMemberHandler(dao),
		NewRemoveMemberHandler(dao),
		NewAssignRoleHandler(dao),
		NewUnassignRoleHandler(dao),
	} {
		dao.Core.SetResource(&daokit.Resource{Handler: m, Condition: conf.InitialCondition})
	}

	dao.Members.setRoles(conf.Roles)
	dao.Members.setMembers(conf.Members)

	if conf.SetProfileString != nil {
		conf.SetProfileString("DisplayName", conf.Name)
		conf.SetProfileString("Bio", conf.Description)
		conf.SetProfileString("Avatar", conf.ImageURI)

		epr := NewEditProfileResource(conf.SetProfileString, []string{"DisplayName", "Bio", "Avatar"}, conf.InitialCondition)
		dao.Core.SetResource(epr)
	}

	return dao
}

func (d *DAO) Vote(proposalID uint64, vote daocond.Vote) {
	if len(vote) > 16 {
		panic("invalid vote")
	}

	voterID := d.assertCallerIsMember()
	d.Core.Vote(voterID, proposalID, vote)
}

func (d *DAO) Execute(proposalID uint64) {
	_ = d.assertCallerIsMember()
	d.Core.Execute(proposalID)
}

func (d *DAO) Propose(req daokit.ProposalRequest) {
	proposerID := d.assertCallerIsMember()
	d.Core.Propose(proposerID, req)
}

func (d *DAO) InstantExecute(req daokit.ProposalRequest) {
	executorID := d.assertCallerIsMember()
	d.Core.InstantExecute(executorID, req)
}

func (d *DAO) assertCallerIsMember() string {
	id := std.PrevRealm().Addr().String()
	if !d.Members.IsMember(id) {
		panic(errors.New("caller is not a member"))
	}
	return id
}

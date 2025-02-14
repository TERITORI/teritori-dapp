package basedao

import (
	"errors"
	"std"

	"gno.land/p/demo/mux"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/daokit"
)

type DAO struct {
	Core             *daokit.Core
	Members          *membersStore
	RenderRouter     *mux.Router
	GetProfileString ProfileStringGetter
	Realm            std.Realm
}

type Config struct {
	Name              string
	Description       string
	ImageURI          string
	Roles             []string
	Members           []Member
	NoDefaultHandlers bool
	InitialCondition  daocond.Condition
	SetProfileString  ProfileStringSetter
	GetProfileString  ProfileStringGetter
}

type ProfileStringSetter func(field string, value string) bool
type ProfileStringGetter func(addr std.Address, field string, def string) string

func New(conf *Config) *DAO {
	members := newMembersStore()
	members.setRoles(conf.Roles)
	members.setMembers(conf.Members)

	if conf.GetProfileString == nil {
		panic(errors.New("GetProfileString is required"))
	}

	dao := &DAO{
		Core:             daokit.NewCore(),
		Members:          members,
		GetProfileString: conf.GetProfileString,
		Realm:            std.CurrentRealm(),
	}
	dao.initRenderingRouter()

	conf.SetProfileString("DisplayName", conf.Name)
	conf.SetProfileString("Bio", conf.Description)
	conf.SetProfileString("Avatar", conf.ImageURI)

	if !conf.NoDefaultHandlers {
		if conf.SetProfileString == nil {
			panic(errors.New("SetProfileString is required"))
		}

		if conf.InitialCondition == nil {
			conf.InitialCondition = daocond.MembersThreshold(0.6, members.IsMember, members.MembersCount)
		}

		dao.Core.SetResource(&daokit.Resource{
			Handler:   NewEditProfileHandler(conf.SetProfileString, []string{"DisplayName", "Bio", "Avatar"}),
			Condition: conf.InitialCondition,
		})

		// register management handlers
		for _, m := range []daokit.MessageHandler{
			NewAddMemberHandler(dao),
			NewRemoveMemberHandler(dao),
			NewAssignRoleHandler(dao),
			NewUnassignRoleHandler(dao),
		} {
			dao.Core.SetResource(&daokit.Resource{Handler: m, Condition: conf.InitialCondition})
		}
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

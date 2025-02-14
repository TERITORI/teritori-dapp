package basedao

import (
	"errors"

	"gno.land/p/demo/ufmt"
	"gno.land/p/moul/md"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/daokit"
)

// XXX: find a way to reduce boilerplate

const MsgEditProfileKind = "gno.land/p/teritori/basedao.EditProfile"

type ProfileStringSetter func(field string, value string) bool

func NewEditProfileResource(setter ProfileStringSetter, allowedFields []string, condition daocond.Condition) *daokit.Resource {
	return &daokit.Resource{
		Handler:   &editProfileHandler{setter: setter, allowedFields: allowedFields},
		Condition: condition,
	}
}

type editProfileHandler struct {
	setter        ProfileStringSetter
	allowedFields []string
}

// Instantiate implements MessageHandler.
func (eph *editProfileHandler) Instantiate(payload map[string]interface{}) daokit.ExecutableMessage {
	return &MsgEditProfile{}
}

// Type implements MessageHandler.
func (eph *editProfileHandler) Type() string {
	return MsgEditProfileKind
}

// XXX: add Render and RenderJSON to handler iface?

var _ daokit.MessageHandler = (*editProfileHandler)(nil)

func (eph *editProfileHandler) Execute(imsg daokit.ExecutableMessage) {
	msg, ok := imsg.(*MsgEditProfile)
	if !ok {
		panic(errors.New("invalid message type"))
	}
	for _, elem := range msg.kv {
		k, v := elem[0], elem[1]
		if !stringSliceContains(eph.allowedFields, k) {
			panic(ufmt.Errorf("unauthorized field %q", k))
		}
		eph.setter(k, v)
	}
}

type FieldDef struct {
	Key   string
	Value string
}

// String implements ExecutableMessage.
func (e *MsgEditProfile) String() string {
	points := make([]string, 0, len(e.kv))
	for _, elem := range e.kv {
		k, v := elem[0], elem[1]
		points = append(points, k+": "+v)
	}
	return md.BulletList(points)
}

func NewEditProfileMessage(kv [][2]string) daokit.ExecutableMessage {
	return &MsgEditProfile{kv: kv}
}

func stringSliceContains(s []string, target string) bool {
	for _, elem := range s {
		if elem == target {
			return true
		}
	}
	return false
}

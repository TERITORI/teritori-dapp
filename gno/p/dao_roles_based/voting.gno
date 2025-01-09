package dao_roles_based

type Vote int

const (
	VoteYes Vote = iota
	VoteNo
	VoteAbstain
)

type Ballot struct {
	proposalID uint64
	vote       Vote
	rationale  string
}

package polls

import (
	"std"

	"gno.land/p/demo/avl"
)

type Poll struct {
	Question string
	Options  []string
	Answers  *avl.Tree // string -> avl.Tree of string -> struct{}
}

type PollResult struct {
	Option string
	Votes  int
}

type PollInfo struct {
	Question string
	Options  []PollResult
}

func NewPoll(id, question string, options []string) *Poll {
	if len(options) < 2 {
		panic("poll must have at least 2 options")
	}
	if len(options) > 8 {
		panic("poll must have at most 8 options")
	}
	poll := &Poll{
		Question: question,
		Options:  options,
		Answers:  avl.NewTree(),
	}
	for _, option := range options {
		if option == "" {
			panic("option cannot be empty")
		}
		if len(option) > 32 {
			panic("option cannot be longer than 32 characters")
		}
		if poll.Answers.Has(option) {
			panic("duplicate option")
		}
		poll.Answers.Set(option, avl.NewTree())
	}
	return poll
}

func (p *Poll) Vote(addr std.Address, option string) {
	optionRaw, ok := p.Answers.Get(option)
	if !ok {
		panic("invalid option")
	}
	votes := optionRaw.(*avl.Tree)
	if votes.Has(addr) {
		votes.Remove(addr)
	} else {
		votes.Set(addr, struct{}{})
	}
}

func (p *Poll) GetInfo() PollInfo {
	options := make([]PollResult, len(p.Options))
	for i, option := range p.Options {
		votesRaw, ok := p.Answers.Get(option)
		if !ok {
			panic("option not found")
		}
		votes := votesRaw.(*avl.Tree)
		options[i] = PollResult{
			Option: option,
			Votes:  votes.Size(),
		}
	}
	return PollInfo{
		Question: p.Question,
		Options:  options,
	}
}

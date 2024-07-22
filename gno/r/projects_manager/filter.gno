package projects_manager

import (
	"std"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/jsonutil"
)

type Filter interface {
	FromJSON(ast *json.Node)
}

func FilterFromJSON(ast *json.Node) Filter {
	if ast.IsNull() {
		return nil
	}
	var filter Filter
	key, member := jsonutil.MustUnion(ast)
	switch key {
	case "byCandidatesForFunder":
		filter = &FilterByCandidatesForFunder{}
	case "byFunder":
		filter = &FilterByFunder{}
	case "byContractor":
		filter = &FilterByContractor{}
	case "byContractorAndFunder":
		filter = &FilterByContractorAndFunder{}
	default:
		panic(ufmt.Sprintf("invalid filter kind `%s`", key))
	}
	filter.FromJSON(member)
	return filter
}

type FilterByCandidatesForFunder struct {
	Funder std.Address
}

func (f *FilterByCandidatesForFunder) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	f.Funder = jsonutil.MustAddress(obj["funder"])
}

var _ Filter = &FilterByCandidatesForFunder{}

type FilterByFunder struct {
	Funder std.Address
}

func (f *FilterByFunder) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	f.Funder = jsonutil.MustAddress(obj["funder"])
}

var _ Filter = &FilterByFunder{}

type FilterByContractor struct {
	Contractor std.Address
}

func (f *FilterByContractor) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	f.Contractor = jsonutil.MustAddress(obj["contractor"])
}

var _ Filter = &FilterByContractor{}

type FilterByContractorAndFunder struct {
	Contractor std.Address
	Funder     std.Address
}

func (f *FilterByContractorAndFunder) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	f.Contractor = jsonutil.MustAddress(obj["contractor"])
	f.Funder = jsonutil.MustAddress(obj["funder"])
}

var _ Filter = &FilterByContractorAndFunder{}

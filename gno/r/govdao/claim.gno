package govdao

import (
	"gno.land/p/demo/mux"
	"gno.land/p/demo/ufmt"
)

const CLAIM_PATH = "claim"

func ClaimTier(handle string) {
	tier := UserTiers[handle]
	if tier == "" {
		panic("user does not have a assigned tier")
	}

	address := getAddressByHandle(handle)
	if address == "" {
		panic("user address is not yet verified")
	}

	if dao.Members.IsMember(address) {
		panic("user already claimed his tier")
	}

	dao.Members.AddMember(address, []string{tier})

	// Remove github handle from claimable tiers
	delete(UserTiers, handle)
}

func renderClaimableTiers(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# GovDao Claimable tiers\n\n")
	res.Write("To claim you tier you first need to link your account github\n")
	for handle, tier := range UserTiers {
		res.Write(ufmt.Sprintf("- **%s**: %s\n", handle, tier))
	}
}

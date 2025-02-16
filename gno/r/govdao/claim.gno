package govdao
import (
	"std"
)

func ClaimTier(handle string){
	tier:=UserTiers[handle]
	if tier == "" {
		panic("user does not have a assigned tier")
	}

	address := getAddressByHandle(handle)
	if address == "" {
		panic("user address is not yet verified")
	}

	if address != std.PrevRealm().Addr().String() {
		panic("caller is should be the claimer")
	}

	if dao.Members.IsMember(address) {
		panic("user already claimed his tier")
	}

	dao.Members.AddMember(address, []string{tier})
	
	// Remove github handle from claimable tiers
	delete(UserTiers, handle)
}

//func RenderClaimableTiers(){
//	res.Write(ufmt.Sprintf("# GovDao Claimable tiers\n\n", name))
//	res.Write(ufmt.Sprintf("To claim you tier you first need to link your account github\n", name))
//	for handle,tier := range UserTiers {
//		res.Write(ufmt.Sprintf("- **%s**: %s\n", i, tier))
//	}
//}
package cockpit

import (
	"std"

	"gno.land/p/demo/mux"
	"gno.land/p/demo/users"
	"gno.land/r/demo/profile"
	rusers "gno.land/r/demo/users"
	"gno.land/r/gnoland/ghverify"
)

const (
	chainId       = "test4"
	pkgName       = "cockpit"
	userSlug      = "u"
	usersRealm    = "r/demo/users"
	ghLinkHint    = "r/gnoland/ghverify?help&__func=RequestVerification"
	ghProfileHint = "/r/demo/profile:u/"
)

func Render(reqPath string) string {
	router := mux.NewRouter()

	router.HandleFunc("", renderHome)
	router.HandleFunc(userSlug+"/{aon}", renderUser)

	return router.Render(reqPath)
}

func renderHome(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# Cockpit\n\n")
	res.Write("See `:" + userSlug + "/{addressOrName}`\n\n")
	res.Write("[Example](./" + pkgName + ":" + userSlug + "/@gno)")
}

func renderUser(res *mux.ResponseWriter, req *mux.Request) {
	addr, username, ok := resolveUserBasics(req.GetVar("aon"))
	if !ok {
		res.Write("404")
		return
	}

	// FIXME: markdown injection, spam
	res.Write("# " + profile.GetStringField(addr, profile.DisplayName, "Anon") + "\n")

	if username != "" {
		res.Write("- Username: [" + username + "](/" + usersRealm + ":" + username + ")\n")
	} else {
		res.Write("- Username: [Not registered](/" + usersRealm + "?help&__func=Register)\n\n")
	}

	res.Write("- Address: [" + addr.String() + "](https://gnoscan.io/accounts/" + addr.String() + "?chainId=" + chainId + ")\n")

	handle := ghverify.GetHandleByAddress(addr.String())
	if handle != "" {
		res.Write("- GitHub: [" + handle + "](https://github.com/" + handle + ")\n\n")
	} else {
		res.Write("- GitHub: [Not linked](/" + ghLinkHint + ")\n\n")
	}

	// FIXME: markdown injection, spam
	res.Write("```\n" + profile.GetStringField(addr, profile.Bio, "") + "\n```\n[Full profile / edit](" + ghProfileHint + addr.String() + ")\n")
}

func resolveUserBasics(aon string) (std.Address, string, bool) {
	user := rusers.GetUserByAddressOrName(users.AddressOrName(aon))
	if user != nil {
		return user.Address, user.Name, true
	}

	addr := std.Address(aon)
	if addr.IsValid() {
		return addr, "", true
	}

	return addr, "", false
}

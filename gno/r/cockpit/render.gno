package cockpit

import (
	"std"

	"gno.land/p/demo/mux"
	"gno.land/p/demo/users"
	"gno.land/r/demo/profile"
	rusers "gno.land/r/demo/users"
	"gno.land/r/gnoland/ghverify"
)

func Render(reqPath string) string {
	router := mux.NewRouter()

	router.HandleFunc("", renderHome)
	router.HandleFunc("u/{aon}", renderUser)

	return router.Render(reqPath)
}

func renderHome(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# Cockpit\n\n")
	res.Write("See `:u/{addressOrName}`\n\n")
	res.Write("[Example](./cockpit:u/@gno)")
}

func renderUser(res *mux.ResponseWriter, req *mux.Request) {
	addr, username, ok := resolveUserBasics(req.GetVar("aon"))
	if !ok {
		res.Write("404")
		return
	}

	res.Write(profile.GetStringField(addr, "DisplayName", "") + "\n\n")

	res.Write(username + "\n\n")

	res.Write(addr.String() + "\n\n")

	handle := ghverify.GetHandleByAddress(addr.String())
	if handle != "" {
		res.Write("GitHub: [" + handle + "](https://github.com/" + handle + ")\n\n")
	}
}

func resolveUserBasics(aon string) (std.Address, string, bool) {
	user := rusers.GetUserByAddressOrName(users.AddressOrName(aon))
	if user != nil {
		return user.Address, "@" + user.Name, true
	}

	addr := std.Address(aon)
	if !addr.IsValid() {
		return addr, "", false
	}

	return addr, "agnome", true
}

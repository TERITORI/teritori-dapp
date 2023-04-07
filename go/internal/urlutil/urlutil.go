package urlutil

import "net/url"

func RedactPassword(u *url.URL) *url.URL {
	if u == nil {
		return u
	}
	ru := *u
	ru.User = url.User(u.User.Username())
	return &ru
}

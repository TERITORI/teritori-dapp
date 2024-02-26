package main

import (
	"net/http"

	"github.com/ory/fosite"
	"go.uber.org/zap"
)

func main() {
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}

	port := "4242"
	secret := []byte("fdiCbwvHP2nXA4yVmN9slkjjAzGWrKa2")
	clients := map[string]*fosite.DefaultClient{
		"teritori-keycloak-dev": {
			ID:            "teritori-keycloak-dev",
			Secret:        []byte("$2y$10$kuFpV.jUHgyws9cxyqzlQ.sK9e0XAKoYEE67moQhIXWM2cyWLL7TS"),
			RedirectURIs:  []string{"http://localhost:8080/realms/master/broker/teritori-idp-dev/endpoint"},
			Scopes:        []string{"openid"},
			ResponseTypes: []string{"code"},
		},
	}

	provider, err := NewProvider(secret, clients, logger.Named("provider"))
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/oauth2/auth", provider.AuthEndpoint)
	http.HandleFunc("/oauth2/token", provider.TokenEndpoint)
	http.HandleFunc("/challenge", provider.ChallengeEndpoint)
	http.HandleFunc(".well-known/openid-configuration", func(w http.ResponseWriter, r *http.Request) {
		panic("not implemented")
	})
	logger.Info("Listening on port " + port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		panic(err)
	}
}

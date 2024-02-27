package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/ory/fosite"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type WellKnownConfig struct {
	AuthorizationEndpoint string `json:"authorization_endpoint"`
	TokenEndpoint         string `json:"token_endpoint"`
}

func main() {
	fs := flag.NewFlagSet("teritori-dapp-backend", flag.ContinueOnError)
	var (
		internalSecretFlag = fs.String("oid-provider-internal-secret", "", "OpenID provider crypto secret")
		clientSecretFlag   = fs.String("oid-provider-client-secret", "", "OpenID provider client secret")
		keycloakRealmFlag  = fs.String("oid-provider-keycloak-realm", "", "Keycloak realm")
		externalHostFlag   = fs.String("oid-provider-external-host", "", "External host")
		keycloakHostFlag   = fs.String("oid-provider-keycloak-host", "", "Keycloak host")
		nameFlag           = fs.String("oid-provider-name", "", "Provider name")
		portFlag           = fs.Uint64("oid-provider-port", 9090, "Port to listen on")
	)
	if err := ff.Parse(fs, os.Args[1:],
		ff.WithEnvVars(),
		ff.WithIgnoreUndefined(true),
		ff.WithConfigFile(".env"),
		ff.WithConfigFileParser(ff.EnvParser),
		ff.WithAllowMissingConfigFile(true),
	); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	internalSecret := *internalSecretFlag
	if internalSecret == "" {
		panic(errors.New("oid-provider-internal-secret is required"))
	}
	clientSecret := *clientSecretFlag
	if clientSecret == "" {
		panic(errors.New("oid-provider-client-secret is required"))
	}
	keycloakRealm := *keycloakRealmFlag
	if keycloakRealm == "" {
		panic(errors.New("oid-provider-keycloak-realm is required"))
	}
	externalHost := *externalHostFlag
	if externalHost == "" {
		panic(errors.New("oid-provider-external-host is required"))
	}
	keycloakHost := *keycloakHostFlag
	if keycloakHost == "" {
		panic(errors.New("oid-provider-keycloak-host is required"))
	}
	providerName := *nameFlag
	if providerName == "" {
		panic(errors.New("oid-provider-name is required"))
	}
	port := *portFlag
	if port == 0 {
		panic(errors.New("oid-provider-port is required"))
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}

	clients := map[string]*fosite.DefaultClient{
		providerName: {
			ID:            providerName,
			Secret:        []byte(clientSecret),
			RedirectURIs:  []string{fmt.Sprintf("%s/realms/%s/broker/oidc/endpoint", keycloakHost, keycloakRealm)},
			Scopes:        []string{"openid"},
			ResponseTypes: []string{"code"},
		},
	}
	provider, err := NewProvider([]byte(internalSecret), clients, logger.Named("provider"))
	if err != nil {
		panic(err)
	}

	http.HandleFunc("/oauth2/auth", provider.AuthEndpoint)
	http.HandleFunc("/oauth2/token", provider.TokenEndpoint)
	http.HandleFunc("/challenge", provider.ChallengeEndpoint)
	http.HandleFunc("/.well-known/openid-configuration", func(w http.ResponseWriter, r *http.Request) {
		bytes, err := json.Marshal(WellKnownConfig{
			AuthorizationEndpoint: externalHost + "/oauth2/auth",
			TokenEndpoint:         externalHost + "/oauth2/token",
		})
		if err != nil {
			logger.Error("failed to marshal well known config", zap.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if _, err := w.Write(bytes); err != nil {
			logger.Error("failed to write well known config", zap.Error(err))
			return
		}
	})

	logger.Info("Listening", zap.Uint64("port", port))
	if err := http.ListenAndServe(fmt.Sprintf(":%d", +port), nil); err != nil {
		panic(err)
	}
}

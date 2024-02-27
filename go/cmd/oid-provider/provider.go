package main

import (
	"crypto/ed25519"
	srand "crypto/rand"
	"crypto/rsa"
	_ "embed"
	"fmt"
	"net/http"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/authcrypto"
	"github.com/ory/fosite"
	"github.com/ory/fosite/compose"
	"github.com/ory/fosite/handler/openid"
	"github.com/ory/fosite/storage"
	"github.com/ory/fosite/token/jwt"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/protobuf/encoding/protojson"
)

type Provider struct {
	oauth2  fosite.OAuth2Provider
	logger  *zap.Logger
	challsk ed25519.PrivateKey
	challpk ed25519.PublicKey
}

//go:embed client.html
var clientHTML []byte

func NewProvider(secret []byte, clients map[string]*fosite.DefaultClient, logger *zap.Logger) (*Provider, error) {
	store := storage.NewExampleStore()

	for k, v := range clients {
		store.Clients[k] = v
	}

	if logger == nil {
		logger = zap.NewNop()
	}

	var config = &fosite.Config{
		AccessTokenLifespan:        time.Minute * 30,
		SendDebugMessagesToClients: true,
		GlobalSecret:               secret,
	}

	privateKey, err := rsa.GenerateKey(srand.Reader, 2048)
	if err != nil {
		panic(err)
	}

	challpk, challsk, err := ed25519.GenerateKey(srand.Reader)
	if err != nil {
		return nil, errors.Wrap(err, "failed to generate key")
	}

	return &Provider{
		oauth2:  compose.ComposeAllEnabled(config, store, privateKey),
		logger:  logger,
		challsk: challsk,
		challpk: challpk,
	}, nil
}

func (p *Provider) AuthEndpoint(rw http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		p.logger.Error("AuthEndpoint: Error occurred in ParseForm", zap.Any("url", req.URL), zap.Error(err))
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	p.logger.Info("AuthEndpoint", zap.Any("url", req.URL), zap.Any("post-form", req.PostForm))

	// This context will be passed to all methods.
	ctx := req.Context()

	// Let's create an AuthorizeRequest object!
	// It will analyze the request and extract important information like scopes, response type and others.
	ar, err := p.oauth2.NewAuthorizeRequest(ctx, req)
	if err != nil {
		trace := errors.StackTrace{}
		if err, ok := err.(stackTracer); ok {
			trace = err.StackTrace()
		}
		p.logger.Error("Error occurred in NewAuthorizeRequest", zap.Error(err), zap.Any("trace", trace))
		p.oauth2.WriteAuthorizeError(ctx, rw, ar, err)
		return
	}
	// You have now access to authorizeRequest, Code ResponseTypes, Scopes ...

	var requestedScopes string
	for _, this := range ar.GetRequestedScopes() {
		requestedScopes += fmt.Sprintf(`<li><input type="checkbox" name="scopes" value="%s">%s</li>`, this, this)
	}

	// Normally, this would be the place where you would check if the user is logged in and gives his consent.
	// We're simplifying things and just checking if the request includes a valid username and password
	req.ParseForm()
	infoJSON := req.PostForm.Get("info")
	signatureBase64 := req.PostForm.Get("signature")
	if infoJSON == "" || signatureBase64 == "" {
		rw.Header().Set("Content-Type", "text/html; charset=utf-8")
		rw.Write(clientHTML)
		return
	}

	token, err := authcrypto.MakeToken(p.challsk, p.challpk, 30*time.Minute, infoJSON, signatureBase64)
	if err != nil {
		rw.WriteHeader(http.StatusUnauthorized)
		rw.Write([]byte(err.Error()))
		return
	}

	// let's see what scopes the user gave consent to
	for _, scope := range req.PostForm["scopes"] {
		ar.GrantScope(scope)
	}

	// Now that the user is authorized, we set up a session:
	mySessionData := newSession(token.UserAddress)

	// When using the HMACSHA strategy you must use something that implements the HMACSessionContainer.
	// It brings you the power of overriding the default values.
	//
	// mySessionData.HMACSession = &strategy.HMACSession{
	//	AccessTokenExpiry: time.Now().Add(time.Day),
	//	AuthorizeCodeExpiry: time.Now().Add(time.Day),
	// }
	//

	// If you're using the JWT strategy, there's currently no distinction between access token and authorize code claims.
	// Therefore, you both access token and authorize code will have the same "exp" claim. If this is something you
	// need let us know on github.
	//
	// mySessionData.JWTClaims.ExpiresAt = time.Now().Add(time.Day)

	// It's also wise to check the requested scopes, e.g.:
	// if ar.GetRequestedScopes().Has("admin") {
	//     http.Error(rw, "you're not allowed to do that", http.StatusForbidden)
	//     return
	// }

	// Now we need to get a response. This is the place where the AuthorizeEndpointHandlers kick in and start processing the request.
	// NewAuthorizeResponse is capable of running multiple response type handlers which in turn enables this library
	// to support open id connect.
	response, err := p.oauth2.NewAuthorizeResponse(ctx, ar, mySessionData)

	// Catch any errors, e.g.:
	// * unknown client
	// * invalid redirect
	// * ...
	if err != nil {
		trace := errors.StackTrace{}
		if err, ok := err.(stackTracer); ok {
			trace = err.StackTrace()
		}
		p.logger.Error("Error occurred in NewAuthorizeResponse", zap.Error(err), zap.Any("trace", trace))
		p.oauth2.WriteAuthorizeError(ctx, rw, ar, err)
		return
	}

	// Last but not least, send the response!
	p.oauth2.WriteAuthorizeResponse(ctx, rw, ar, response)
}

func (p *Provider) TokenEndpoint(rw http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		p.logger.Error("TokenEndpoint: Error occurred in ParseForm", zap.Any("url", req.URL), zap.Error(err))
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	p.logger.Info("TokenEndpoint", zap.Any("url", req.URL), zap.Any("post-form", req.PostForm))

	// This context will be passed to all methods.
	ctx := req.Context()

	// Create an empty session object which will be passed to the request handlers
	mySessionData := newSession("")

	// This will create an access request object and iterate through the registered TokenEndpointHandlers to validate the request.
	accessRequest, err := p.oauth2.NewAccessRequest(ctx, req, mySessionData)

	// Catch any errors, e.g.:
	// * unknown client
	// * invalid redirect
	// * ...
	if err != nil {
		trace := errors.StackTrace{}
		if err, ok := err.(stackTracer); ok {
			trace = err.StackTrace()
		}
		p.logger.Error("Error occurred in NewAccessRequest", zap.Error(err), zap.Any("trace", trace))
		p.oauth2.WriteAccessError(ctx, rw, accessRequest, err)
		return
	}

	// If this is a client_credentials grant, grant all requested scopes
	// NewAccessRequest validated that all requested scopes the client is allowed to perform
	// based on configured scope matching strategy.
	if accessRequest.GetGrantTypes().ExactOne("client_credentials") {
		for _, scope := range accessRequest.GetRequestedScopes() {
			accessRequest.GrantScope(scope)
		}
	}

	// Next we create a response for the access request. Again, we iterate through the TokenEndpointHandlers
	// and aggregate the result in response.
	response, err := p.oauth2.NewAccessResponse(ctx, accessRequest)
	if err != nil {
		p.logger.Error("Error occurred in NewAccessResponse", zap.Error(err))
		p.oauth2.WriteAccessError(ctx, rw, accessRequest, err)
		return
	}

	// All done, send the response.
	p.oauth2.WriteAccessResponse(ctx, rw, accessRequest, response)

	// The client now has a valid access token
}

func (p *Provider) ChallengeEndpoint(rw http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		p.logger.Error("ChallengeEndpoint: Error occurred in ParseForm", zap.Any("url", req.URL), zap.Error(err))
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	p.logger.Info("ChallengeEndpoint", zap.Any("url", req.URL), zap.Any("post-form", req.PostForm))

	challenge, err := authcrypto.MakeChallenge(p.challsk, 3*time.Minute)
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte(err.Error()))
		return
	}
	b, err := protojson.Marshal(challenge)
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte(err.Error()))
		return
	}
	rw.Write(b)
}

type stackTracer interface {
	StackTrace() errors.StackTrace
}

func newSession(userAddress string) *openid.DefaultSession {
	return &openid.DefaultSession{
		Claims: &jwt.IDTokenClaims{
			Issuer:      "https://fosite.my-application.com",
			Subject:     "teritori-idp-cosmos-" + userAddress,
			Audience:    []string{"https://my-client.my-application.com"},
			ExpiresAt:   time.Now().Add(time.Hour * 6),
			IssuedAt:    time.Now(),
			RequestedAt: time.Now(),
			AuthTime:    time.Now(),
			Extra: map[string]interface{}{
				"cosmos-universal-address": userAddress,
			},
		},
	}
}

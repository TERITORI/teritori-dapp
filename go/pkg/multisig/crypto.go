package multisig

import (
	"crypto/ed25519"
	srand "crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/multisigpb"
	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	"github.com/cosmos/cosmos-sdk/types/bech32"
	"github.com/pkg/errors"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

var timeNow = time.Now // we use this to override time.Now in tests while preventing bad usage of the functions in this file

const clientMagic = "Login to Teritori Multisig Service"

func parsePubKeyJSON(pubkeyJSON string) (*secp256k1.PubKey, error) {
	pk := struct {
		Type  string `json:"type"`
		Value []byte `json:"value"`
	}{}
	if err := json.Unmarshal([]byte(pubkeyJSON), &pk); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal pubkey json")
	}
	if pk.Type != "tendermint/PubKeySecp256k1" {
		return nil, errors.New("invalid pubkey type")
	}
	pubkey := secp256k1.PubKey{}
	if err := pubkey.UnmarshalAmino(pk.Value); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal amino pubkey")
	}
	return &pubkey, nil
}

func makeChallenge(privateKey ed25519.PrivateKey, duration time.Duration) (*multisigpb.Challenge, error) {
	nonce, err := makeNonce()
	if err != nil {
		return nil, errors.Wrap(err, "failed to make nonce")
	}
	chall := &multisigpb.Challenge{
		Nonce:      nonce,
		Expiration: encodeTime(timeNow().Add(duration)),
	}
	challBytes, err := proto.Marshal(chall)
	if err != nil {
		return nil, errors.Wrap(err, "failed to marshal challenge")
	}
	chall.ServerSignature = ed25519.Sign(privateKey, challBytes)
	return chall, nil
}

func validateChallenge(publicKey ed25519.PublicKey, challenge *multisigpb.Challenge) error {
	expirationString := challenge.GetExpiration()
	if expirationString == "" {
		return errors.New("no expiration")
	}
	expiration, err := decodeTime(expirationString)
	if err != nil {
		return errors.Wrap(err, "failed to parse expiration")
	}
	if !expiration.After(timeNow()) {
		return errors.New("expired")
	}

	challengeData := proto.Clone(challenge).(*multisigpb.Challenge)
	challengeData.ServerSignature = nil
	challengeDataBytes, err := proto.Marshal(challengeData)
	if err != nil {
		return errors.Wrap(err, "failed to marshal data")
	}

	if !ed25519.Verify(publicKey, challengeDataBytes, challenge.ServerSignature) {
		return errors.New("bad signature")
	}

	return nil
}

func makeADR36SignDoc(data []byte, signerAddress string) []byte {
	const template = `{"account_number":"0","chain_id":"","fee":{"amount":[],"gas":"0"},"memo":"","msgs":[{"type":"sign/MsgSignData","value":{"data":%s,"signer":%s}}],"sequence":"0"}`
	dataJSON, err := json.Marshal(base64.StdEncoding.EncodeToString(data))
	if err != nil {
		panic("failed to marshal json string, something is wrong with the JSON encoder")
	}
	signerJSON, err := json.Marshal(signerAddress)
	if err != nil {
		panic("failed to marshal json string, something is wrong with the JSON encoder")
	}
	return []byte(fmt.Sprintf(template, string(dataJSON), string(signerJSON)))
}

func makeNonce() ([]byte, error) {
	nonce := make([]byte, 32)
	_, err := srand.Read(nonce)
	if err != nil {
		return nil, err
	}
	return nonce, nil
}

func makeToken(privateKey ed25519.PrivateKey, publicKey ed25519.PublicKey, tokenDuration time.Duration, infoJSON string, signatureBase64 string) (*multisigpb.Token, error) {
	infoBytes := []byte(infoJSON)
	var info multisigpb.TokenRequestInfo
	if err := protojson.Unmarshal(infoBytes, &info); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal info")
	}

	if info.Kind != clientMagic {
		return nil, errors.New("warning! you might be victim of a phishing attack, the client magic is invalid")
	}

	prefix := info.UserBech32Prefix
	if prefix == "" {
		return nil, errors.New("missing user bech32 prefix in request")
	}

	err := validateChallenge(publicKey, info.Challenge)
	if err != nil {
		return nil, errors.Wrap(err, "invalid challenge")
	}

	userPublicKey, err := parsePubKeyJSON(info.UserPubkeyJson)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse user pubkey json")
	}
	addressBytes := userPublicKey.Address()

	chainUserAddress, err := bech32.ConvertAndEncode(prefix, addressBytes)
	if err != nil {
		return nil, errors.Wrap(err, "failed to encode bech32 address")
	}

	signature, err := base64.StdEncoding.DecodeString(signatureBase64) // we use std encoding because keplr encode with std
	if err != nil {
		return nil, errors.Wrap(err, "failed to decode signature")
	}
	if !userPublicKey.VerifySignature(makeADR36SignDoc(infoBytes, chainUserAddress), []byte(signature)) {
		return nil, errors.New("invalid user signature")
	}

	crossChainAddress, err := bech32.ConvertAndEncode(universalBech32Prefix, addressBytes)
	if err != nil {
		return nil, errors.Wrap(err, "failed to re-encode user address, this should never happen")
	}

	nonce, err := makeNonce()
	if err != nil {
		return nil, errors.Wrap(err, "failed to make nonce")
	}

	token := &multisigpb.Token{
		Nonce:       encodeBytes(nonce),
		UserAddress: crossChainAddress,
		Expiration:  encodeTime(timeNow().Add(tokenDuration)),
	}
	tokenBytes, err := proto.Marshal(token)
	if err != nil {
		return nil, errors.Wrap(err, "failed to marshal token")
	}

	token.ServerSignature = encodeBytes(ed25519.Sign(privateKey, tokenBytes))

	return token, nil
}

func validateToken(publicKey ed25519.PublicKey, token *multisigpb.Token) error {
	if token == nil {
		return errors.New("missing token")
	}

	expiration, err := decodeTime(token.Expiration)
	if err != nil {
		return errors.Wrap(err, "failed to parse expiration")
	}
	if !expiration.After(timeNow()) {
		return errors.New("expired")
	}

	copy := proto.Clone(token).(*multisigpb.Token)
	copy.ServerSignature = ""
	tokenBytes, err := proto.Marshal(copy)
	if err != nil {
		return errors.Wrap(err, "failed to marshal token")
	}
	signatureBytes, err := decodeBytes(token.ServerSignature)
	if err != nil {
		return errors.Wrap(err, "failed to decode signature")
	}
	if !ed25519.Verify(publicKey, tokenBytes, signatureBytes) {
		return errors.New("invalid signature")
	}

	return nil
}

package multisig

import (
	"crypto/ed25519"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	"github.com/cosmos/cosmos-sdk/types/bech32"
	"github.com/pkg/errors"
)

func parsePubKeyJSON(pubkeyJSON string, bech32Prefix string) (string, *secp256k1.PubKey, error) {
	pk := struct {
		Type  string `json:"type"`
		Value []byte `json:"value"`
	}{}
	if err := json.Unmarshal([]byte(pubkeyJSON), &pk); err != nil {
		return "", nil, errors.Wrap(err, "failed to unmarshal pubkey json")
	}
	if pk.Type != "tendermint/PubKeySecp256k1" {
		return "", nil, errors.New("invalid pubkey type")
	}
	pubkey := secp256k1.PubKey{}
	if err := pubkey.UnmarshalAmino(pk.Value); err != nil {
		return "", nil, errors.Wrap(err, "failed to unmarshal cosmos pubkey")
	}
	userAddress, err := bech32.ConvertAndEncode(bech32Prefix, pubkey.Address())
	if err != nil {
		return "", nil, errors.Wrap(err, "failed to encode bech32 address")
	}
	return userAddress, &pubkey, nil
}

// FIXME: better challenge encoding
func validateChallenge(publicKey ed25519.PublicKey, challenge string) (string, error) {
	parts := strings.Split(challenge, " ")
	if len(parts) != 2 {
		return "", errors.New("not enough parts")
	}
	nonceBase64 := parts[0]
	if nonceBase64 == "" {
		return "", errors.New("missing nonce")
	}
	signatureBase64 := parts[1]
	if signatureBase64 == "" {
		return "", errors.New("missing signature")
	}

	nonce, err := base64.RawURLEncoding.DecodeString(nonceBase64)
	if err != nil {
		return "", errors.Wrap(err, "failed to decode nonce")
	}
	signature, err := base64.RawURLEncoding.DecodeString(signatureBase64)
	if err != nil {
		return "", errors.Wrap(err, "failed to decode signature")
	}
	if !ed25519.Verify(publicKey, nonce, signature) {
		return "", errors.New("bad signature")
	}

	return nonceBase64, nil
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

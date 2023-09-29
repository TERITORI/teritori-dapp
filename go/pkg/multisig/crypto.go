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
	"github.com/pkg/errors"
	"google.golang.org/protobuf/proto"
)

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
		Expiration: formatTime(time.Now().Add(duration)),
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
	expiration, err := parseTime(expirationString)
	if err != nil {
		return errors.Wrap(err, "failed to parse expiration")
	}
	if !expiration.After(time.Now()) {
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

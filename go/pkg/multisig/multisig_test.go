package multisig

import (
	"crypto/ed25519"
	srand "crypto/rand"
	"encoding/base64"
	"testing"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/multisigpb"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/proto"
)

func TestADR36(t *testing.T) {
	const expectedAddress = "tori14grryrkwtf0ugtlthrnr59ktztc9mnfch5x2dg"
	const pubkeyJSON = `
    {
      "type": "tendermint/PubKeySecp256k1",
      "value": "AyOLVICt52x+KsiWar9VT1cDagPG9hNhQEO42dsrASBI"
    }
  `
	pubkey, err := parsePubKeyJSON(pubkeyJSON)
	require.NoError(t, err)

	signature, err := base64.StdEncoding.DecodeString("uVYwxPE934lkNlljqtTqhLhXIQaEZfgl7ZGYoER0dj5l6BPoWt23Ep8KGEMT8/d9AjXjrv3k3ZgdqHRq2wkxjw==")
	require.NoError(t, err)
	require.Equal(t, 64, len(signature))

	result := pubkey.VerifySignature(makeADR36SignDoc([]byte("ThisIsATest"), expectedAddress), signature)
	require.True(t, result)
}

func TestChallenge(t *testing.T) {
	publicKey, privateKey, err := ed25519.GenerateKey(srand.Reader)
	require.NoError(t, err)

	chall, err := makeChallenge(privateKey, time.Hour)
	require.NoError(t, err)

	copy := proto.Clone(chall).(*multisigpb.Challenge)

	err = validateChallenge(publicKey, chall)
	require.NoError(t, err)

	require.True(t, proto.Equal(chall, copy))
}

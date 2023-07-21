package multisig

import (
	"encoding/base64"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestADR36(t *testing.T) {
	const expectedAddress = "tori14grryrkwtf0ugtlthrnr59ktztc9mnfch5x2dg"
	const pubkeyJSON = `
    {
      "type": "tendermint/PubKeySecp256k1",
      "value": "AyOLVICt52x+KsiWar9VT1cDagPG9hNhQEO42dsrASBI"
    }
  `
	address, pubkey, err := parsePubKeyJSON(pubkeyJSON, "tori")
	require.NoError(t, err)
	require.Equal(t, "tori14grryrkwtf0ugtlthrnr59ktztc9mnfch5x2dg", address)

	signature, err := base64.StdEncoding.DecodeString("uVYwxPE934lkNlljqtTqhLhXIQaEZfgl7ZGYoER0dj5l6BPoWt23Ep8KGEMT8/d9AjXjrv3k3ZgdqHRq2wkxjw==")
	require.NoError(t, err)
	require.Equal(t, 64, len(signature))

	result := pubkey.VerifySignature(makeADR36SignDoc([]byte("ThisIsATest"), expectedAddress), signature)
	require.True(t, result)
}

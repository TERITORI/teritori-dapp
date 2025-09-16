package multisig

import (
	"crypto/ed25519"
	srand "crypto/rand"
	"encoding/base64"
	"testing"
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/multisigpb"
	"github.com/gnolang/gno/tm2/pkg/amino"
	"github.com/gnolang/gno/tm2/pkg/crypto"
	"github.com/gnolang/gno/tm2/pkg/crypto/multisig"
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

	{
		copy := proto.Clone(chall).(*multisigpb.Challenge)
		err = validateChallenge(publicKey, chall)
		require.NoError(t, err)
		require.True(t, proto.Equal(chall, copy))
	}

	{
		copy := proto.Clone(chall).(*multisigpb.Challenge)
		copy.Expiration = "bad time"
		err = validateChallenge(publicKey, copy)
		require.ErrorContains(t, err, "failed to parse expiration")
	}

	{
		copy := proto.Clone(chall).(*multisigpb.Challenge)
		expiration, err := decodeTime(chall.Expiration)
		require.NoError(t, err)
		copy.Expiration = encodeTime(expiration.Add(-(24 * time.Hour)))
		err = validateChallenge(publicKey, copy)
		require.ErrorContains(t, err, "expired")
	}

	{
		copy := proto.Clone(chall).(*multisigpb.Challenge)
		expiration, err := decodeTime(chall.Expiration)
		require.NoError(t, err)
		copy.Expiration = encodeTime(expiration.Add(24 * time.Hour))
		err = validateChallenge(publicKey, copy)
		require.ErrorContains(t, err, "bad signature")
	}

	{
		copy := proto.Clone(chall).(*multisigpb.Challenge)
		nonce, err := makeNonce()
		require.NoError(t, err)
		copy.Nonce = nonce
		err = validateChallenge(publicKey, copy)
		require.ErrorContains(t, err, "bad signature")
	}

	{
		copy := proto.Clone(chall).(*multisigpb.Challenge)
		other, err := makeChallenge(privateKey, time.Hour)
		require.NoError(t, err)
		copy.ServerSignature = other.ServerSignature
		err = validateChallenge(publicKey, copy)
		require.ErrorContains(t, err, "bad signature")
	}
}

func TestToken(t *testing.T) {
	seedBytes, err := decodeBytes("WAldTfoewRhbXd3xsNcbH4Yax5npqli7ksb-kE_qdFk")
	require.NoError(t, err)
	privateKey := ed25519.NewKeyFromSeed(seedBytes)
	publicKey := privateKey.Public().(ed25519.PublicKey)

	nowStr := "2021-01-01T00:00:00Z"
	timeNow = func() time.Time {
		tm, err := decodeTime(nowStr)
		require.NoError(t, err)
		return tm
	}

	const infoJSON = `{"kind":"Login to Teritori Multisig Service","challenge":{"nonce":"ZPx/cqjiz4ApUsRTdae3QYvq1dIyi7Iqw3x/plWAvdg=","expiration":"2023-09-29T18:02:13+02:00","serverSignature":"aRjRJXRcL8ncf6GAejgfEuG9SxH6pWsc5NNd1iwId1Bh5AaYAtPDTyXOV973R96fapsyJfBHxMv62Jjbs/ywDw=="},"userBech32Prefix":"tori","userPubkeyJson":"{\"type\":\"tendermint/PubKeySecp256k1\",\"value\":\"AyOLVICt52x+KsiWar9VT1cDagPG9hNhQEO42dsrASBI\"}"}`

	token, err := makeToken(privateKey, publicKey, time.Hour, infoJSON, "2n+PG/4cBnjnm8+BDxhse83Qe4PVy43iY3DiLm3EjGYCpv3Y5nlfVIy3FqedXMUFgYL8xs1F1XDzmGSrG6bInA==")
	require.NoError(t, err)

	require.Equal(t, "user14grryrkwtf0ugtlthrnr59ktztc9mnfcjv0fh4", token.UserAddress)
	require.Equal(t, encodeTime(timeNow().Add(time.Hour)), token.Expiration)

	err = validateToken(publicKey, token)
	require.NoError(t, err)

	{
		_, err := makeToken(privateKey, publicKey, time.Hour, infoJSON, "e5B/L7o/5uZH3LB/XsikThqpLczut0sXf4K6TPgyGmJRwY5d05OhXz8flxX08HaejLCe3tzgbmRaoHMwVYav7A==")
		require.ErrorContains(t, err, "invalid user signature")
	}

	{
		const infoJSON = `{"kind":"Login to a Very Nice Place","challenge":{"nonce":"JQMKouZI3ohyzyzSr6tXB9MBLf92csI7bqdTxq8MQYA=","expiration":"2023-09-29T18:16:28+02:00","serverSignature":"OmvQJ14ocuZ/8itVKgXtoxphdjOZbSkAVE2ZGY9xqMvRJrAy5LolG9ngfq1mG356QMpBs2ereNi3D7zK2+hNCw=="},"userBech32Prefix":"tori","userPubkeyJson":"{\"type\":\"tendermint/PubKeySecp256k1\",\"value\":\"AyOLVICt52x+KsiWar9VT1cDagPG9hNhQEO42dsrASBI\"}"}`
		_, err := makeToken(privateKey, publicKey, time.Hour, infoJSON, "bCZAy+j17Tfxu3vFp8pa7juX612Nnxuhf8ja8bYyiGNApixiOowL82V2mcBFUPMPBOcmwbf82yyWvkNApIj+xA==")
		require.ErrorContains(t, err, "warning! you might be victim of a phishing attack, the client magic is invalid")
	}

	nowStr = "2024-01-01T00:00:00Z"

	_, err = makeToken(privateKey, publicKey, time.Hour, infoJSON, "2n+PG/4cBnjnm8+BDxhse83Qe4PVy43iY3DiLm3EjGYCpv3Y5nlfVIy3FqedXMUFgYL8xs1F1XDzmGSrG6bInA==")
	require.ErrorContains(t, err, "invalid challenge: expired")

	err = validateToken(publicKey, token)
	require.ErrorContains(t, err, "expired")
}

func TestMarshalGnoPubkey(t *testing.T) {
	// sanity test
	pksStrs := []string{
		"gpub1pgfj7ard9eg82cjtv4u4xetrwqer2dntxyfzxz3pqg9pgsxmp93u54zk5pd6wmnyt7g6v52vxyctav9hwqm8u02cndl3586qeu6",
		"gpub1pgfj7ard9eg82cjtv4u4xetrwqer2dntxyfzxz3pq0wmasqx932pdhlkzx7vn40qay2jxscv5n38ypyfalrsyr4acxq4u0t9u65",
	}
	pks := []crypto.PubKey{}
	for _, pkStr := range pksStrs {
		pk, err := crypto.PubKeyFromBech32(pkStr)
		require.NoError(t, err)
		pks = append(pks, pk)
	}
	mspk := multisig.NewPubKeyMultisigThreshold(1, pks)
	bz, err := amino.MarshalJSONAny(mspk)
	require.NoError(t, err)

	require.Equal(t, "{\"@type\":\"/tm.PubKeyMultisig\",\"threshold\":\"1\",\"pubkeys\":[{\"@type\":\"/tm.PubKeySecp256k1\",\"value\":\"AgoUQNsJY8pUVqBbp25kX5GmUUwxML6wt3A2fj1Ym38a\"},{\"@type\":\"/tm.PubKeySecp256k1\",\"value\":\"A92+wAYsVBbf9hG8ydXg6RUjQwyk4nIEie/HAg69wYFe\"}]}", string(bz))

	var pk crypto.PubKey
	err = amino.UnmarshalJSON(bz, &pk)
	require.NoError(t, err)
	switch tpk := pk.(type) {
	case multisig.PubKeyMultisigThreshold:
		require.Equal(t, uint(1), tpk.K)
		require.Equal(t, pks, tpk.PubKeys)
	default:
		t.Fatalf("invalid pk type after unmarshal: %T", tpk)
	}
}

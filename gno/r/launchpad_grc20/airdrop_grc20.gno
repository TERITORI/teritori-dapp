package launchpad_grc20

import (
	"encoding/hex"
	"std"
	"strconv"
	"time"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/demo/merkle"
	"gno.land/p/demo/seqid"
	"gno.land/p/teritori/jsonutil"
)

type Airdrop struct {
	token          *Token
	merkleRoot     string
	startTimestamp int64
	endTimestamp   int64
	amountPerAddr  uint64
	alreadyClaimed *avl.Tree
}

var (
	airdrops      *avl.Tree // airdrop ID -> airdrop
	nextAirdropID seqid.ID
)

func init() {
	airdrops = avl.NewTree()
	nextAirdropID = seqid.ID(0)
}

func NewAirdrop(tokenName, merkleRoot string, amountPerAddr uint64, startTimestamp, endTimestamp int64) uint64 {
	token := mustGetToken(tokenName)
	token.admin.AssertCallerIsOwner()

	if !token.allowMint {
		panic("token is not mintable")
	}

	now := time.Now().Unix()
	if startTimestamp != 0 && startTimestamp < now {
		panic("invalid start timestamp, must be in the future or be equal to 0 to start immediately")
	}

	if endTimestamp != 0 && endTimestamp < now {
		panic("invalid end timestamp, must be in the future or be equal to 0 to never end")
	}

	if endTimestamp != 0 && startTimestamp >= endTimestamp {
		panic("invalid timestamps, start must be before end")
	}

	airdrop := Airdrop{
		token:          token,
		merkleRoot:     merkleRoot,
		startTimestamp: startTimestamp,
		endTimestamp:   endTimestamp,
		amountPerAddr:  amountPerAddr,
		alreadyClaimed: avl.NewTree(),
	}

	airdropID := nextAirdropID.Next()
	token.AirdropsIDs = append(token.AirdropsIDs, airdropID)

	airdrops.Set(airdropID.String(), &airdrop)

	return uint64(airdropID)
}

func ClaimJSON(airdropID uint64, proofsJSON string) {
	nodes, err := json.Unmarshal([]byte(proofsJSON))
	if err != nil {
		panic("invalid json proofs")
	}
	vals := nodes.MustArray()
	proofs := make([]merkle.Node, 0, len(vals))
	for _, val := range vals {
		obj := val.MustObject()
		data, err := hex.DecodeString(obj["hash"].MustString())
		if err != nil {
			panic("invalid hex encoded hash")
		}
		node := merkle.NewNode(data, jsonutil.MustUint8(obj["pos"]))
		proofs = append(proofs, node)
	}
	Claim(airdropID, proofs)
}

func Claim(airdropID uint64, proofs []merkle.Node) {
	airdrop := mustGetAirdrop(airdropID)
	caller := std.PrevRealm().Addr()

	if !airdrop.isOnGoing() {
		panic("airdrop is not ongoing, look at the airdrop period")
	}

	if airdrop.hasAlreadyClaimed(caller) {
		panic("already claimed")
	}

	leaf := Leaf{[]byte(caller.String())}
	if !merkle.Verify(airdrop.merkleRoot, leaf, proofs) {
		panic("invalid proof")
	}

	airdrop.token.banker.Mint(caller, airdrop.amountPerAddr)

	airdrop.alreadyClaimed.Set(caller.String(), true)
}

func (a *Airdrop) hasAlreadyClaimed(caller std.Address) bool {
	return a.alreadyClaimed.Has(caller.String())
}

func (a *Airdrop) isOnGoing() bool {
	now := time.Now().Unix()
	return (a.startTimestamp == 0 || a.startTimestamp <= now) &&
		(a.endTimestamp == 0 || now < a.endTimestamp)
}

func (a *Airdrop) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"tokenName":      json.StringNode("", a.token.banker.GetName()),
		"tokenSymbol":    json.StringNode("", a.token.banker.GetSymbol()),
		"amountPerAddr":  json.StringNode("", strconv.FormatUint(a.amountPerAddr, 10)),
		"startTimestamp": json.StringNode("", strconv.FormatInt(a.startTimestamp, 10)),
		"endTimestamp":   json.StringNode("", strconv.FormatInt(a.endTimestamp, 10)),
	})
}

func mustGetAirdrop(airdropID uint64) *Airdrop {
	id := seqid.ID(airdropID)
	airdropRaw, exists := airdrops.Get(id.String())
	if !exists {
		panic("airdrop not found")
	}

	return airdropRaw.(*Airdrop)
}

func GetLastAirdropsJSON() string {
	nodes := make([]*json.Node, 0, 10)
	for i := int(nextAirdropID); i > int(nextAirdropID)-10; i-- {
		airdropRaw, exists := airdrops.Get(seqid.ID(i).String())
		if !exists {
			continue
		}

		airdrop := airdropRaw.(*Airdrop)
		nodes = append([]*json.Node{airdrop.ToJSON()}, nodes...)
	}
	return json.ArrayNode("", nodes).String()
}

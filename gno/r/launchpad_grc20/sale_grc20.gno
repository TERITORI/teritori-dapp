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
	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/jsonutil"
)

type Sale struct {
	token          *Token
	id             seqid.ID
	startTimestamp int64
	endTimestamp   int64
	pricePerToken  uint64
	alreadySold    uint64
	limitPerAddr   uint64
	minGoal        uint64
	maxGoal        uint64
	owner          std.Address
	buyers         *avl.Tree // address -> amount
	finalized      bool
	merkleRoot     string
}

var (
	sales      *avl.Tree // sale ID -> sale
	nextSaleID seqid.ID
)

func init() {
	sales = avl.NewTree()
	nextSaleID = seqid.ID(0)
}

func NewSale(tokenName, merkleRoot string, startTimestamp, endTimestamp int64, pricePerToken, limitPerAddr, minGoal, maxGoal uint64, mintToken bool) uint64 {
	token := mustGetToken(tokenName)
	token.admin.AssertCallerIsOwner()

	if mintToken && !token.allowMint {
		panic("token is not mintable")
	}

	owner := std.PrevRealm().Addr()

	// Subtract 10 seconds to make it easier to create a sale that starts immediately (for testing purposes)
	now := time.Now().Unix()
	if startTimestamp < now-10 {
		panic("start timestamp must be in the future")
	}

	if startTimestamp >= endTimestamp {
		panic("invalid timestamps, start must be before end")
	}

	if minGoal > maxGoal {
		panic("min goal must be less than max goal")
	}

	if pricePerToken == 0 {
		panic("price per token must be greater than 0")
	}

	if limitPerAddr == 0 {
		panic("limit per address must be greater than 0")
	}

	realmAddr := std.CurrentRealm().Addr()
	if mintToken {
		token.banker.Mint(realmAddr, maxGoal)
	} else {
		err := token.banker.Transfer(owner, realmAddr, maxGoal)
		if err != nil {
			panic("error while transferring tokens to the realm, " + err.Error())
		}
	}

	saleID := nextSaleID.Next()

	sale := Sale{
		token:          token,
		id:             saleID,
		startTimestamp: startTimestamp,
		endTimestamp:   endTimestamp,
		pricePerToken:  pricePerToken,
		limitPerAddr:   limitPerAddr,
		minGoal:        minGoal,
		maxGoal:        maxGoal,
		owner:          owner,
		buyers:         avl.NewTree(),
		finalized:      false,
		merkleRoot:     merkleRoot,
	}

	token.SalesIDs = append(token.SalesIDs, saleID)

	sales.Set(saleID.String(), &sale)

	return uint64(saleID)
}

func BuyJSON(saleID, amount uint64, proofsJSON string) {
	if proofsJSON != "" {
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
		Buy(saleID, amount, proofs)
		return
	}
	Buy(saleID, amount, nil)
}

func Buy(saleID, amount uint64, proofs []merkle.Node) {
	buyer := std.GetOrigCaller()
	sale := mustGetSale(saleID)
	sale.buy(buyer, amount, proofs)
}

func Finalize(saleID uint64) {
	sale := mustGetSale(saleID)
	realmAddr := std.CurrentRealm().Addr()
	banker := std.GetBanker(std.BankerTypeRealmSend)

	if sale.isOnGoing() {
		panic("sale is still ongoing, wait for the end")
	}

	if sale.finalized {
		panic("sale already finalized")
	}

	// If the min goal is not reached, refund all the buyers and send the tokens back to the owner
	if sale.alreadySold < sale.minGoal {
		sale.refundAllBuyers()
		err := sale.token.banker.Transfer(realmAddr, sale.owner, sale.alreadySold)
		if err != nil {
			panic("error while transferring back tokens to the owner, " + err.Error())
		}
	} else {
		sale.payAllBuyers()
		totalCoins := std.NewCoins(std.NewCoin("ugnot", int64(sale.alreadySold*sale.pricePerToken)))
		banker.SendCoins(realmAddr, sale.owner, totalCoins)
	}

	sale.finalized = true
}

func (s *Sale) isOnGoing() bool {
	return s.startTimestamp <= time.Now().Unix() && (s.endTimestamp == 0 || time.Now().Unix() < s.endTimestamp)
}

func (s *Sale) BalanceOf(addr std.Address) uint64 {
	balance, exists := s.buyers.Get(addr.String())
	if !exists {
		return 0
	}
	return balance.(uint64)
}

func (s *Sale) buy(buyer std.Address, amount uint64, proofs []merkle.Node) {
	sentCoins := std.GetOrigSend()

	if s.merkleRoot != "" {
		if len(proofs) == 0 {
			panic("This sale is private, please provide merkle proofs")
		}

		leaf := Leaf{[]byte(buyer.String())}
		if !merkle.Verify(s.merkleRoot, leaf, proofs) {
			panic("This sale is private, invalid merkle proofs")
		}
	}

	if len(sentCoins) == 0 {
		panic("Please send amount * price per token gnot coins, price per token is " + ufmt.Sprintf("%d", s.pricePerToken) + " $GNOT")
	}

	if len(sentCoins) != 1 {
		panic("Please send only one type of coin, should be GNOT coins")
	}

	sentCoin := sentCoins[0]

	banker := std.GetBanker(std.BankerTypeOrigSend)
	realmAddr := std.CurrentRealm().Addr()

	total := amount
	alreadyBought, exists := s.buyers.Get(buyer.String())
	if exists {
		total += alreadyBought.(uint64)
	}

	if !s.isOnGoing() {
		panic("sale is not ongoing")
	}

	if amount == 0 {
		panic("amount must be greater than 0")
	}

	if total > s.limitPerAddr {
		panic("amount exceeds limit per address")
	}

	if s.alreadySold+amount > s.maxGoal {
		panic("amount exceeds max goal of the sale")
	}

	minCoins := std.NewCoin("ugnot", int64(amount*s.pricePerToken))
	if !sentCoin.IsGTE(minCoins) {
		panic("Please send enough coins, price per token is " + ufmt.Sprintf("%d", s.pricePerToken) + " $GNOT")
	}

	change := sentCoin.Sub(minCoins)
	if change.IsPositive() {
		banker.SendCoins(realmAddr, buyer, std.NewCoins(change))
	}

	s.buyers.Set(buyer.String(), total)
	s.alreadySold += amount
}

func (s *Sale) refundAllBuyers() {
	banker := std.GetBanker(std.BankerTypeRealmSend)
	realmAddr := std.CurrentRealm().Addr()

	s.buyers.Iterate("", "", func(key string, value interface{}) bool {
		buyer := std.Address(key)
		amount := value.(uint64)
		refundCoins := std.NewCoins(std.NewCoin("ugnot", int64(amount*s.pricePerToken)))
		banker.SendCoins(realmAddr, buyer, refundCoins)
		return false
	})
}

func (s *Sale) payAllBuyers() {
	realmAddr := std.CurrentRealm().Addr()

	s.buyers.Iterate("", "", func(key string, value interface{}) bool {
		buyer := std.Address(key)
		amount := value.(uint64)
		err := s.token.banker.Transfer(realmAddr, buyer, amount)
		if err != nil {
			panic("error while transferring tokens to the buyer, " + err.Error())
		}
		return false
	})
}

func (s *Sale) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"id":             json.StringNode("", ufmt.Sprintf("%d", uint64(s.id))),
		"tokenName":      json.StringNode("", s.token.GetName()),
		"pricePerToken":  json.StringNode("", strconv.FormatUint(s.pricePerToken, 10)),
		"limitPerAddr":   json.StringNode("", strconv.FormatUint(s.limitPerAddr, 10)),
		"minGoal":        json.StringNode("", strconv.FormatUint(s.minGoal, 10)),
		"maxGoal":        json.StringNode("", strconv.FormatUint(s.maxGoal, 10)),
		"startTimestamp": json.StringNode("", strconv.FormatInt(s.startTimestamp, 10)),
		"endTimestamp":   json.StringNode("", strconv.FormatInt(s.endTimestamp, 10)),
	})
}

func mustGetSale(saleID uint64) *Sale {
	id := seqid.ID(saleID)
	sale, exists := sales.Get(id.String())
	if !exists {
		panic("sale not found")
	}
	return sale.(*Sale)
}

func GetLastSalesJSON() string {
	nodes := make([]*json.Node, 0, 10)
	for i := int(nextSaleID); i > int(nextSaleID)-10; i-- {
		saleRaw, exists := sales.Get(seqid.ID(i).String())
		if !exists {
			continue
		}

		sale := saleRaw.(*Sale)
		nodes = append(nodes, sale.ToJSON())
	}
	return json.ArrayNode("", nodes).String()
}

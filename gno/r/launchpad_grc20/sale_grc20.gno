package launchpad_grc20

import (
	"std"
	"time"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ufmt"
)

type Sale struct {
	token          *Token
	startTimestamp int64
	endTimestamp   int64
	pricePerToken  uint64
	alreadySold    uint64
	limitPerAddr   uint64
	minGoal        uint64
	maxGoal        uint64
	owner std.Address
	buyers avl*Tree // address -> amount
	finalized bool
}

var (
	sales      *avl.Tree // sale ID -> sale
	nextSaleID uint64
)

func init() {
	sales = avl.NewTree()
	nextSaleID = 1
}

func NewSale(tokenName string, startTimestamp, endTimestamp int64, pricePerToken, limitPerAddr, minGoal, maxGoal uint64, mintToken bool) uint64 {
	// check if the caller is the owner of the token
	token := mustGetToken(tokenName)
	token.admin.AssertCallerIsOwner()

	// check that the token is mintable
	if mintToken && !token.allowMint {
		panic("token is not mintable")
	}

	owner := std.PrevRealm().Addr()

	now := time.Now().Unix()
	if startTimestamp < now {
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

	// Mint or transfer the max goal to the realm to be sure that the sale can distribute the tokens
	realmAddr := std.CurrentRealm().Addr()
	if mintToken {
		token.banker.Mint(realmAddr, maxGoal)
	} else {
		token.banker.TransferFrom(owner, realmAddr, maxGoal)
	}

	sale := Sale{
		token:          token,
		startTimestamp: startTimestamp,
		endTimestamp:   endTimestamp,
		pricePerToken:  pricePerToken,
		limitPerAddr:   limitPerAddr,
		minGoal:        minGoal,
		maxGoal:        maxGoal,
		owner: owner,
		finalized: bool,
	}

	saleID := nextSaleID
	nextSaleID++

	sales.Set(ufmt.Sprintf("%d", saleID), &sale)

	return saleID
}

func Buy(saleID, amount uint64) {
	buyer := std.GetOrigCaller()
	sale := mustGetSale(saleID)
	sale.buy(buyer, amount)
}

// Finalize the sale, send the funds to the token owner if the min goal is reached and mint the tokens
func Finalize(saleID uint64) {
	sale := mustGetSale(saleID)
	realmAddr := std.CurrentRealm().Addr()
	banker := std.GetBanker(std.BankerTypeRealmSend)

	if sale.finalized {
		panic("sale already finalized")
	}

	if !sale.isOnGoing() {
		panic("sale is not ongoing")
	}

	// If the min goal is not reached, refund all the buyers and send the tokens back to the owner
	if sale.alreadySold < sale.minGoal {
		sale.refundAllBuyers()
		sale.token.banker.TransferFrom(realmAddr, sale.owner, sale.alreadySold)
	} else {
		transferAllBuyers()
		banker.SendCoins(realmAddr, sale.owner, std.NewCoin("ugnot", sale.alreadySold*sale.pricePerToken))
	}

	sale.finalized = true

}

func mustGetSale(saleID uint64) *Sale {
	sale, exists := sales.Get(ufmt.Sprintf("%d", saleID))
	if !exists {
		panic("sale not found")
	}
	return sale.(*Sale)
}

func (s *Sale) isOnGoing() bool {
	return s.startTimestamp <= time.Now().Unix() && (s.endTimestamp == 0 || time.Now().Unix() < s.endTimestamp)
}

func (s *Sale) buy(buyer std.Address, amount uint64) {
	sentCoins := std.GetOrigSend()[0]
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

	if len(sentCoins) != 1 {
		panic("Please send coins to buy tokens, price per token is " + ufmt.Sprintf("%d", s.pricePerToken) + " $GNOT") 
	}

	if s.alreadySold+amount > s.maxGoal {
		panic("amount exceeds max goal of the sale")
	}

	sentCoin := sentCoins[0]
	minCoins := std.NewCoin("ugnot", amount*s.pricePerToken)
	if !sentCoin.IsGTE(minCoins) {
		panic("Please send enough coins, price per token is " + ufmt.Sprintf("%d", s.pricePerToken) + " $GNOT") 
	}

	change := sentCoin.Sub(minCoins)
	if change.IsPositive() {
		banker.SendCoins(realmAddr, buyer, change)
	}

	// Set the new amount of tokens bought by the buyer, it will be send or refunded in the finalize function
	s.buyers.Set(buyer.String(), total)
	s.alreadySold += amount
}

func (s *Sale) refundAllBuyers() {
	banker := std.GetBanker(std.BankerTypeRealmSend)
	realmAddr := std.CurrentRealm().Addr()
	
	s.buyers.Iterate("", "", func(key, value interface{}) bool {
		buyer := std.Address(key)
		amount := value.(uint64)
		banker.SendCoins(realmAddr, buyer, std.NewCoin("ugnot", amount*s.pricePerToken))
		return false
	})
}

func (s *Sale) transferAllBuyers() {
	banker := std.GetBanker(std.BankerTypeRealmSend)
	realmAddr := std.CurrentRealm().Addr()
	
	s.buyers.Iterate("", "", func(key, value interface{}) bool {
		buyer := std.Address(key)
		amount := value.(uint64)
		s.token.banker.TransferFrom(realmAddr, buyer, amount)
		return false
	})
}
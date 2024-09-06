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

	vault std.Address
}

var (
	sales      *avl.Tree // sale ID -> sale
	nextSaleID uint64
)

func init() {
	sales = avl.NewTree()
	nextSaleID = 1
}

func NewSale(tokenName string, startTimestamp, endTimestamp int64, pricePerToken, limitPerAddr, minGoal, maxGoal uint64) uint64 {
	// check if the caller is the owner of the token
	token := mustGetToken(tokenName)
	token.admin.AssertCallerIsOwner()

	// check that the token is mintable
	if !token.allowMint {
		panic("token is not mintable")
	}

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

	sale := Sale{
		token:          token,
		startTimestamp: startTimestamp,
		endTimestamp:   endTimestamp,
		pricePerToken:  pricePerToken,
		limitPerAddr:   limitPerAddr,
		minGoal:        minGoal,
		maxGoal:        maxGoal,
	}

	saleID := nextSaleID
	nextSaleID++

	sales.Set(ufmt.Sprintf("%d", saleID), &sale)

	return saleID
}

func Buy(saleID, amount uint64) {
	buyer := std.PrevRealm().Addr()
	sale := mustGetSale(saleID)
	if !sale.isOnGoing() {
		panic("sale is not ongoing")
	}

	if amount == 0 {
		panic("amount must be greater than 0")
	}

	// TODO: HAVE TO CHECK WHAT THE BUYER ALREADY BOUGHT IN THE SALE
	if amount > sale.limitPerAddr {
		panic("amount exceeds limit per address")
	}

	if sale.alreadySold+amount > sale.maxGoal {
		panic("amount exceeds max goal of the sale")
	}

	if sale.token.Token().BalanceOf(buyer) < amount*sale.pricePerToken {
		panic("insufficient balance")
	}

	sale.buy(buyer, amount)
}

func Finalize() {
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
	if !s.isOnGoing() {
		panic("sale is not ongoing")
	}

	if amount == 0 {
		panic("amount must be greater than 0")
	}

	// TODO: HAVE TO CHECK WHAT THE BUYER ALREADY BOUGHT IN THE SALE
	if amount > s.limitPerAddr {
		panic("amount exceeds limit per address")
	}

	if s.alreadySold+amount > s.maxGoal {
		panic("amount exceeds max goal of the sale")
	}

	if s.token.Token().BalanceOf(buyer) < amount*s.pricePerToken {
		panic("insufficient balance")
	}

	checkErr(s.token.Token().TransferFrom(buyer, std.Address("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv"), amount*s.pricePerToken))
}

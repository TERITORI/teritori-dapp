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
	owner          std.Address
	buyers         *avl.Tree // address -> amount
	finalized      bool
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

	// check that the token is mintable if admin wants to mint the tokens
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

	// Mint or transfer the max goal to the realm to be sure that the sale can distribute the tokens
	realmAddr := std.CurrentRealm().Addr()
	if mintToken {
		token.banker.Mint(realmAddr, maxGoal)
	} else {
		err := token.banker.Transfer(owner, realmAddr, maxGoal)
		if err != nil {
			panic("error while transferring tokens to the realm, " + err.Error())
		}
	}

	sale := Sale{
		token:          token,
		startTimestamp: startTimestamp,
		endTimestamp:   endTimestamp,
		pricePerToken:  pricePerToken,
		limitPerAddr:   limitPerAddr,
		minGoal:        minGoal,
		maxGoal:        maxGoal,
		owner:          owner,
		buyers:         avl.NewTree(),
		finalized:      false,
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
	sentCoins := std.GetOrigSend()

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

	// Set the new amount of tokens bought by the buyer, it will be send or refunded in the finalize function
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

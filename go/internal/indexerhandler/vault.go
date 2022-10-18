package indexerhandler

import (
	"encoding/json"
	"fmt"
	"regexp"
	"time"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type VaultExecuteUpdatePriceMsg struct {
	Data VaultExecuteUpdatePriceMsgData `json:"update_price"`
}

type VaultExecuteUpdatePriceMsgData struct {
	NFTContractAddress string `json:"nft_contract_addr"`
	NFTTokenId         string `json:"nft_token_id"`
	Denom              string `json:"denom"`
	Amount             string `json:"amount"`
}

// FIXME: this is untested and probably broken

func (h *Handler) handleExecuteUpdatePrice(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract

	if contractAddress != h.config.VaultContractAddress {
		return nil
	}

	// FIXME: what happens if collection doesn't exists?
	// get collection
	var collection indexerdb.Collection
	r := h.db.
		Joins("TeritoriCollection").
		Where("TeritoriCollection__nft_contract_address = ?", contractAddress).
		Find(&collection)
	if err := r.
		Error; err != nil {
		return errors.Wrap(err, "failed to query collections")
	}
	if collection.TeritoriCollection == nil {
		return errors.New("no teritori info on collection")
	}

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	// get message
	var updatePriceMsg VaultExecuteUpdatePriceMsg
	if err := json.Unmarshal(execMsg.Msg, &updatePriceMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal update price msg")
	}

	// update
	nftId := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)
	if err := h.db.Model(&indexerdb.NFT{ID: nftId}).UpdateColumns(map[string]interface{}{
		"Price": updatePriceMsg.Data.Amount,
		"Denom": updatePriceMsg.Data.Denom,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to update nft price")
	}

	// TODO: create update price activity

	h.logger.Debug("updated nft price", zap.String("id", nftId))

	return nil
}

func (h *Handler) handleExecuteWithdraw(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// check that it's the correct vault contract
	if execMsg.Contract != h.config.VaultContractAddress {
		return nil
	}

	// get nft contract address
	executeContractAddresses := e.Events["execute._contract_address"]
	if len(executeContractAddresses) < 2 {
		return errors.New("not enough contract addresses")
	}
	nftContractAddress := executeContractAddresses[1]

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	if err := h.db.Transaction(func(tx *gorm.DB) error {
		// find nft id
		var collection *indexerdb.Collection
		findResult := tx.
			Joins("TeritoriCollection").
			Where("TeritoriCollection__nft_contract_address = ?", nftContractAddress).
			Find(&collection)
		if err := findResult.Error; err != nil {
			return errors.Wrap(err, "failed to query for collection")
		}
		if findResult.RowsAffected == 0 {
			h.logger.Debug("ignored withdraw on unknown collection")
			return nil
		}
		if collection.TeritoriCollection == nil {
			return errors.New("no teritori info on collection")
		}
		nftID := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

		// update nft price
		if err := tx.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
			"price_amount": nil,
			"price_denom":  nil,
			"is_listed":    false,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to update nft")
		}

		// create cancelation
		var nft indexerdb.NFT
		if err := tx.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
			return errors.Wrap(err, "nft not found in db")
		}
		activityID := indexerdb.TeritoriActiviyID(e.MsgID)
		if err := tx.Create(&indexerdb.Activity{
			ID:    activityID,
			NFTID: nftID,
			Kind:  indexerdb.ActivityKindCancelListing,
			Time:  time.Now(), // FIXME: replace by block time
		}).Error; err != nil {
			return errors.Wrap(err, "failed to create listing cancelation in db")
		}
		h.logger.Info("created listing cancelation", zap.String("id", activityID))
		return nil
	}); err != nil {
		return errors.Wrap(err, "db tx failed")
	}

	return nil
}

const sellerReceiverIndex = 1
const buyerSpenderIndex = 0
const priceSpentAmountIndex = 0

var amountRegexp = regexp.MustCompile(`(\d+)(.+)`)

func (h *Handler) handleExecuteBuy(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// check that it's the correct vault contract
	if execMsg.Contract != h.config.VaultContractAddress {
		return nil
	}

	// get nft contract address
	executeContractAddresses := e.Events["execute._contract_address"]
	if len(executeContractAddresses) < 2 {
		return errors.New("not enough contract addresses")
	}
	nftContractAddress := executeContractAddresses[1]

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	// get buyer
	spenders := e.Events["coin_spent.spender"]
	if len(spenders) < buyerSpenderIndex+1 {
		return fmt.Errorf("not enough spenders, wanted %d, got %d", buyerSpenderIndex+1, len(spenders))
	}
	buyer := indexerdb.TeritoriUserID(spenders[buyerSpenderIndex])

	// get seller
	receivers := e.Events["coin_received.receiver"]
	if len(receivers) < sellerReceiverIndex+1 {
		return fmt.Errorf("not enough receivers, wanted %d, got %d", sellerReceiverIndex+1, len(receivers))
	}
	seller := indexerdb.TeritoriUserID(receivers[sellerReceiverIndex])

	// get price
	spentAmounts := e.Events["coin_spent.amount"]
	if len(spentAmounts) < priceSpentAmountIndex+1 {
		return fmt.Errorf("not enough spent amounts, wanted %d, got %d", priceSpentAmountIndex+1, len(spentAmounts))
	}
	priceAmount := spentAmounts[priceSpentAmountIndex]
	matches := amountRegexp.FindStringSubmatch(priceAmount)
	if len(matches) != 3 {
		return errors.New("failed to unmarshal price")
	}
	price := matches[1]
	denom := matches[2]

	if err := h.db.Transaction(func(tx *gorm.DB) error {
		// find nft id
		var collection indexerdb.Collection
		findResult := tx.
			Joins("TeritoriCollection").
			Where("TeritoriCollection__nft_contract_address = ?", nftContractAddress).
			Find(&collection)
		if err := findResult.Error; err != nil {
			return errors.Wrap(err, "failed to query for collection")
		}
		if findResult.RowsAffected == 0 {
			h.logger.Debug("ignored withdraw on unknown collection")
			return nil
		}
		if collection.TeritoriCollection == nil {
			return errors.New("no teritori info on collection")
		}
		nftID := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

		// update nft
		if err := tx.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
			"price_amount": nil,
			"price_denom":  nil,
			"is_listed":    false,
			"owner_id":     buyer,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to update nft")
		}

		// create trade
		var nft indexerdb.NFT
		if err := tx.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
			return errors.Wrap(err, "nft not found in db")
		}
		activityID := indexerdb.TeritoriActiviyID(e.MsgID)
		if err := tx.Create(&indexerdb.Activity{
			ID:    activityID,
			NFTID: nftID,
			Kind:  indexerdb.ActivityKindTrade,
			Time:  time.Now(), // FIXME: replace by block time
			Trade: &indexerdb.Trade{
				Price:      price,
				PriceDenom: denom,
				BuyerID:    buyer,
				SellerID:   seller,
			},
		}).Error; err != nil {
			return errors.Wrap(err, "failed to create trade in db")
		}
		h.logger.Info("created trade", zap.String("id", activityID))

		// complete buy quest
		if err := h.db.Save(&indexerdb.QuestCompletion{
			UserID:    string(buyer),
			QuestID:   "buy_nft",
			Completed: true,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to save buy quest completion")
		}

		// complete sell quest
		if err := h.db.Save(&indexerdb.QuestCompletion{
			UserID:    string(seller),
			QuestID:   "sell_nft",
			Completed: true,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to save sell quest completion")
		}

		return nil
	}); err != nil {
		return errors.Wrap(err, "db tx failed")
	}
	return nil
}

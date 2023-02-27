package indexerhandler

import (
	"encoding/json"
	"fmt"
	"regexp"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
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

	if contractAddress != h.config.Network.VaultContractAddress {
		return nil
	}

	// FIXME: what happens if collection doesn't exists?
	// get collection
	var collection indexerdb.Collection
	r := h.db.
		Joins("JOIN Teritori_collections ON Teritori_collections.collection_id = collections.id").
		Where("Teritori_collections.nft_contract_address = ?", contractAddress).
		Find(&collection)
	if err := r.
		Error; err != nil {
		return errors.Wrap(err, "failed to query collections")
	}
	if r.RowsAffected < 1 {
		//Did not find any collection with the given contract address
		return nil
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
	price := updatePriceMsg.Data.Amount
	denom := updatePriceMsg.Data.Denom
	nftId := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)
	if err := h.db.Model(&indexerdb.NFT{ID: nftId}).UpdateColumns(map[string]interface{}{
		"Price": price,
		"Denom": denom,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to update nft price")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	usdAmount, err := h.usdAmount(denom, price, blockTime)
	if err != nil {
		return errors.Wrap(err, "failed to derive usd amount")
	}

	// create activity
	if err := h.db.Create(&indexerdb.Activity{
		ID:    h.config.Network.ActivityID(e.TxHash, e.MsgIndex),
		NFTID: nftId,
		Kind:  indexerdb.ActivityKindUpdateNFTPrice,
		Time:  blockTime,
		UpdateNFTPrice: &indexerdb.UpdateNFTPrice{
			Price:      price,
			PriceDenom: denom,
			USDPrice:   usdAmount,
			SellerID:   h.config.Network.UserID(execMsg.Sender),
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create listing in db")
	}

	h.logger.Debug("updated nft price", zap.String("id", string(nftId)))

	return nil
}

func (h *Handler) handleExecuteWithdraw(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// check that it's the correct vault contract
	if execMsg.Contract != h.config.Network.VaultContractAddress {
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

	// find nft id
	var collection *indexerdb.Collection
	findResult := h.db.
		Preload("TeritoriCollection").
		Joins("JOIN teritori_collections on teritori_collections.collection_id = collections.id").
		Where("teritori_collections.nft_contract_address = ?", nftContractAddress).
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
	nftID := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

	// update nft price
	if err := h.db.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
		"price_amount": nil,
		"price_denom":  nil,
		"is_listed":    false,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to update nft")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// create cancelation
	var nft indexerdb.NFT
	if err := h.db.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
		return errors.Wrap(err, "nft not found in db")
	}
	activityID := h.config.Network.ActivityID(e.TxHash, e.MsgIndex)
	if err := h.db.Create(&indexerdb.Activity{
		ID:    activityID,
		NFTID: nftID,
		Kind:  indexerdb.ActivityKindCancelListing,
		Time:  blockTime,
		CancelListing: &indexerdb.CancelListing{
			SellerID: h.config.Network.UserID(execMsg.Sender),
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create listing cancelation in db")
	}

	h.logger.Info("created listing cancelation", zap.String("id", string(activityID)))

	return nil
}

const buyerSpenderIndex = 0
const priceSpentAmountIndex = 0

var amountRegexp = regexp.MustCompile(`(\d+)(.+)`)

func (h *Handler) handleExecuteBuy(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// check that it's the correct vault contract
	if execMsg.Contract != h.config.Network.VaultContractAddress {
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
	buyerID := h.config.Network.UserID(spenders[buyerSpenderIndex])

	// get seller, it's the last receiver
	receivers := e.Events["coin_received.receiver"]
	if len(receivers) < 1 {
		return fmt.Errorf("not enough receivers, wanted 1, got %d", len(receivers))
	}
	sellerID := h.config.Network.UserID(receivers[len(receivers)-1])

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

	// find nft id
	var collection indexerdb.Collection
	findResult := h.db.
		Preload("TeritoriCollection").
		Joins("JOIN teritori_collections on teritori_collections.collection_id = collections.id").
		Where("teritori_collections.nft_contract_address = ?", nftContractAddress).
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
	nftID := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

	// update nft
	if err := h.db.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
		"price_amount": nil,
		"price_denom":  nil,
		"is_listed":    false,
		"owner_id":     buyerID,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to update nft")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	usdAmount, err := h.usdAmount(denom, price, blockTime)
	if err != nil {
		return errors.Wrap(err, "failed to derive usd amount")
	}

	// create trade
	var nft indexerdb.NFT
	if err := h.db.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
		return errors.Wrap(err, "nft not found in db")
	}
	activityID := h.config.Network.ActivityID(e.TxHash, e.MsgIndex)
	if err := h.db.Create(&indexerdb.Activity{
		ID:    activityID,
		NFTID: nftID,
		Kind:  indexerdb.ActivityKindTrade,
		Time:  blockTime,
		Trade: &indexerdb.Trade{
			Price:      price,
			PriceDenom: denom,
			USDPrice:   usdAmount,
			BuyerID:    buyerID,
			SellerID:   sellerID,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create trade in db")
	}

	// complete buy quest
	if err := h.db.Save(&indexerdb.QuestCompletion{
		UserID:    buyerID,
		QuestID:   "buy_nft",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save buy quest completion")
	}

	// complete sell quest
	if err := h.db.Save(&indexerdb.QuestCompletion{
		UserID:    sellerID,
		QuestID:   "sell_nft",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save sell quest completion")
	}

	h.logger.Info("created trade", zap.String("id", string(activityID)))

	return nil
}

func (h *Handler) handleExecuteSendNFTVault(e *Message, execMsg *wasmtypes.MsgExecuteContract, sendNFTMsg *SendNFTExecuteMsg) error {
	// get token id
	tokenId := sendNFTMsg.Data.TokenID

	// get sellerID
	sellerID := h.config.Network.UserID(execMsg.Sender)

	// get price from exec msg
	var hookMsg DepositNFTHookMsg
	if err := json.Unmarshal(sendNFTMsg.Data.Msg, &hookMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal hook msg")
	}
	price := hookMsg.Deposit.Amount
	denom := hookMsg.Deposit.Denom

	// find nft id
	var collection *indexerdb.Collection
	findResult := h.db.
		Preload("TeritoriCollection").
		Joins("JOIN teritori_collections on teritori_collections.collection_id = collections.id").
		Where("teritori_collections.nft_contract_address = ?", execMsg.Contract).
		Find(&collection)
	if err := findResult.
		Error; err != nil {
		return errors.Wrap(err, "failed to query collection")
	}
	if findResult.RowsAffected == 0 {
		h.logger.Debug("ignored send_nft on unknown collection")
		return nil
	}
	if collection.TeritoriCollection == nil {
		return errors.New("no teritori info on collection")
	}
	nftID := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

	// update nft price
	if err := h.db.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
		"price_amount": price,
		"price_denom":  denom,
		"is_listed":    true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to update nft")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	usdAmount, err := h.usdAmount(denom, price, blockTime)
	if err != nil {
		return errors.Wrap(err, "failed to derive usd amount")
	}

	// create listing
	var nft indexerdb.NFT
	if err := h.db.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
		return errors.Wrap(err, "nft not found in db")
	}
	activityID := h.config.Network.ActivityID(e.TxHash, e.MsgIndex)
	if err := h.db.Create(&indexerdb.Activity{
		ID:    activityID,
		NFTID: nftID,
		Kind:  indexerdb.ActivityKindList,
		Time:  blockTime,
		Listing: &indexerdb.Listing{
			Price:      price,
			PriceDenom: denom,
			USDPrice:   usdAmount,
			SellerID:   sellerID,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create listing in db")
	}

	// complete quest
	if err := h.db.Save(&indexerdb.QuestCompletion{
		UserID:    sellerID,
		QuestID:   "list_nft",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save quest completion")
	}

	h.logger.Info("created listing", zap.String("id", string(activityID)))

	return nil
}

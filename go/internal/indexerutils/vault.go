package indexerutils

import (
	"fmt"
	"strings"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func (u *IndexerUtils) IndexWithdrawNFT(
	userAddress string,
	nftContract, tokenID string,
	txHash string, msgIndex int,
	blockTime time.Time,
) error {
	// find nft id
	var collection *indexerdb.Collection
	findResult := u.dbTransaction.
		Preload("TeritoriCollection").
		Joins("JOIN teritori_collections on teritori_collections.collection_id = collections.id").
		Where("teritori_collections.nft_contract_address = ?", strings.ToLower(nftContract)).
		Find(&collection)
	if err := findResult.Error; err != nil {
		return errors.Wrap(err, "failed to query for collection")
	}
	if findResult.RowsAffected == 0 {
		u.logger.Debug("ignored withdraw on unknown collection")
		return nil
	}
	if collection.TeritoriCollection == nil {
		return errors.New("no teritori info on collection")
	}
	nftID := u.network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenID)

	// update nft price
	if err := u.dbTransaction.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
		"price_amount": nil,
		"price_denom":  nil,
		"is_listed":    false,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to update nft")
	}

	// create cancelation
	var nft indexerdb.NFT
	if err := u.dbTransaction.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
		return errors.Wrap(err, "nft not found in db")
	}
	activityID := u.network.ActivityID(txHash, msgIndex)
	if err := u.dbTransaction.Create(&indexerdb.Activity{
		ID:    activityID,
		NFTID: nftID,
		Kind:  indexerdb.ActivityKindCancelListing,
		Time:  blockTime,
		CancelListing: &indexerdb.CancelListing{
			SellerID: u.network.UserID(userAddress),
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create listing cancelation in db")
	}

	u.logger.Info("created listing cancelation", zap.String("id", string(activityID)))

	return nil
}

func (u *IndexerUtils) IndexListNFT(
	userAddress string,
	nftContract, tokenID string,
	priceDenom, priceAmount string,
	txHash string, msgIndex int,
	blockTime time.Time,
) error {
	tokenId := tokenID
	sellerID := u.network.UserID(userAddress)

	// get price from exec msg
	// var hookMsg DepositNFTHookMsg
	// if err := json.Unmarshal(sendNFTMsg.Data.Msg, &hookMsg); err != nil {
	// 	return errors.Wrap(err, "failed to unmarshal hook msg")
	// }
	price := priceAmount
	denom := priceDenom

	// find nft id
	var collection *indexerdb.Collection
	findResult := u.dbTransaction.
		Preload("TeritoriCollection").
		Joins("JOIN teritori_collections on teritori_collections.collection_id = collections.id").
		Where("teritori_collections.nft_contract_address = ?", strings.ToLower(nftContract)).
		Find(&collection)
	if err := findResult.
		Error; err != nil {
		return errors.Wrap(err, "failed to query collection")
	}
	if findResult.RowsAffected == 0 {
		u.logger.Debug("ignored send_nft on unknown collection")
		return nil
	}
	if collection.TeritoriCollection == nil {
		return errors.New("no teritori info on collection")
	}
	nftID := u.network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

	// update nft price
	if err := u.dbTransaction.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
		"price_amount": price,
		"price_denom":  denom,
		"is_listed":    true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to update nft")
	}

	// TODO: Calculate usdAmount
	usdAmount := 0.0
	// usdAmount, err := h.usdAmount(denom, price, blockTime)
	// if err != nil {
	// 	return errors.Wrap(err, "failed to derive usd amount")
	// }

	// create listing
	var nft indexerdb.NFT
	if err := u.dbTransaction.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
		return errors.Wrap(err, "nft not found in db")
	}
	activityID := u.network.ActivityID(txHash, msgIndex)
	if err := u.dbTransaction.Create(&indexerdb.Activity{
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
	if err := u.dbTransaction.Save(&indexerdb.QuestCompletion{
		UserID:    sellerID,
		QuestID:   "list_nft",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save quest completion")
	}

	u.logger.Info("created listing", zap.String("id", string(activityID)))

	return nil
}

func (u *IndexerUtils) IndexBuyNFT(
	userAddress string,
	nftContract, tokenID string,
	txHash string, msgIndex int,
	blockTime time.Time,
) error {
	buyerID := u.network.UserID(userAddress)

	// TODO: get seller
	sellerAddress := "0x00"
	sellerID := u.network.UserID(sellerAddress)

	// find nft id
	var collection indexerdb.Collection
	findResult := u.dbTransaction.
		Preload("TeritoriCollection").
		Joins("JOIN teritori_collections on teritori_collections.collection_id = collections.id").
		Where("teritori_collections.nft_contract_address = ?", strings.ToLower(nftContract)).
		Find(&collection)
	if err := findResult.Error; err != nil {
		return errors.Wrap(err, "failed to query for collection")
	}
	if findResult.RowsAffected == 0 {
		u.logger.Debug("ignored withdraw on unknown collection")
		return nil
	}
	if collection.TeritoriCollection == nil {
		return errors.New("no teritori info on collection")
	}
	nftID := u.network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenID)

	listedNFT := indexerdb.NFT{IsListed: true, ID: nftID}
	if err := u.dbTransaction.First(&listedNFT).Error; err != nil {
		return errors.Wrap(err, "failed to get current list nft")
	}

	fmt.Println(listedNFT, "==================")

	priceAmount := listedNFT.PriceAmount.String
	priceDenom := listedNFT.PriceDenom

	// update nft
	if err := u.dbTransaction.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
		"price_amount": nil,
		"price_denom":  nil,
		"is_listed":    false,
		"owner_id":     buyerID,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to update nft")
	}

	// usdAmount, err := h.usdAmount(denom, price, blockTime)
	// if err != nil {
	// 	return errors.Wrap(err, "failed to derive usd amount")
	// }

	// create trade
	var nft indexerdb.NFT
	if err := u.dbTransaction.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
		return errors.Wrap(err, "nft not found in db")
	}
	activityID := u.network.ActivityID(txHash, msgIndex)
	if err := u.dbTransaction.Create(&indexerdb.Activity{
		ID:    activityID,
		NFTID: nftID,
		Kind:  indexerdb.ActivityKindTrade,
		Time:  blockTime,
		Trade: &indexerdb.Trade{
			Price:      priceAmount,
			PriceDenom: priceDenom,
			USDPrice:   0,
			BuyerID:    buyerID,
			SellerID:   sellerID,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create trade in db")
	}

	// complete buy quest
	if err := u.dbTransaction.Save(&indexerdb.QuestCompletion{
		UserID:    buyerID,
		QuestID:   "buy_nft",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save buy quest completion")
	}

	// complete sell quest
	if err := u.dbTransaction.Save(&indexerdb.QuestCompletion{
		UserID:    sellerID,
		QuestID:   "sell_nft",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save sell quest completion")
	}

	u.logger.Info("created trade", zap.String("id", string(activityID)))

	return nil
}

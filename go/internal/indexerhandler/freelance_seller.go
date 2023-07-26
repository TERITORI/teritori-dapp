package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type UpdateSellerProfileMsg struct {
	UpdateSellerProfile struct {
		Seller   string `json:"seller"`
		IpfsHash string `json:"ipfs_hash"`
	} `json:"update_seller_profile"`
}

func (h *Handler) handleExecuteUpdateSellerProfile(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.FreelanceSellerContractAddress {
		return nil
	}
	var msg UpdateSellerProfileMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal update_seller_profile msg")
	}
	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}
	var sellerProfile indexerdb.FreelanceSellerProfile
	result := h.db.
		Model(&indexerdb.FreelanceSellerProfile{}).
		Where("seller_address = ?", msg.UpdateSellerProfile.Seller).
		First(&sellerProfile)
	if result.Error == nil {
		if err := h.db.Create(&indexerdb.FreelanceSellerProfile{
			SellerAddress: msg.UpdateSellerProfile.Seller,
			Ipfs:          msg.UpdateSellerProfile.IpfsHash,
			Time:          blockTime,
			IsActive:      true,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to create seller_profile")
		}
		h.logger.Info("created seller profile")
	} else {
		sellerProfile.Ipfs = msg.UpdateSellerProfile.IpfsHash
		sellerProfile.Time = blockTime
		if err := h.db.Save(sellerProfile).Error; err != nil {
			return errors.Wrap(err, "failed to update seller_profile")
		}
		h.logger.Info("updated seller profile")
	}
	return nil
}

type ExecCreateGigMsg struct {
	CreateGig CreateGigMsg `json:"create_gig"`
}
type CreateGigMsg struct {
	Category    string `json:"category"`
	Subcategory string `json:"subcategory"`
	Identifier  string `json:"identifier"`
	Metadata    string `json:"metadata"`
}

func (h *Handler) handleExecuteCreateGig(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {

	var execCreateGigMsg ExecCreateGigMsg
	if err := json.Unmarshal(execMsg.Msg, &execCreateGigMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal create_gig msg")
	}
	createGig := execCreateGigMsg.CreateGig

	createdAt, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}
	if err := h.db.Create(&indexerdb.FreelanceGig{
		Identifier: createGig.Identifier,
		Category:   createGig.Category,
		CreatedAt:  createdAt.Unix(),
		CreatedBy:  h.config.Network.UserID(execMsg.Sender),
		MetaData:   createGig.Metadata,
		Status:     1, //0:pending, //1: approve
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create gig")
	}
	h.logger.Info("created gig")
	return nil
}

type ExecuteDeleteGigMsg struct {
	DeleteGig DeleteGigMsg `json:"delete_gig"`
}
type DeleteGigMsg struct {
	Identifier string `json:"identifier"`
}

func (h *Handler) handleExecuteDeleteGig(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var executeDeleteGigMsg ExecuteDeleteGigMsg
	if err := json.Unmarshal(execMsg.Msg, &executeDeleteGigMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal delete_gig msg")
	}
	deleteGig := executeDeleteGigMsg.DeleteGig
	gig := indexerdb.FreelanceGig{}
	if err := h.db.Where("identifier = ?", deleteGig.Identifier).First(&gig).Error; err != nil {
		return errors.Wrap(err, "failed to get gig to delete")
	}
	gig.IsDeleted = true
	if err := h.db.Save(&gig).Error; err != nil {
		return errors.Wrap(err, "failed to set deleted to gig")
	}
	return nil
}

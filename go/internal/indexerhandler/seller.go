package indexerhandler

import (
	"encoding/json"
  "fmt"
  "regexp"
  "strconv"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type UpdateSellerProfileMsg struct {
  UpdateSellerProfile struct{
    Seller        string `json:"seller"`
    IpfsHash      string `json:"ipfs_hash"`
  } `json:"update_seller_profile"`
}

func (h *Handler) handleExecuteUpdateSellerProfile(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
  contractAddress := execMsg.Contract
  if contractAddress != h.config.SellerContractAddress {
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
  var sellerProfile indexerdb.SellerProfile
  result := h.db.
    Model(&indexerdb.Seller{}).
    Where("seller_address = ?", msg.UpdateSellerProfile.Seller).
    First(&sellerProfile)
  if result.Error == nil {
    if err := h.db.Create(&indexerdb.SellerProfile{
      SellerAddress: msg.UpdateSellerProfile.Seller,
      Ipfs: msg.UpdateSellerProfile.IpfsHash,
      Time: blockTime,
      isActive: true,
    }).Error; err != nil {
      return errors.Wrap(err, "failed to create seller_profile")
    }
    h.logger.Info("created seller profile")
  }else{
    sellerProfile.Ipfs = msg.UpdateSellerProfile.IpfsHash
    sellerProfile.Time = blockTime
    if err:= h.db.Save(sellerProfile).Error; err != nil {
      return errors.Wrap(err, "failed to update seller_profile")
    }
    h.logger.Info("updated seller profile")
  }
  return nil
}

type AddGigMsg struct {
  AddGig struct{
    Seller        string `json:"seller"`
    GigData       string `json:"gig_data"`
  } `json:"add_gig"`
}

func (h *Handler) handleExecuteAddGig(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
  contractAddress := execMsg.Contract
  if contractAddress != h.config.SellerContractAddress {
    return nil
  }
  gigIds := e.Events["wasm.gig_id"]
  if len(gigIds) == 0 {
    return errors.New("no gig_id")
  }
  gigId := gigIds[0]

  var msg AddGigMsg
  if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
    return errors.Wrap(err, "failed to unmarshal add_gig msg")
  }
  // get block time
  blockTime, err := e.GetBlockTime()
  if err != nil {
    return errors.Wrap(err, "failed to get block time")
  }
  if err := h.db.Create(&indexerdb.Gig{
    Id: gigId,
    Address: msg.AddGig.Seller,
    Time: blockTime,
    GigData: msg.AddGig.GigData,
    Status: 0, //pending
  }); err != nil {
    return errors.Wrap(err, "failed to create gig")
  }
  h.logger.Info("created gig")
  return nil
}

type RemoveGigMsg struct {
  RemoveGig struct{
    Seller  string `json:"seller"`
    Id      uint64 `json:"id"`
  } `json:"remove_gig"`
}

func (h *Handler) handleExecuteRemoveGig(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
  contractAddress := execMsg.Contract
  if contractAddress != h.config.SellerContractAddress {
    return nil
  }
  var msg RemoveGigMsg
  if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
    return errors.Wrap(err, "failed to unmarshal remove_gig msg")
  }
  if err := h.db.Delete(&indexerdb.Seller{}, msg.RemoveGig.Id); err != nil {
    return errors.Wrap(err, "failed to remove gig")
  }
  h.logger.Info("removed gig")
  return nil
}
//
//
//
//
//
//
//type SellerRegisterMsg struct {
//	Seller        string `json:"seller"`
//	SellerId      string `json:"seller_id"`
//	SellerInfoUrl string `json:"seller_info_url"`
//}
//
//func (h *Handler) handleExecuteRegisterSeller(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
//	contractAddress := execMsg.Contract
//	if contractAddress != h.config.SellerContractAddress {
//		return nil
//	}
//	var msg SellerRegisterMsg
//	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
//		return errors.Wrap(err, "failed to unmarshal register_seller msg")
//	}
//
//	// get block time
//	blockTime, err := e.GetBlockTime()
//	if err != nil {
//		return errors.Wrap(err, "failed to get block time")
//	}
//
//	//create seller
//	seller_id, _ := strconv.ParseUint(msg.SellerId, 10, 32)
//	if err := h.db.Create(&indexerdb.Seller{
//		SellerId:      seller_id,
//		SellerAddress: msg.Seller,
//		InfoUrl:       msg.SellerInfoUrl,
//		Time:          blockTime,
//		IsActive:      false,
//	}).Error; err != nil {
//		return errors.Wrap(err, "failed to create seller activity")
//	}
//	return nil
//}
//
//type SellerUpdateActiveMsg struct {
//	SellerId string `json:"seller_id"`
//	IsActive string `json:"is_active"`
//}
//
//func (h *Handler) handleExecuteSellerActive(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
//	contractAddress := execMsg.Contract
//	if contractAddress != h.config.SellerContractAddress {
//		return nil
//	}
//	var msg SellerUpdateActiveMsg
//	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
//		return errors.Wrap(err, "failed to unmarshal update_seller_active msg")
//	}
//
//	// get block time
//	blockTime, err := e.GetBlockTime()
//	if err != nil {
//		return errors.Wrap(err, "failed to get block time")
//	}
//
//	//update seller
//	seller_id, _ := strconv.ParseUint(msg.SellerId, 10, 32)
//	is_active, _ := strconv.ParseBool(msg.IsActive)
//
//	if err := h.db.Model(&indexerdb.Seller{}).Where("seller_id = ?", seller_id).UpdateColumns(indexerdb.Seller{IsActive: is_active, Time: blockTime}).Error; err != nil {
//		return errors.Wrap(err, "failed to update seller active")
//	}
//	return nil
//}
//
//type SellerUpdateSellerMsg struct {
//	SellerId      string `json:"seller_id"`
//	SellerInfoUrl string `json:"seller_info_url"`
//}
//
//func (h *Handler) handleExecuteUpdateSeller(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
//	contractAddress := execMsg.Contract
//	if contractAddress != h.config.SellerContractAddress {
//		return nil
//	}
//	var msg SellerUpdateSellerMsg
//	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
//		return errors.Wrap(err, "failed to unmarshal update_seller msg")
//	}
//
//	//update seller
//	seller_id, _ := strconv.ParseUint(msg.SellerId, 10, 32)
//
//	if err := h.db.Model(&indexerdb.Seller{}).Where("seller_id = ?", seller_id).Update("seller_info_url", msg.SellerInfoUrl).Error; err != nil {
//		return errors.Wrap(err, "failed to update seller info")
//	}
//	return nil
//}

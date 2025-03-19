package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/friendsofgo/errors"
	"go.uber.org/zap"
)

type WhitelistInfo struct {
	AddressesMerkleRoot string `json:"addresses_merkle_root"`
	AddressesCount      uint32 `json:"addresses_count"`
	AddressesIpfs       string `json:"addresses_ipfs"`
}

type Coin struct {
	Denom  string `json:"denom"`
	Amount int64  `json:"amount"`
}

type MintPeriod struct {
	Price           *Coin          `json:"price,omitempty"`
	MaxTokens       *uint32        `json:"max_tokens,omitempty"`
	LimitPerAddress *uint32        `json:"limit_per_address,omitempty"`
	StartTime       uint64         `json:"start_time"`
	EndTime         *uint64        `json:"end_time,omitempty"`
	WhitelistInfo   *WhitelistInfo `json:"whitelist_info,omitempty"`
}

type CollectionData struct {
	Name                     string          `json:"name"`
	Desc                     string          `json:"desc"`
	Symbol                   string          `json:"symbol"`
	CoverImgURI              string          `json:"cover_img_uri"`
	TargetNetwork            string          `json:"target_network"`
	WebsiteLink              string          `json:"website_link"`
	ContactEmail             string          `json:"contact_email"`
	ProjectType              string          `json:"project_type"`
	TeamDesc                 string          `json:"team_desc"`
	Partners                 string          `json:"partners"`
	InvestmentDesc           string          `json:"investment_desc"`
	InvestmentLink           string          `json:"investment_link"`
	ArtworkDesc              string          `json:"artwork_desc"`
	TokensCount              uint64          `json:"tokens_count"`
	MintPeriods              []MintPeriod    `json:"mint_periods"`
	RoyaltyAddress           *sdk.AccAddress `json:"royalty_address,omitempty"`
	RoyaltyPercentage        *uint8          `json:"royalty_percentage,omitempty"`
	BaseTokenURI             *string         `json:"base_token_uri,omitempty"`
	MetadatasMerkleRoot      *string         `json:"metadatas_merkle_root,omitempty"`
	DeployedAddress          *string         `json:"deployed_address,omitempty"`
	Owner                    *string         `json:"owner,omitempty"`
}

type SubmitCollectionMsg struct {
	CollectionData CollectionData
}

type UpdateMerkleRootMsg struct {
	CollectionId string
	MerkleRoot   string
}

type DeployCollectionMsg struct {
	CollectionId string
}

func (h *Handler) handleExecuteSubmitCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var submitCollectionMsg SubmitCollectionMsg

	if err := json.Unmarshal(execMsg.Msg, &submitCollectionMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal submit collection msg")
	}
	collectionData := submitCollectionMsg.CollectionData

	collectionId := e.Events["wasm.collection_id"][0]
	if collectionId == "" {
		return errors.New("failed to get collection id")
	}

	collectionDataJson, err := json.Marshal(collectionData)
	if err != nil {
		return errors.Wrap(err, "failed to marshal collection data")
	}

	project := indexerdb.LaunchpadProject{
		NetworkID:      h.config.Network.ID,
		ProjectID:      collectionId,
		CollectionData: collectionDataJson,
		CreatorID:      h.config.Network.UserID(execMsg.Sender),
		Status:         launchpadpb.Status_STATUS_INCOMPLETE,
	}
	if err := h.db.Create(project).Error; err != nil {
		return errors.Wrap(err, "failed to create project")
	}

	h.logger.Info("submited project", zap.Any("symbol", collectionId))

	return nil
}

func (h *Handler) handleExecuteUpdateMerkleRoot(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var updateMerkleRootMsg UpdateMerkleRootMsg

	if err := json.Unmarshal(execMsg.Msg, &updateMerkleRootMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal merkle root msg")
	}
	collectionId := updateMerkleRootMsg.CollectionId
	merkleRoot := updateMerkleRootMsg.MerkleRoot

	// Update collection_data
	if err := h.db.Exec(`
    UPDATE launchpad_projects 
    SET collection_data = jsonb_set(collection_data, '{metadatas_merkle_root}', to_jsonb(?::text))
    WHERE project_id = ? AND network_id = ?`,
		merkleRoot, collectionId, h.config.Network.ID,
	).Error; err != nil {
		return errors.Wrap(err, "failed to update deployed address in collection_data")
	}

	// Update status
	if err :=
		h.db.
			Model(&indexerdb.LaunchpadProject{}).
			Where("project_id = ?", collectionId).
			Where("network_id = ?", h.config.Network.ID).
			UpdateColumn("status", launchpadpb.Status_STATUS_COMPLETE).
			Error; err != nil {
		return errors.Wrap(err, "failed to update project status to COMPLETE")
	}

	h.logger.Info("updated merkle root", zap.Any("merkleRoot", merkleRoot))

	return nil
}

func (h *Handler) handleExecuteDeployCollection(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var deployCollectionMsg DeployCollectionMsg

	if err := json.Unmarshal(execMsg.Msg, &deployCollectionMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal deploy collection msg")
	}
	collectionId := deployCollectionMsg.CollectionId

	deployedAddress := e.Events["instantiate._contract_address"][0]
	if deployedAddress == "" {
		return errors.New("failed to get deployed address from reply")
	}

	// Update collection_data
	if err := h.db.Exec(`
    UPDATE launchpad_projects 
    SET collection_data = jsonb_set(collection_data, '{deployed_address}', to_jsonb(?::text))
    WHERE project_id = ? AND network_id = ?`,
		deployedAddress, collectionId, h.config.Network.ID,
	).Error; err != nil {
		return errors.Wrap(err, "failed to update deployed address in collection_data")
	}

	// Update status
	if err := h.db.
		Model(&indexerdb.LaunchpadProject{}).
		Where("project_id = ?", collectionId).
		Where("network_id = ?", h.config.Network.ID).
		UpdateColumn("status", launchpadpb.Status_STATUS_CONFIRMED).
		Error; err != nil {
		return errors.Wrap(err, "failed to update project status to CONFIRMED")
	}

	var project indexerdb.LaunchpadProject
	if err := h.db.Model(&indexerdb.LaunchpadProject{}).
		Where("project_id = ?", collectionId).
		Where("network_id = ?", h.config.Network.ID).
		Scan(&project).Error; err != nil {
		return errors.Wrap(err, "failed to get launchpad_project from database")
	}
	collectionData := project.CollectionData

	// Create usable collection
	// TODO: Use a defined shape for collection_data ?
	var collectionDataJSON map[string]json.RawMessage
	if err := json.Unmarshal(collectionData, &collectionDataJSON); err != nil {
		return errors.Wrap(err, "failed to unmarhsal collection_data")
	}
	var name string
	if raw, ok := collectionDataJSON["name"]; ok {
		if err := json.Unmarshal(raw, &name); err != nil {
			return errors.Wrap(err, "failed to unmarshal name")
		}
	}
	var coverImgUri string
	if raw, ok := collectionDataJSON["cover_img_uri"]; ok {
		if err := json.Unmarshal(raw, &coverImgUri); err != nil {
			return errors.Wrap(err, "failed to unmarshal cover_img_uri")
		}
	}
	var tokensCount uint64
	if raw, ok := collectionDataJSON["tokens_count"]; ok {
		if err := json.Unmarshal(raw, &tokensCount); err != nil {
			return errors.Wrap(err, "failed to unmarshal tokens_count")
		}
	}

	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	networkCollectionId := h.config.Network.CollectionID(deployedAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:                  networkCollectionId,
		NetworkID:           h.config.Network.ID,
		Name:                name,
		ImageURI:            coverImgUri,
		MaxSupply:           int(tokensCount),
		SecondaryDuringMint: true,
		Time:                blockTime,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			NetworkID:           h.config.Network.ID,
			MintContractAddress: deployedAddress,
			NFTContractAddress:  deployedAddress,
			CreatorAddress:      execMsg.Sender,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create teritori collection")
	}

	h.logger.Info("created teritori collection", zap.String("id", string(networkCollectionId)))

	return nil
}

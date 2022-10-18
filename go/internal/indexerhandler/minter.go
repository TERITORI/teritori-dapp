package indexerhandler

import (
	"encoding/json"
	"fmt"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/contracts/nft_minter_types"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func (h *Handler) handleInstantiateMinter(e *Message, contractAddress string, instantiateMsg *wasmtypes.MsgInstantiateContract) error {
	// get nft contract address
	nftAddrs := e.Events["wasm.nft_addr"]
	if len(nftAddrs) == 0 {
		return errors.New("no nft contract address")
	}
	nftAddr := nftAddrs[0]

	var minterInstantiateMsg nft_minter_types.InstantiateMsg
	if err := json.Unmarshal(instantiateMsg.Msg.Bytes(), &minterInstantiateMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal minter instantiate msg")
	}

	// FIXME: network queries should be done async

	// try to fetch collection metadata
	metadataURI := uriJoin(minterInstantiateMsg.NftBaseUri, "collection.json")
	var metadata CollectionMetadata
	if err := fetchIPFSJSON(metadataURI, &metadata); err != nil {
		h.logger.Error("failed to fetch collection metadata", zap.String("metadata-uri", metadataURI), zap.Error(err))
	}

	// create collection
	collectionId := indexerdb.TeritoriCollectionID(contractAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:       collectionId,
		Network:  marketplacepb.Network_NETWORK_TERITORI,
		Name:     minterInstantiateMsg.NftName,
		ImageURI: metadata.ImageURI,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			MintContractAddress: contractAddress,
			NFTContractAddress:  nftAddr,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}
	h.logger.Info("created collection", zap.String("id", collectionId))

	return nil
}

func (h *Handler) handleExecuteMintClassic(e *Message, collection *indexerdb.Collection, tokenId string) error {
	owners := e.Events["wasm.owner"]
	if len(owners) == 0 {
		return errors.New("no owners")
	}
	owner := owners[0]
	ownerId := indexerdb.TeritoriUserID(owner)

	// FIXME: replace by in-DB baseURI
	var minterConfig MinterConfigResponse
	if err := querySmartContract(h.config.RESTEndpoint, &minterConfig, collection.TeritoriCollection.MintContractAddress, `{ "config": {} }`); err != nil {
		return errors.Wrap(err, "failed to query minter config")
	}

	// FIXME: do network queries async with retries

	metadataURI := uriJoin(minterConfig.BaseURI, fmt.Sprintf("%s.json", tokenId))
	var metadata NFTMetadata
	if err := fetchIPFSJSON(metadataURI, &metadata); err != nil {
		h.logger.Error("failed to fetch nft metadata", zap.String("metadata-uri", metadataURI), zap.Error(err))
	}

	nftId := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

	nft := indexerdb.NFT{
		ID:           nftId,
		OwnerID:      ownerId,
		Name:         metadata.Name,
		ImageURI:     metadata.ImageURI,
		CollectionID: collection.ID,
		TeritoriNFT: &indexerdb.TeritoriNFT{
			TokenID: tokenId,
		},
	}
	if err := h.db.Create(&nft).Error; err != nil {
		spew.Dump(nft)
		return errors.Wrap(err, "failed to create nft in db")
	}
	h.logger.Info("created nft", zap.String("id", nftId), zap.String("owner-id", string(ownerId)))

	return nil
}

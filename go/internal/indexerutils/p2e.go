package indexerutils

import (
	"strings"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2e"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type IndexerUtils struct {
	network *networks.NetworkBase
	db      *gorm.DB
	logger  *zap.Logger
}

func NewIndexerUtils(network *networks.NetworkBase, db *gorm.DB, logger *zap.Logger) (*IndexerUtils, error) {
	return &IndexerUtils{
		network: network,
		db:      db,
		logger:  logger,
	}, nil
}

func (u *IndexerUtils) IndexSquadStake(
	contractVersion, contractAddress, userAddress string,
	startTime, endTime uint64,
	tokenIDs, nftContracts []string,
) error {
	ownerId := u.network.UserID(userAddress)

	startTimeDt := time.Unix(int64(startTime), 0)
	season, _, err := p2e.GetSeasonByTime(startTimeDt)
	if err != nil {
		return errors.Wrap(err, "failed to get season")
	}

	// if contractAddress == u.network.RiotSquadStakingContractAddressV1 && season.ID != "Season 1" {
	// 	u.logger.Info("ignored p2e stake event for V1 contract out of Season 1")
	// 	return nil
	// }

	var count int64
	if err := u.db.Model(&indexerdb.P2eSquadStaking{}).
		Where("owner_id  = ? AND start_time = ?", ownerId, startTime).
		Count(&count).Error; err != nil {
		return errors.Wrap(err, "failed to query current staking")
	}

	if count != 0 {
		return errors.New("data corrupts: we should not have a current staking")
	}

	squadStaking := indexerdb.P2eSquadStaking{
		OwnerID:   ownerId,
		StartTime: startTime,
		EndTime:   endTime,
		TokenIDs:  strings.Join(tokenIDs, ","),
		SeasonID:  season.ID,
	}

	if err := u.db.Create(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to create squad staking")
	}

	// Create leaderboard (by season) record if does not exist
	var userScore indexerdb.P2eLeaderboard
	q2 := &indexerdb.P2eLeaderboard{
		UserID:   ownerId,
		SeasonID: season.ID,
	}
	if err := u.db.Where(q2).FirstOrCreate(&userScore).Error; err != nil {
		return errors.Wrap(err, "failed to get/create user record for leaderboard")
	}

	// contractVersion := "V2"
	// if contractAddress == u.network.RiotSquadStakingContractAddressV1 {
	// 	contractVersion = "V1"
	// }
	u.logger.Info("created leaderboard entry", zap.String("contract-version", contractVersion), zap.String("user-id", string(ownerId)), zap.String("season-id", season.ID))

	// Update lockedOn: set lockedOn = contract which holds NFTs
	lockedOn := u.network.UserID(contractAddress)

	for idx, tokenID := range tokenIDs {
		result := u.db.Exec(`
			UPDATE nfts AS n
			SET 
				locked_on = ?
			FROM 
				teritori_collections AS tc,
				teritori_nfts AS tn 
			WHERE 
				n.collection_id = tc.collection_id
				AND tn.nft_id = n.id 
				AND tc.nft_contract_address = ?
				AND tn.token_id = ?
		`, lockedOn, nftContracts[idx], tokenID)
		if result.Error != nil {
			return errors.New("failed to update lockedOn")
		}
	}

	return nil
}

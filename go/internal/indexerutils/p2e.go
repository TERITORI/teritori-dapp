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
	network       *networks.NetworkBase
	dbTransaction *gorm.DB
	logger        *zap.Logger
}

func NewIndexerUtils(network *networks.NetworkBase, dbTransaction *gorm.DB, logger *zap.Logger) (*IndexerUtils, error) {
	return &IndexerUtils{
		network:       network,
		dbTransaction: dbTransaction,
		logger:        logger,
	}, nil
}

func (u *IndexerUtils) IndexSquadUnstake(
	contractAddress, userAddress string,
	tokenIDs, nftContracts []string,
) error {
	userId := u.network.UserID(userAddress)

	// Get current squad stakings
	var squadStakings []indexerdb.P2eSquadStaking
	q1 := &indexerdb.P2eSquadStaking{
		OwnerID: userId,
	}

	if err := u.dbTransaction.Where(q1).Find(&squadStakings).Error; err != nil {
		return errors.Wrap(err, "failed to get current squad staking")
	}

	for _, squadStaking := range squadStakings {
		// NOTE: an NFT cannot be in multi squad at a given time so we can
		// check if a squad is unstaked just by checking just one NFT in that squad
		// to see if it's in the unstakedTokenIds.
		squadFirstTokenId := strings.Split(squadStaking.TokenIDs, ",")[0]
		isUnstaked := false
		for _, unstakedTokenId := range tokenIDs {
			if unstakedTokenId == squadFirstTokenId {
				isUnstaked = true
			}
		}

		if !isUnstaked {
			continue
		}

		// Get staking duration and delete staking object
		stakingDuration := squadStaking.EndTime - squadStaking.StartTime
		if err := u.dbTransaction.Delete(&squadStaking).Error; err != nil {
			return errors.Wrap(err, "failed to remove current squad staking")
		}

		// Get current leaderboard record
		startTimeDt := time.Unix(int64(squadStaking.StartTime), 0)
		season, _, err := p2e.GetSeasonByTime(startTimeDt)
		if err != nil {
			return errors.Wrap(err, "failed to get season")
		}
		seasonId := season.ID

		var userScore indexerdb.P2eLeaderboard
		q2 := &indexerdb.P2eLeaderboard{
			UserID:   userId,
			SeasonID: seasonId,
		}
		// Normally, an user score record has to exist here (created when first stake)
		if err := u.dbTransaction.Where(q2).First(&userScore).Error; err != nil {
			return errors.Wrap(err, "failed to get current user score")
		}

		// For S3: If staking ended yesterday then do not count because it have been reset at midnight already
		now := time.Now()
		dayBeginningTimestamp := time.Date(now.UTC().Year(), now.UTC().Month(), now.UTC().Day(), 0, 0, 0, 0, time.UTC).Unix()

		var adjustedStakingDuration uint64
		if squadStaking.EndTime <= uint64(dayBeginningTimestamp) {
			adjustedStakingDuration = 0
		} else if squadStaking.StartTime < uint64(dayBeginningTimestamp) {
			adjustedStakingDuration = squadStaking.EndTime - uint64(dayBeginningTimestamp)
		} else {
			adjustedStakingDuration = stakingDuration
		}

		// Update score
		if err := u.dbTransaction.Model(&userScore).
			UpdateColumn("score", gorm.Expr("score  + ?", adjustedStakingDuration)).
			UpdateColumn("in_progress_score", gorm.Expr("score")).
			Error; err != nil {
			return errors.Wrap(err, "failed to update user score")
		}
	}

	// Update lockedOn: remove lockedOn
	for idx, tokenId := range tokenIDs {
		nftContractAddress := nftContracts[idx]

		result := u.dbTransaction.Exec(`
			UPDATE nfts AS n
			SET locked_on = NULL
			FROM
				teritori_collections AS tc,
				teritori_nfts AS tn
			WHERE
				n.collection_id = tc.collection_id
				AND tn.nft_id = n.id
				AND tc.nft_contract_address = ?
				AND tn.token_id = ?
		`, nftContractAddress, tokenId)
		if result.Error != nil {
			return errors.New("failed to update lockedOn")
		}
	}

	return nil
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
	if err := u.dbTransaction.Model(&indexerdb.P2eSquadStaking{}).
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

	if err := u.dbTransaction.Create(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to create squad staking")
	}

	// Create leaderboard (by season) record if does not exist
	var userScore indexerdb.P2eLeaderboard
	q2 := &indexerdb.P2eLeaderboard{
		UserID:   ownerId,
		SeasonID: season.ID,
	}
	if err := u.dbTransaction.Where(q2).FirstOrCreate(&userScore).Error; err != nil {
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
		result := u.dbTransaction.Exec(`
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

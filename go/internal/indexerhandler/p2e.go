package indexerhandler

import (
	"encoding/json"
	"strconv"
	"strings"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type SquadStakeMsg struct {
	TokenIds []string `json:"token_ids"`
}

type ExecuteSquadStakeMsg struct {
	Stake SquadStakeMsg `json:"stake"`
}

// Insert a new P2eSquadStaking record when staking begins
func (h *Handler) handleExecuteSquadStake(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var squadStakeMsg ExecuteSquadStakeMsg
	if err := json.Unmarshal(execMsg.Msg, &squadStakeMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal squadStake execute msg")
	}

	users := e.Events["wasm.user"]
	if len(users) == 0 {
		return errors.New("no user")
	}

	startTimes := e.Events["wasm.start_time"]
	if len(startTimes) == 0 {
		return errors.New("no start_time")
	}

	endTimes := e.Events["wasm.end_time"]
	if len(endTimes) == 0 {
		return errors.New("no end_time")
	}

	ownerId := indexerdb.TeritoriUserID(users[0])
	tokenIds := squadStakeMsg.Stake.TokenIds

	startTime, err := strconv.ParseUint(startTimes[0], 0, 64)
	if err != nil {
		return errors.Wrap(err, "unable to parse start_time")
	}

	endTime, err := strconv.ParseUint(endTimes[0], 0, 64)
	if err != nil {
		return errors.Wrap(err, "unable to parse end_time")
	}

	// TODO: change to dynamic when support squad staking for any collection
	theRiotCollectionId := indexerdb.TeritoriCollectionID(h.config.TheRiotCollectionAddress)

	squadStaking := indexerdb.P2eSquadStaking{
		OwnerID:      ownerId,
		StartTime:    startTime,
		EndTime:      endTime,
		CollectionID: theRiotCollectionId,
		TokenIDs:     tokenIds,
	}

	if err := h.db.FirstOrCreate(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to create squad staking")
	}

	h.logger.Info("squad staked", zap.String("owner-id", string(ownerId)), zap.String("token-ids", strings.Join(tokenIds[:], ",")))
	return nil
}

// Increase score on P2eLeaderboard when user unstake
// Remote unstaked staking
func (h *Handler) handleExecuteSquadUnstake(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// TODO: change to dynamic when support squad staking for any collection
	theRiotCollectionId := indexerdb.TeritoriCollectionID(h.config.TheRiotCollectionAddress)

	userId := indexerdb.TeritoriUserID(execMsg.Sender)

	// Get current squad staking
	var squadStaking indexerdb.P2eSquadStaking
	q1 := &indexerdb.P2eSquadStaking{
		OwnerID:      userId,
		CollectionID: theRiotCollectionId,
	}
	if err := h.db.Where(q1).First(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to get current squad staking")
	}

	// Get staking duration and delete staking object
	stakingDuration := squadStaking.EndTime - squadStaking.StartTime
	if err := h.db.Delete(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to remove current squad staking")
	}

	// Get current leaderboard record
	var userScore indexerdb.P2eLeaderboard
	q2 := &indexerdb.P2eLeaderboard{
		UserID:       userId,
		CollectionID: theRiotCollectionId,
	}
	if err := h.db.Where(q2).FirstOrCreate(&userScore).Error; err != nil {
		return errors.Wrap(err, "failed to get current user score")
	}

	// Update score
	if err := h.db.Model(&userScore).UpdateColumn("score", gorm.Expr("score  + ?", stakingDuration)).Error; err != nil {
		return errors.Wrap(err, "failed to update user score")
	}

	return nil
}

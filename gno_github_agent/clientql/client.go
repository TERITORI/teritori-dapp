package clientql

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/gh-verify-agent/db"
	"github.com/TERITORI/gh-verify-agent/gnoindexerql"
	"github.com/TERITORI/gh-verify-agent/signer"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type IndexerQL struct {
	gqlClient       graphql.Client
	db              *gorm.DB
	logger          *zap.SugaredLogger
	signer          *signer.Signer
	verifyRealmPath string
}

func New(graphqlEndpoint string, db *gorm.DB, logger *zap.SugaredLogger, gnoSigner *signer.Signer, verifyRealmPath string) *IndexerQL {
	gqlClient := graphql.NewClient(graphqlEndpoint, nil)
	return &IndexerQL{gqlClient: gqlClient, db: db, logger: logger, signer: gnoSigner, verifyRealmPath: verifyRealmPath}
}

func (client *IndexerQL) DealWithVerifications() error {
	lastBlock, err := client.getLastTreatedBlock()
	if err != nil {
		return err
	}

	validationRequests, err := gnoindexerql.GetValidationRequests(context.Background(), client.gqlClient, lastBlock, client.verifyRealmPath)
	if err != nil {
		return err
	}
	client.logger.Infof("validation requests: %d\n", len(validationRequests.Transactions))

	for _, validationRequest := range validationRequests.Transactions {
		for _, responseEvent := range validationRequest.Response.Events {
			switch event := responseEvent.(type) {
			case *gnoindexerql.GetValidationRequestsTransactionsTransactionResponseEventsGnoEvent:
				client.logger.Infof("args %v\n", event.Attrs)

				err := client.dealWithVerification(event, validationRequest.Block_height)
				if err != nil {
					client.logger.Errorf("failed to deal with verification: %s", err.Error())
					continue
				}

			default:
				client.logger.Errorf("unexpected event type: %T", event)
			}
		}
	}

	return nil
}

func (client *IndexerQL) getLastTreatedBlock() (int, error) {
	var verification db.Verification
	err := client.db.Model(&db.Verification{}).Where("status = ?", string(db.VerificationStatusVerified)).Order("id desc").First(&verification).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, nil
		}

		return 0, err
	}
	return verification.BlockHeight, err
}

func (client *IndexerQL) dealWithVerification(event *gnoindexerql.GetValidationRequestsTransactionsTransactionResponseEventsGnoEvent, blockHeight int) error {
	var handle string
	var callerAddress string
	for _, attr := range event.Attrs {
		switch attr.Key {
		case "handle":
			handle = attr.Value
		case "from":
			callerAddress = attr.Value
		}
	}

	var verification db.Verification
	err := client.db.Model(&db.Verification{}).Where("handle = ? AND address = ?", handle, callerAddress).Find(&verification).Error
	if err != nil {
		return err
	}

	if verification.Status == "verified" {
		// Already verified.
		return nil
	}

	client.logger.Infof("handle: %s, callerAddress: %s\n", handle, callerAddress)
	res, err := http.DefaultClient.Get(fmt.Sprintf("https://raw.githubusercontent.com/%s/.gno/main/config.yml?version=1", handle))
	if err != nil {
		return err
	}

	defer res.Body.Close()
	if res.StatusCode != 200 {
		return client.updateVerification(handle, callerAddress, db.VerificationStatusConfigNotFound, blockHeight)
	}

	data, err := io.ReadAll(res.Body)
	if err != nil {
		client.updateVerification(handle, callerAddress, db.VerificationStatusInvalidData, blockHeight)
		return err
	}

	githubConfiguredAddress := strings.TrimSpace(string(data))
	if githubConfiguredAddress == callerAddress {
		err = client.signer.CallVerify(githubConfiguredAddress)
		if err != nil {
			return err
		}

		return client.updateVerification(handle, callerAddress, db.VerificationStatusVerified, blockHeight)
	}
	return client.updateVerification(handle, callerAddress, db.VerificationStatusCallerAddressMismatch, blockHeight)
}

func (client *IndexerQL) updateVerification(handle, address string, status db.VerificationStatus, blockHeight int) error {
	verification := db.Verification{
		Handle:      handle,
		Address:     address,
		Status:      string(status),
		CreatedAt:   time.Now().Format("2006-01-02 15:04:05"),
		BlockHeight: blockHeight,
	}

	return client.db.Model(&verification).Where("handle = ? AND address = ?", handle, address).Assign(db.Verification{Status: string(status)}).FirstOrCreate(&verification).Error
}

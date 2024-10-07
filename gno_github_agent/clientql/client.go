package clientql

import (
	"context"
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
	gqlClient graphql.Client
	db        *gorm.DB
	logger    *zap.SugaredLogger
	signer    *signer.Signer
}

func New(graphqlEndpoint string, db *gorm.DB, logger *zap.SugaredLogger, gnoSigner *signer.Signer) *IndexerQL {
	gqlClient := graphql.NewClient(graphqlEndpoint, nil)
	return &IndexerQL{gqlClient: gqlClient, db: db, logger: logger, signer: gnoSigner}
}

func (client *IndexerQL) DealWithVerifications() error {
	lastBlock, err := getLastTreatedBlock()
	if err != nil {
		return err
	}

	validationRequests, err := gnoindexerql.GetValidationRequests(context.Background(), client.gqlClient, lastBlock)
	if err != nil {
		return err
	}
	client.logger.Infof("validation requests: %d\n", len(validationRequests.Transactions))

	for _, validationRequest := range validationRequests.Transactions {
		for _, responseEvent := range validationRequest.Response.Events {
			switch event := responseEvent.(type) {
			case *gnoindexerql.GetValidationRequestsTransactionsTransactionResponseEventsGnoEvent:
				client.logger.Infof("args %v\n", event.Attrs)
				err := client.dealWithVerification(event)
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

func getLastTreatedBlock() (int, error) {
	return 0, nil
}

func (client *IndexerQL) dealWithVerification(event *gnoindexerql.GetValidationRequestsTransactionsTransactionResponseEventsGnoEvent) error {
	var handle string
	var callerAddress string
	for _, attr := range event.Attrs {
		if attr.Key == "handle" {
			handle = attr.Value
		}
		if attr.Key == "from" {
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

	client.logger.Infof("Get\n")
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return client.updateVerification(handle, callerAddress, "config_not_found")
	}
	data, err := io.ReadAll(res.Body)
	if err != nil {
		client.updateVerification(handle, callerAddress, "invalid_data")
		return err
	}
	client.logger.Infof("config.yml: %s\n", string(data))
	githubConfiguredAddress := strings.TrimSpace(string(data))
	if githubConfiguredAddress == callerAddress {
		err = client.signer.CallVerify(githubConfiguredAddress)
		if err != nil {
			return err
		}

		return client.updateVerification(handle, callerAddress, "verified")
	}
	return client.updateVerification(handle, callerAddress, "caller_address_mismatch")
}

func (client *IndexerQL) updateVerification(handle, address, status string) error {
	verification := db.Verification{
		Handle:    handle,
		Address:   address,
		Status:    status,
		CreatedAt: time.Now().Format("2006-01-02 15:04:05"),
	}

	return client.db.Model(&verification).Where("handle = ? AND address = ?", handle, address).Assign(db.Verification{Status: status}).FirstOrCreate(&verification).Error
}

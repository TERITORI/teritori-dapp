package feed

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/pkg/errors"
)

type PinataService struct {
	JWT string
}

type PinataCredential struct {
	PinataApiKey    string `json:"pinata_api_key"`
	PinataApiSecret string `json:"pinata_api_secret"`
	JWT             string `jsop:"JWT"`
}

type Scopes struct {
	Admin bool `json:"admin"`
}

type PinataKeyData struct {
	Name      string    `json:"name"`
	Revoked   bool      `json:"revoked"`
	Key       string    `json:"key"`
	Scopes    Scopes    `json:"scopes"`
	CreatedAt time.Time `json:"createdAt"`
}

type PinataApiKeysResponse struct {
	Keys  []PinataKeyData `json:"keys"`
	Count int             `json:"count"`
}

func NewPinataService(JWT string) *PinataService {
	return &PinataService{
		JWT: JWT,
	}
}

const FEED_KEY_PREFIX = "feed-user"
const PINATA_LIMIT_PER_PAGE = 10
const KEY_TTL = 9 // 9s

func KeyName(userId string) string {
	return fmt.Sprintf("%s%s", FEED_KEY_PREFIX, userId)
}

func (ps *PinataService) GetAPIKeys(page int) (*PinataApiKeysResponse, error) {
	url := fmt.Sprintf("https://api.pinata.cloud/users/apiKeys?offset=%d", page*PINATA_LIMIT_PER_PAGE)
	method := "GET"

	res, err := ps.makeRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	var apiKeysRes *PinataApiKeysResponse
	if err := json.Unmarshal(res, &apiKeysRes); err != nil {
		return nil, errors.Wrap(err, "failed to parse Pinata response body")
	}

	return apiKeysRes, nil
}

func (ps *PinataService) RevokeAPIKey(apiKey string) error {
	url := "https://api.pinata.cloud/users/revokeApiKey"
	method := "PUT"

	payload := strings.NewReader(fmt.Sprintf(`{
		"apiKey": "%s"
	}`, apiKey))

	res, err := ps.makeRequest(method, url, payload)
	if err != nil {
		return err
	}

	if string(res) != `"Revoked"` {
		return errors.New(fmt.Sprintf("failed to revoke: %s", string(res)))
	}

	return nil
}

func (ps *PinataService) GenerateAPIKey() (*PinataCredential, error) {
	url := "https://api.pinata.cloud/users/generateApiKey"
	method := "POST"

	keyName := KeyName("")

	payload := strings.NewReader(fmt.Sprintf(`{
		"keyName": "%s",
		"maxUses": 5,
		"permissions": {
			"endpoints": {
				"data": {
					"pinList": false,
					"userPinnedDataTotal": false
				},
				"pinning": {
					"hashMetadata": false,
					"hashPinPolicy": false,
					"pinByHash": false,
					"pinFileToIPFS": true,
					"pinJSONToIPFS": false,
					"pinJobs": false,
					"unpin": false,
					"userPinPolicy": false
				}
			}
		}
	}`, keyName))

	res, err := ps.makeRequest(method, url, payload)
	if err != nil {
		return nil, err
	}

	var credential *PinataCredential

	if err := json.Unmarshal(res, &credential); err != nil {
		return nil, errors.Wrap(err, "failed parse Pinata key data")
	}

	return credential, nil
}

func (ps *PinataService) makeRequest(method string, url string, payload io.Reader) ([]byte, error) {
	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		return nil, errors.Wrap(err, "failed to create new request")
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", ps.JWT))
	req.Header.Add("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		return nil, errors.Wrap(err, "failed to request")
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, errors.Wrap(err, "fail to read the response")
	}

	return body, nil
}

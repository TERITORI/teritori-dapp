package faking

import (
	"fmt"
	"math/rand"
	"net/http"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	faker "github.com/bxcodec/faker/v3"
	"github.com/pkg/errors"
)

func getRedirect(url string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		panic(err)
	}
	client := new(http.Client)
	redirect := ""
	client.CheckRedirect = func(req *http.Request, via []*http.Request) error {
		redirect = req.URL.String()
		return errors.New("Redirect")
	}

	response, err := client.Do(req)
	if err != nil && !strings.Contains(err.Error(), "Redirect") {
		return "", errors.Wrap(err, "failed to do")
	}
	if response.StatusCode != http.StatusFound {
		return "", errors.New("bad status")
	}
	return redirect, nil
}

func fakeImageURI(width, height int) string {
	uri := fmt.Sprintf("https://loremflickr.com/%d/%d", width, height)
	redirectURI, err := getRedirect(uri) // this prevents caching in browsers
	if err != nil {
		// ignore error and return the cachable uri
		return uri
	}
	return redirectURI
}

func fakeBool() bool {
	return rand.Intn(2) != 0
}

func FakeCollection() *marketplacepb.Collection {
	return &marketplacepb.Collection{
		CollectionName: faker.Sentence(),
		CreatorName:    faker.Name(),
		Verified:       fakeBool(),
		ImageUri:       fakeImageURI(400, 400),
	}
}

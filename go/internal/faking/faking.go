package faking

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

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
	volume := strconv.FormatFloat(rand.Float64()*5000, 'f', 2, 64)
	volume = strings.TrimRight(strings.TrimRight(volume, "0"), ".")
	fakeMintAddress := faker.UUIDDigit()
	return &marketplacepb.Collection{
		Id:             "fake-" + fakeMintAddress,
		CollectionName: faker.Sentence(),
		CreatorName:    faker.Name(),
		Verified:       fakeBool(),
		ImageUri:       fakeImageURI(400, 400),
		NetworkId:      "fake",
		MintAddress:    fakeMintAddress,
		Volume:         volume,
		VolumeDenom:    faker.Currency(),
	}
}

func FakeNFT() *marketplacepb.NFT {
	var price string
	var denom string
	isListed := fakeBool()
	if isListed {
		price = strconv.FormatFloat(rand.Float64()*500, 'f', 2, 64)
		price = strings.TrimRight(strings.TrimRight(price, "0"), ".")
		denom = faker.Currency()
	}

	return &marketplacepb.NFT{
		Id:          "fake-" + faker.UUIDDigit(),
		Name:        faker.Sentence(),
		MintAddress: faker.UUIDDigit(),
		ImageUri:    fakeImageURI(400, 400),
		Price:       price,
		Denom:       denom,
		NetworkId:   "fake",
		IsListed:    isListed,
	}
}

func FakeActivity() *marketplacepb.Activity {
	price := strconv.FormatFloat(rand.Float64()*500, 'f', 2, 64)
	price = strings.TrimRight(strings.TrimRight(price, "0"), ".")
	t := time.Unix(faker.UnixTime(), 0)
	return &marketplacepb.Activity{
		Id:              "fake-" + faker.UUIDDigit(),
		TargetName:      faker.Sentence(),
		ContractName:    faker.Word(),
		Time:            t.Format(time.RFC3339),
		TargetImageUri:  fakeImageURI(400, 400),
		Amount:          price,
		Denom:           faker.Currency(),
		TransactionKind: faker.Word(),
		TransactionId:   faker.UUIDDigit(),
		BuyerId:         "fake-" + faker.UUIDDigit(),
		SellerId:        "fake-" + faker.UUIDDigit(),
	}
}

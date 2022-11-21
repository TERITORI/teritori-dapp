package coingeckoprices

import (
	"bytes"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	"github.com/allegro/bigcache/v3"
	"github.com/pkg/errors"
)

const baseURL = "https://api.coingecko.com/api/v3"
const vsCurrency = "usd"
const precision = "18"
const dayFormat = "02-01-2006"

var binaryEncoding = binary.BigEndian

type simplePriceResponse map[string]map[string]float64

type historicalPriceResponse struct {
	MarketData struct {
		CurrentPrice map[string]float64 `json:"current_price"`
	} `json:"market_data"`
}

type CoinGeckoPrices struct {
	historicalCache *bigcache.BigCache
	spotCache       *bigcache.BigCache
}

func NewCoinGeckoPrices() (*CoinGeckoPrices, error) {
	historicalCacheConfig := bigcache.DefaultConfig(time.Duration(0))
	historicalCacheConfig.HardMaxCacheSize = 10
	historicalCache, err := bigcache.NewBigCache(historicalCacheConfig)
	if err != nil {
		return nil, errors.Wrap(err, "failed to init historical cache")
	}

	spotCacheConfig := bigcache.DefaultConfig(time.Second * 10)
	spotCacheConfig.HardMaxCacheSize = 10
	spotCache, err := bigcache.NewBigCache(spotCacheConfig)
	if err != nil {
		return nil, errors.Wrap(err, "failed to init spot cache")
	}
	return &CoinGeckoPrices{
		historicalCache: historicalCache,
		spotCache:       spotCache,
	}, nil
}

func (cgp *CoinGeckoPrices) Spot(id string) (float64, error) {
	val, err := cgp.spotCache.Get(id)
	if err == bigcache.ErrEntryNotFound {
		vals := make(url.Values)
		vals.Set("ids", id)
		vals.Set("precision", precision)
		vals.Set("vs_currencies", vsCurrency)
		var resp simplePriceResponse
		if err := getJSON(baseURL+"/simple/price?"+vals.Encode(), &resp); err != nil {
			return 0, errors.Wrap(err, "failed to fetch simple price")
		}
		prices, ok := resp[id]
		if !ok {
			return 0, errors.New("missing id in response")
		}
		price, ok := prices[vsCurrency]
		if !ok {
			return 0, errors.New("missing vs price in response")
		}
		if err := cacheSetFloat64(cgp.spotCache, id, price); err != nil {
			return 0, errors.Wrap(err, "failed to save price to cache")
		}
		return price, nil
	}

	if err != nil {
		return 0, errors.Wrap(err, "failed to check cache")
	}

	price, err := unmarshalFloat64(val)
	if err != nil {
		return 0, errors.Wrap(err, "failed to unmarshal price from cache")
	}

	return price, nil
}

func (cgp *CoinGeckoPrices) Historical(id string, t time.Time) (float64, error) {
	tDay := t.In(time.UTC).Format(dayFormat)
	nowDay := time.Now().In(time.UTC).Format(dayFormat)
	if nowDay == tDay {
		price, err := cgp.Spot(id)
		if err != nil {
			return 0, errors.Wrap(err, "failed to get spot price")
		}
		return price, nil
	}

	cacheKey := id + "-" + tDay
	val, err := cgp.historicalCache.Get(cacheKey)
	if err == bigcache.ErrEntryNotFound {
		vals := make(url.Values)
		vals.Set("date", tDay)
		vals.Set("localization", "false")

		var resp historicalPriceResponse
		if err := getJSON(baseURL+"/coins/"+id+"/history?"+vals.Encode(), &resp); err != nil {
			return 0, errors.Wrap(err, "failed to fetch historical price")
		}

		var ok bool
		price, ok := resp.MarketData.CurrentPrice[vsCurrency]
		if !ok {
			price = 0
		}

		if err := cacheSetFloat64(cgp.historicalCache, id, price); err != nil {
			return 0, errors.Wrap(err, "failed to save price to cache")
		}

		return price, nil
	}

	if err != nil {
		return 0, errors.Wrap(err, "failed to check cache")
	}

	price, err := unmarshalFloat64(val)
	if err != nil {
		return 0, errors.Wrap(err, "failed to unmarshal price from cache")
	}

	return price, nil
}

type OHLC struct {
	Time  time.Time
	Open  float64
	High  float64
	Low   float64
	Close float64
}

func (cgp *CoinGeckoPrices) OHLC(id string, days uint64) ([]*OHLC, error) {
	vals := make(url.Values)
	vals.Set("vs_currency", vsCurrency)
	vals.Set("days", fmt.Sprintf("%d", days))

	var resp [][]float64
	if err := getJSON(baseURL+"/coins/"+id+"/ohlc?"+vals.Encode(), &resp); err != nil {
		return nil, errors.Wrap(err, "failed to fetch ohlc")
	}

	// FIXME: parse time as uint64

	ret := make([]*OHLC, len(resp))
	for i, raw := range resp {
		if len(raw) != 5 {
			return nil, errors.New("invalid response shape")
		}

		t := time.UnixMilli(int64(raw[0]))

		ret[i] = &OHLC{
			Time:  t,
			Open:  raw[1],
			High:  raw[2],
			Low:   raw[3],
			Close: raw[4],
		}
	}

	return ret, nil
}

func getJSON(u string, v interface{}) error {
	resp, err := http.Get(u)
	if err != nil {
		return errors.Wrap(err, "failed to http get")
	}
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("invalid response code %s", resp.Status)
	}
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return errors.Wrap(err, "failed to read response body")
	}
	if err := json.Unmarshal(bodyBytes, v); err != nil {
		return errors.Wrap(err, "failed to unmarshal json")
	}
	return nil
}

func unmarshalFloat64(b []byte) (float64, error) {
	buf := bytes.NewReader(b)
	var fval float64
	if err := binary.Read(buf, binaryEncoding, &fval); err != nil {
		return 0, errors.Wrap(err, "failed to unmarshal binary float64")
	}
	return fval, nil
}

func cacheSetFloat64(cache *bigcache.BigCache, key string, val float64) error {
	buf := bytes.NewBuffer(nil)
	if err := binary.Write(buf, binaryEncoding, val); err != nil {
		return errors.Wrap(err, "failed to write binary float64 to buffer")
	}
	if err := cache.Set(key, buf.Bytes()); err != nil {
		return errors.Wrap(err, "failed to populate cache")
	}
	return nil
}

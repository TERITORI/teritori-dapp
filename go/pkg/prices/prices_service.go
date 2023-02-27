package prices

import (
	"context"
	"database/sql"
	"time"

	"github.com/pkg/errors"

	"github.com/TERITORI/teritori-dapp/go/pkg/prices_db"
	"github.com/TERITORI/teritori-dapp/go/pkg/pricespb"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type PricesService struct {
	pricespb.UnimplementedPricesServiceServer

	db *sql.DB
}

func NewPricesService(db *sql.DB) (*PricesService, error) {
	if db == nil {
		return nil, errors.New("nil db")
	}
	return &PricesService{db: db}, nil
}

func (s *PricesService) Prices(ctx context.Context, req *pricespb.PricesRequest) (*pricespb.PricesResponse, error) {
	id := req.GetId()
	if id == "" {
		return nil, errors.New("missing id")
	}

	t, err := time.Parse(time.RFC3339, req.GetTime())
	if err != nil {
		return nil, errors.Wrap(err, "invalid time")
	}

	price, err := prices_db.Prices(
		qm.Where("currency = ? AND timestamp <= ?", id, t),
		qm.OrderBy("timestamp DESC"),
		qm.Limit(1),
	).One(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err, "failed to query")
	}

	// we ignore the "ok" part because an aproximation is enough
	fUSD, _ := price.Usd.Float64()

	return &pricespb.PricesResponse{Prices: []*pricespb.Price{
		{
			Id:    "usd",
			Value: fUSD,
		},
	}}, nil
}

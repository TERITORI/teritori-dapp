package sellerprofile

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/sellerprofilepb"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type SellerProfileService struct {
	sellerprofilepb.UnimplementedSellerprofileServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewSellerProfileService(ctx context.Context, conf *Config) sellerprofilepb.SellerprofileServiceServer {
	// FIXME: validate config
	return &SellerProfileService{
		conf: conf,
	}
}

func (s *SellerProfileService) UpdateSellerProfile(req *sellerprofilepb.SellerProfileRequest, srv sellerprofilepb.SellerprofileService_UpdateProfileServer) error {
	sellerId := req.SellerId
	profileHash := req.ProfileHash

	var sellerProfile indexerdb.SellerProfile
	result := s.conf.IndexerDB.First(&sellerProfile, sellerId)
	if result.Error == nil {
		s.conf.IndexerDB.Create(&indexerdb.SellerProfile{
			SellerId:    uint64(sellerId),
			ProfileHash: profileHash,
		})
	} else {
		sellerProfile.ProfileHash = profileHash
		s.conf.IndexerDB.Save(&sellerProfile)
	}

	srv.Send(&sellerprofilepb.SellerProfileResponse{
		Result: 0,
	})
	return nil
}

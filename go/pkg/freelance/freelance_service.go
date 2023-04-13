package freelance

import (
	"context"
  "github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/freelancepb"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"github.com/pkg/errors"
)

type FreelanceService struct {
	freelancepb.UnimplementedFreelanceServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewFreelanceService(ctx context.Context, conf *Config) freelancepb.FreelanceServiceServer {
	// FIXME: validate config
	return &FreelanceService{
		conf: conf,
	}
}

func (s *FreelanceService) Report(ctx context.Context, req *freelancepb.ReportRequest) (*freelancepb.ReportResponse, error) {
	desc := req.Desc
	ref_url := req.RefUrl
	s.conf.IndexerDB.Create(&indexerdb.Report{
		Desc:   desc,
		RefUrl: ref_url,
	})
	return &freelancepb.ReportResponse{	Result: 1 }, nil
}

func (s *FreelanceService) UpdateProfile(ctx context.Context, req *freelancepb.SellerProfileRequest) (*freelancepb.SellerProfileResponse, error) {
    sellerId := req.UserId
  	profileHash := req.ProfileHash

  	var sellerProfile indexerdb.SellerProfile
  	result := s.conf.IndexerDB.First(&sellerProfile, sellerId)
  	if result.Error == nil {
  		s.conf.IndexerDB.Create(&indexerdb.SellerProfile{
  			SellerId:    sellerId,
  			ProfileHash: profileHash,
  		})
  	} else {
  		sellerProfile.ProfileHash = profileHash
  		s.conf.IndexerDB.Save(&sellerProfile)
  	}
    return &freelancepb.SellerProfileResponse{	Result: 1 }, nil
}

func (s *FreelanceService) AddGig(ctx context.Context, req *freelancepb.GigAddRequest) (*freelancepb.GigAddResponse, error) {
    userAddress := req.GetAddress()
  	jsonData := req.GetData()

  	s.conf.IndexerDB.Create(&indexerdb.Gig{
  			Address:    userAddress,
  			Data: jsonData,
  	})

    return &freelancepb.GigAddResponse{	Result: 1 }, nil
}

func (s *FreelanceService) GigList(ctx context.Context, req *freelancepb.GigListRequest) (*freelancepb.GigListResponse, error) {
    limit := req.GetLimit()
    if limit <= 0 {
    		return nil, errors.New("limit must be a positive number")
    }
    offset := req.GetOffset()
    if offset < 0 {
    		return nil, errors.New("offset must be greater or equal to 0")
    }
    var gigs []*freelancepb.GigInfo
    //var gig_infos []indexerdb.Gig
    s.conf.IndexerDB.Model(&indexerdb.Gig{}).Limit(int(limit)).Offset(int(offset)).Scan(&gigs)
    return &freelancepb.GigListResponse{Gigs: gigs}, nil
}

func (s *FreelanceService) GigListUser(ctx context.Context, req *freelancepb.GigListUserRequest) (*freelancepb.GigListResponse, error) {
  var gigs []*freelancepb.GigInfo
  //var gig_infos []indexerdb.Gig
  s.conf.IndexerDB.Model(&indexerdb.Gig{}).Where("address = ?", req.Address).Scan(&gigs)
  return &freelancepb.GigListResponse{Gigs: gigs}, nil
}

func (s *FreelanceService) GigData(ctx context.Context, req *freelancepb.GigDataRequest) (*freelancepb.GigResponse, error) {
  id := req.GetId()
  if id < 0 {
    return nil, errors.New("offset must be greater or equal to 0")
  }
  var gig indexerdb.Gig
  if result := s.conf.IndexerDB.First(&gig, id); result.Error != nil {
    return nil, errors.New("failed to fetch gig")
  }

  return &freelancepb.GigResponse{Gig: &freelancepb.GigInfo{
    Id: int32(gig.Id),
    Address:  gig.Address,
    Data: gig.Data,
  }}, nil
}



package freelance

import (
	"context"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/freelancepb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
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
func (s *FreelanceService) SellerProfile(ctx context.Context, req *freelancepb.SellerProfileRequest) (*freelancepb.SellerProfileResponse, error) {

	var sellerProfile indexerdb.SellerProfile
	if err := s.conf.IndexerDB.
		Model(&indexerdb.SellerProfile{}).
		Where("seller_address = ?", req.SellerAddress).
		First(&sellerProfile).Error; err != nil {
		return nil, errors.Wrap(err, "Failed to get seller_profile_ipfs_hash")
	}

	return &freelancepb.SellerProfileResponse{
		SellerAddress: sellerProfile.SellerAddress,
		Ipfs:          sellerProfile.Ipfs,
		IsActive:      sellerProfile.IsActive,
	}, nil
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

func (s *FreelanceService) GigListUser(ctx context.Context, req *freelancepb.GigListUserRequest) (*freelancepb.GigListUserResponse, error) {
	var gigs []*freelancepb.GigInfo
	//var gig_infos []indexerdb.Gig
	s.conf.IndexerDB.Model(&indexerdb.Gig{}).Where("address = ?", req.Address).Scan(&gigs)
	return &freelancepb.GigListUserResponse{Gigs: gigs}, nil
}

func (s *FreelanceService) GigData(ctx context.Context, req *freelancepb.GigDataRequest) (*freelancepb.GigDataResponse, error) {
	id := req.GetId()
	if id < 0 {
		return nil, errors.New("offset must be greater or equal to 0")
	}
	var gig indexerdb.Gig
	if result := s.conf.IndexerDB.First(&gig, id); result.Error != nil {
		return nil, errors.New("failed to fetch gig")
	}

	return &freelancepb.GigDataResponse{Gig: &freelancepb.GigInfo{
		Id:      int32(gig.Id),
		Address: gig.Address,
		GigData: gig.GigData,
	}}, nil
}

func (s *FreelanceService) EscrowAllList(ctx context.Context, req *freelancepb.EscrowAllListRequest) (*freelancepb.EscrowAllListResponse, error) {
	address := req.GetAddress()
	if address == "" {
		return nil, errors.New("address's length must be greater than 0")
	}
	var escrows []*freelancepb.EscrowInfo

	if result := s.conf.IndexerDB.
		Model(&indexerdb.Escrow{}).
		Where("sender = ? or receiver = ?", address, address).
		Scan(&escrows); result.Error != nil {
		return nil, errors.New("fatiled to fetch escrows")
	}
	return &freelancepb.EscrowAllListResponse{
		Escrows: escrows,
	}, nil
}

func (s *FreelanceService) EscrowSenderList(ctx context.Context, req *freelancepb.EscrowSenderListRequest) (*freelancepb.EscrowSenderListResponse, error) {
	address := req.GetAddress()
	if address == "" {
		return nil, errors.New("address's length must be greater than 0")
	}
	var escrows []*freelancepb.EscrowInfo

	if result := s.conf.IndexerDB.
		Model(&indexerdb.Escrow{}).
		Where("sender = ?", address).
		Scan(&escrows); result.Error != nil {
		return nil, errors.New("fatiled to fetch escrows")
	}
	return &freelancepb.EscrowSenderListResponse{
		Escrows: escrows,
	}, nil
}

func (s *FreelanceService) EscrowReceiverList(ctx context.Context, req *freelancepb.EscrowReceiverListRequest) (*freelancepb.EscrowReceiverListResponse, error) {
	address := req.GetAddress()
	if address == "" {
		return nil, errors.New("address's length must be greater than 0")
	}
	var escrows []*freelancepb.EscrowInfo

	if result := s.conf.IndexerDB.
		Model(&indexerdb.Escrow{}).
		Where("receiver = ?", address).
		Scan(&escrows); result.Error != nil {
		return nil, errors.New("fatiled to fetch escrows")
	}
	return &freelancepb.EscrowReceiverListResponse{
		Escrows: escrows,
	}, nil
}

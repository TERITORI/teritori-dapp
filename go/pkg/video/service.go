package video

import (
	"context"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/videopb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type VideoService struct {
	videopb.UnimplementedVideoServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewVideoService(ctx context.Context, conf *Config) videopb.VideoServiceServer {
	return &VideoService{
		conf: conf,
	}
}

func (s *VideoService) GetVideoList(ctx context.Context, req *videopb.GetVideoListRequest) (*videopb.GetVideoListResponse, error) {
	limit := req.GetLimit()
	if limit <= 0 {
		limit = 10
	}
	offset := req.GetOffset()
	if offset <= 0 {
		offset = 0
	}

	var videos []*videopb.VideoInfo
	if err := s.conf.IndexerDB.
		Model(&indexerdb.Video{}).
		Where("is_deleted = ?", false).
		Order("created_at desc").
		Limit(int(limit)).
		Offset(int(offset)).
		Scan(&videos).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &videopb.GetVideoListResponse{VideoInfos: videos}, nil
}
func (s *VideoService) GetVideoListForLibrary(ctx context.Context, req *videopb.GetVideoListForLibraryRequest) (*videopb.GetVideoListForLibraryResponse, error) {
	var videos []*videopb.VideoInfo
	if err := s.conf.IndexerDB.
		Model(&indexerdb.VideoLibrary{}).
		Joins("left join video video on video.identifier = video_library.identifier").
		Where("video_library.owner = ? ", req.User).
		Where("video.is_deleted = ?", false).
		Scan(&videos).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &videopb.GetVideoListForLibraryResponse{VideoInfos: videos}, nil
}

func (s *VideoService) GetUserVideoList(ctx context.Context, req *videopb.GetUserVideoListRequest) (*videopb.GetUserVideoListResponse, error) {
	limit := req.GetLimit()
	if limit <= 0 {
		limit = 10
	}
	offset := req.GetOffset()
	if offset <= 0 {
		offset = 0
	}
	var videos []*videopb.VideoInfo
	if err := s.conf.IndexerDB.
		Model(&indexerdb.Video{}).
		Where("created_by = ?", req.GetCreatedBy()).
		Where("is_deleted = ?", false).
		Order("created_at desc").
		Limit(int(limit)).
		Offset(int(offset)).
		Scan(&videos).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &videopb.GetUserVideoListResponse{VideoInfos: videos}, nil
}

func (s *VideoService) GetVideo(ctx context.Context, req *videopb.GetVideoRequest) (*videopb.GetVideoResponse, error) {
	id := req.GetIdentifier()
	var video videopb.VideoInfo
	if err := s.conf.IndexerDB.Model(&indexerdb.Video{}).
		Where("identifier = ?", id).
		Scan(&video).Error; err != nil {
		return nil, errors.New("failed to fetch video")
	}
	return &videopb.GetVideoResponse{VideoInfo: &video}, nil
}

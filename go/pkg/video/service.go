package video

import (
	"context"

	"time"

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

func (s *VideoService) IncreaseViewCount(ctx context.Context, req *videopb.IncreaseViewCountRequest) (*videopb.IncreaseViewCountResponse, error) {
	id := req.GetIdentifier()
	user := req.GetUser()
	var c int64
	s.conf.IndexerDB.Model(&indexerdb.VideoViewCount{}).
		Where("identifier = ? and view_user = ?", id, user).Count(&c)
	if c != 0 {
		return &videopb.IncreaseViewCountResponse{Res: 0}, nil
	}
	view := indexerdb.VideoViewCount{
		Identifier: id,
		ViewUser:   user,
	}
	if err := s.conf.IndexerDB.Create(&view).Error; err != nil {
		return &videopb.IncreaseViewCountResponse{Res: 0}, nil
	}
	var video indexerdb.Video
	s.conf.IndexerDB.Model(&indexerdb.Video{}).
		Where("identifier = ?", id).Find(&video)
	video.ViewCount += 1
	video.LastView = time.Now().Unix()
	s.conf.IndexerDB.Save(&video)

	return &videopb.IncreaseViewCountResponse{Res: 0}, nil
}

package musicplayer

import (
	"context"
	"encoding/json"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/musicplayerpb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type MusicplayerService struct {
	musicplayerpb.UnimplementedMusicplayerServiceServer
	conf *Config
}

type Config struct {
	Logger    *zap.Logger
	IndexerDB *gorm.DB
}

func NewMusicplayerService(ctx context.Context, conf *Config) musicplayerpb.MusicplayerServiceServer {
	return &MusicplayerService{
		conf: conf,
	}
}

func (s *MusicplayerService) GetAllAlbumList(ctx context.Context, req *musicplayerpb.GetAllAlbumListRequest) (*musicplayerpb.GetAllAlbumListResponse, error) {
	limit := req.GetLimit()
	if limit <= 0 {
		limit = 10
	}
	offset := req.GetOffset()
	if offset <= 0 {
		offset = 0
	}

	var albums []*musicplayerpb.MusicAlbumInfo
	if err := s.conf.IndexerDB.
		Model(&indexerdb.MusicAlbum{}).
		Where("is_deleted = ?", false).
		Order("created_at desc").
		Limit(int(limit)).
		Offset(int(offset)).
		Scan(&albums).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &musicplayerpb.GetAllAlbumListResponse{MusicAlbums: albums}, nil
}
func (s *MusicplayerService) GetAlbumIdListForLibrary(ctx context.Context, req *musicplayerpb.GetAlbumIdListForLibraryRequest) (*musicplayerpb.GetAlbumIdListForLibraryResponse, error) {
	var albumLibraryInfos []*musicplayerpb.AlbumLibraryInfo
	if err := s.conf.IndexerDB.
		Model(&indexerdb.MusicLibrary{}).
		Where("owner = ? ", req.User).
		Scan(&albumLibraryInfos).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &musicplayerpb.GetAlbumIdListForLibraryResponse{AlbumLibraries: albumLibraryInfos}, nil
}

func (s *MusicplayerService) GetOtherAlbumList(ctx context.Context, req *musicplayerpb.GetOtherAlbumListRequest) (*musicplayerpb.GetOtherAlbumListResponse, error) {
	limit := req.GetLimit()
	if limit <= 0 {
		limit = 10
	}
	offset := req.GetOffset()
	if offset <= 0 {
		offset = 0
	}
	var albums []*musicplayerpb.MusicAlbumInfo
	if err := s.conf.IndexerDB.
		Model(&indexerdb.MusicAlbum{}).
		Where("identifier in (?)", req.IdList).
		Where("is_deleted = ?", false).
		Order("created_at desc").
		Limit(int(limit)).
		Offset(int(offset)).
		Scan(&albums).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &musicplayerpb.GetOtherAlbumListResponse{MusicAlbums: albums}, nil
}

func (s *MusicplayerService) GetUserAlbumList(ctx context.Context, req *musicplayerpb.GetUserAlbumListRequest) (*musicplayerpb.GetUserAlbumListResponse, error) {
	limit := req.GetLimit()
	if limit <= 0 {
		limit = 10
	}
	offset := req.GetOffset()
	if offset <= 0 {
		offset = 0
	}
	var albums []*musicplayerpb.MusicAlbumInfo
	if err := s.conf.IndexerDB.
		Model(&indexerdb.MusicAlbum{}).
		Where("created_by = ?", req.GetCreatedBy()).
		Where("is_deleted = ?", false).
		Order("created_at desc").
		Limit(int(limit)).
		Offset(int(offset)).
		Scan(&albums).Error; err != nil {
		return nil, errors.Wrap(err, "failed to query database")
	}
	return &musicplayerpb.GetUserAlbumListResponse{MusicAlbums: albums}, nil
}

func (s *MusicplayerService) GetAlbum(ctx context.Context, req *musicplayerpb.GetAlbumRequest) (*musicplayerpb.GetAlbumResponse, error) {
	id := req.GetIdentifier()
	var album indexerdb.MusicAlbum
	if result := s.conf.IndexerDB.First(&album, "identifier = ?", id); result.Error != nil {
		return nil, errors.New("failed to fetch album")
	}
	metadata, err := json.Marshal(album.Metadata)
	if err != nil {
		return nil, err
	}
	return &musicplayerpb.GetAlbumResponse{
		MusicAlbum: &musicplayerpb.MusicAlbumInfo{
			Identifier: album.Identifier,
			Metadata:   string(metadata),
			CreatedBy:  string(album.CreatedBy),
		},
	}, nil
}

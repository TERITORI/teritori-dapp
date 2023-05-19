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

func (s *MusicplayerService) GetAlbumList(ctx context.Context, req *musicplayerpb.GetAlbumListRequest) (*musicplayerpb.GetAlbumListResponse, error) {
	var albums []*musicplayerpb.MusicAlbumInfo
	s.conf.IndexerDB.Model(&indexerdb.MusicAlbum{}).Order("created_at desc").Scan(&albums)
	return &musicplayerpb.GetAlbumListResponse{MusicAlbums: albums}, nil
}

func (s *MusicplayerService) GetAlbum(ctx context.Context, req *musicplayerpb.GetAlbumRequest) (*musicplayerpb.GetAlbumResponse, error) {
	id := req.GetIdentifier()
	var album indexerdb.MusicAlbum
	if result := s.conf.IndexerDB.First(&album, id); result.Error != nil {
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
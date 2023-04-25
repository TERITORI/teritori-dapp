package musicplayer

import (
	"context"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/musicplayerpb"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"github.com/pkg/errors"
)

type MusicplayerService struct {
	musicplayerpb.UnimplementedMusicplayerServiceServer
	conf *Config
}

type Config struct {
	Logger *zap.Logger
	IndexerDB *gorm.DB
}

func NewMusicplayerService(ctx context.Context, conf *Config) musicplayerpb.MusicplayerServiceServer {
	return &MusicplayerService{
		conf: conf,
	}
}

func (s *MusicplayerService) UploadAlbum(ctx context.Context, req *musicplayerpb.UploadAlbumRequest) (*musicplayerpb.UploadAlbumResponse, error) {
	music_album := indexerdb.MusicAlbum {
		Name: req.Name,
		Description: req.Description,
		Image: req.Image,
	}
	s.conf.IndexerDB.Create(&music_album)
	return &musicplayerpb.UploadAlbumResponse{
		Result: int32(music_album.ID),
	}, nil
}

func (s *MusicplayerService) UploadMusic(ctx context.Context, req *musicplayerpb.UploadMusicRequest) (*musicplayerpb.UploadMusicResponse, error) {
	var musicFile indexerdb.MusicFile

	result := s.conf.IndexerDB.Where("album_id = ?", req.AlbumId).Order("file_id desc").First(&musicFile)
	var lastId uint32
	if result.Error != nil {
		lastId = 0
	}else {
		lastId = musicFile.FileId + 1	
	}
	
	music_file := indexerdb.MusicFile {
		AlbumId: req.AlbumId,
		FileId: lastId,
		Name: req.Name,
		Duration: req.Duration,
		Ipfs: req.Ipfs,
	}
	if err := s.conf.IndexerDB.Create(&music_file).Error; err != nil {
		return nil, errors.Wrap(err, "Failed to store musicfile")
	}
	return &musicplayerpb.UploadMusicResponse{
		Result: int32(lastId),
	}, nil
}

func (s *MusicplayerService) GetAlbumList(ctx context.Context, req *musicplayerpb.GetAlbumListRequest) (*musicplayerpb.GetAlbumListResponse, error) {
	var albums []*musicplayerpb.AlbumShortInfo
	s.conf.IndexerDB.Model(&indexerdb.MusicAlbum{}).Order("id desc").Scan(&albums)
	return &musicplayerpb.GetAlbumListResponse{ Albums: albums}, nil
}

func (s *MusicplayerService) GetAlbum(ctx context.Context, req *musicplayerpb.GetAlbumRequest) (*musicplayerpb.GetAlbumResponse, error) {
	id := req.GetId()
	if id < 0 {
		return nil, errors.New("id must be greater or equal to 0")
	}
	var album indexerdb.MusicAlbum
	if result := s.conf.IndexerDB.First(&album, id); result.Error != nil {
		return nil, errors.New("failed to fetch album")
	}

	var musicFiles []*musicplayerpb.MusicFileInfo
	s.conf.IndexerDB.Model(&indexerdb.MusicFile{}).Where("album_id = ?", id).Scan(&musicFiles)
	return &musicplayerpb.GetAlbumResponse {
		Album: &musicplayerpb.AlbumInfo{
			Id: album.ID,
			Name: album.Name,
			Description: album.Description,
			Image: album.Image,
			Musics: musicFiles,
		},
	}, nil
}
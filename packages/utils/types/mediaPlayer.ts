import { MusicAlbumInfo } from "../../api/musicplayer/v1/musicplayer";

export interface AlbumMetadataInfo {
  title: string;
  description: string;
  image: string;
  audios: MetadataAudio[];
}

export interface MetadataAudio {
  duration: number;
  ipfs: string;
  name: string;
}

export interface AlbumInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  createdBy: string;
  audios: Media[];
}

// TODO: Audio and Video ?
export interface Media {
  imageUrl?: string;
  name: string;
  createdBy: string;
  fileUrl: string;
  duration?: number;
  albumId?: string;
  postId?: string;
}

export enum PlayType {
  LOOP = 0,
  LOOP_OFF = 1,
}

export const musicAlbumInfoToAlbumInfo = (musicAlbumInfo: MusicAlbumInfo) => {
  const metadata = JSON.parse(musicAlbumInfo.metadata) as AlbumMetadataInfo;
  const albumInfo: AlbumInfo = {
    id: musicAlbumInfo.identifier,
    description: metadata.description,
    image: metadata.image,
    createdBy: musicAlbumInfo.createdBy,
    name: metadata.title,
    audios: metadata.audios.map((a) => {
      return {
        duration: a.duration,
        imageUrl: metadata.image,
        name: a.name,
        fileUrl: a.ipfs,
        createdBy: musicAlbumInfo.createdBy,
        albumId: musicAlbumInfo.identifier,
      };
    }),
  };
  return albumInfo;
};

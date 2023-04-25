export interface AlbumShortInfo {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface UploadFileInfo {
  name: string;
  ipfs: string;
}
export interface MusicInfo {
  album_id: number;
  file_id: number;
  name: string;
  duration: number;
  ipfs: string;
}
export interface AlbumInfo {
  id: number;
  name: string;
  description: string;
  image: string;
  musics: MusicInfo[];
}

export interface AlbumMetadataInfo {
  title: string;
  description: string;
  image: string;
  audios: UploadFileInfo[];
}

export interface UploadFileInfo {
  name: string;
  ipfs: string;
  duration: number;
}
export interface AlbumInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  createdBy: string;
  audios: UploadFileInfo[];
}

export enum PlayType {
  LOOP = 0,
  LOOP_OFF = 1,
}

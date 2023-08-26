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
  id?: string;
  name: string;
  description: string;
  image: string;
  createdBy: string;
  audios: Media[];
}

export interface Media {
  imageUrl?: string;
  name: string;
  createdBy: string;
  fileUrl: string;
  duration?: number;
}

export enum PlayType {
  LOOP = 0,
  LOOP_OFF = 1,
}

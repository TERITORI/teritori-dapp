export interface VideoMetaInfo {
  title: string;
  description: string;
  url: string; // ipfs
  image: string; // ipfs
  duration: number;
}

export interface VideoInfoWithMeta {
  id: string;
  videoMetaInfo: VideoMetaInfo;
  createdBy: string;
  createdAt: number;
  viewCount: number;
  like: number;
  dislike: number;
  viewLastTimestamp: number;
}

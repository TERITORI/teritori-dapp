export interface VideoMetaInfo {
  title: string;
  description: string;
  url: string; // ipfs
  image: string; // ipfs
  duration: number;
}

export interface VideoInfoWithMeta {
  identifier: string;
  videoMetaInfo: VideoMetaInfo;
  createdBy: string;
  viewCount: number;
  like: number;
  dislike: number;
  viewLastTimestamp: number;
}






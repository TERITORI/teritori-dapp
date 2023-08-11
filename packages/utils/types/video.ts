export interface VideoMetaInfo {
  title: string;
  description: string;
  url: string; // ipfs
  coverImage: string; //ipfs
  duration: number;
}

export interface VideoInfoWithMeta {
  identifier: string;
  videoMetaInfo: VideoMetaInfo;
  createdBy: string;
  createdAt: string;
  viewCount: number;
}

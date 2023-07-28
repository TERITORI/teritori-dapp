export interface VideoMetaInfo {
    title: string;
    description: string;
    url: string;   // ipfs
    image: string  // ipfs
}

export interface VideoInfoWithMeta {
  identifier: string;
  videoMetaInfo: VideoMetaInfo;
  createdBy: string;
  viewCount: number;
  viewLastTimestamp: number;
}






export interface Media {
  id?: string;
  imageUrl?: string;
  name: string;
  createdBy: string;
  fileUrl: string;
  duration?: number;
  albumId?: string;
  postId?: string;
  isVideo?: boolean;
}

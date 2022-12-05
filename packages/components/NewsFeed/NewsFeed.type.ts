export enum PostCategory {
  Reaction,
  Comment,
  Normal,
  Article,
  Picture,
  Audio,
  Video,
}

export interface NewPostFormValues {
  title?: string;
  message: string;
  file?: File;
}

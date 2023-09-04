import { EntityInstance } from "draft-js";

import { LocalFileData, RemoteFileData } from "../../../utils/types/files";

export type PublishValues = {
  hashtags: string[];
  mentions: string[];
  images: LocalFileData[];
  gifs: string[];
  audios: LocalFileData[];
  videos: LocalFileData[];
  html: string;
};

export type SelectedEntity = {
  blockKey: string;
  entityKey: string;
  entity: EntityInstance;
};
export type FoundEntity = SelectedEntity & { start: number; end: number };

export interface RichTextProps {
  initialValue: string;
  // We need to pass audios since we can't render audio preview in RichText
  audioFiles?: RemoteFileData[];
  onChange?: (text: string) => void;
  onBlur?: () => void;
  isPostConsultation?: boolean;
  isPreview?: boolean;
  onPublish?: (publishValues: PublishValues) => void;
  publishDisabled?: boolean;
  loading?: boolean;
  authorId: string;
  postId: string;
}

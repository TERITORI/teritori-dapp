import { LocalFileData, RemoteFileData } from "../../../utils/types/feed";
import { PublishButtonProps } from "./PublishButton";

export interface RichTextProps {
  onImageUpload?: (file: LocalFileData) => void;
  onAudioUpload?: (file: LocalFileData) => void;
  onAudioRemove?: (file: LocalFileData) => void;
  onAudioUpdate?: (file: LocalFileData) => void;
  onVideoUpload?: (file: LocalFileData) => void;
  onGIFSelected?: (gifUrl: string | null) => void;
  isGIFSelectorDisabled?: boolean;
  isAudioUploadDisabled?: boolean;
  isVideoUploadDisabled?: boolean;
  // We need to pass audios since we can't render audio preview in RichText
  audioFiles?: RemoteFileData[];
  onChange?: (
    // TODO: text useless ?
    text: string,
    hashtags?: string[],
    mentions?: string[]
  ) => void;
  onBlur?: () => void;
  initialValue?: string;
  isPostConsultation?: boolean;
  publishButtonProps?: PublishButtonProps;
}

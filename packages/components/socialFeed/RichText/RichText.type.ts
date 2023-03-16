import { SelectionState } from "draft-js";

import { OpenGraphType } from "../../../hooks/feed/types";
import { LocalFileData } from "../../../utils/types/feed";
import { PublishButtonProps } from "./PublishButton";

export interface RichTextProps {
  onImageUpload?: (files: LocalFileData[]) => void;
  onAudioUpload?: (files: LocalFileData[]) => void;
  onVideoUpload?: (files: LocalFileData[]) => void;
  onGIFSelected?: (gifUrl: string | null) => void;
  onEmojiSelected?: (selection: SelectionState, emoji: string | null) => void;
  isGIFSelectorDisabled?: boolean;
  isAudioUploadDisabled?: boolean;
  isVideoUploadDisabled?: boolean;
  onChange?: (text: string, hashtags?: string[]) => void;
  onBlur?: () => void;
  initialValue?: string;
  readOnly?: boolean;
  openGraph?: OpenGraphType;
  // allowTruncation?: boolean;
  publishButtonProps?: PublishButtonProps;
}

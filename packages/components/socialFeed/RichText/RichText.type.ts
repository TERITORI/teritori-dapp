import { OpenGraphType } from "../../../hooks/feed/types";
import { LocalFileData } from "../../../utils/types/feed";
import { PublishButtonProps } from "./PublishButton";

export interface RichTextProps {
  onChange?: (text: string, hashtags?: string[]) => void;
  onBlur?: () => void;
  onImageUpload?: (image: LocalFileData) => void;
  initialValue?: string;
  readOnly?: boolean;
  openGraph?: OpenGraphType;
  allowTruncation?: boolean;
  publishButtonProps?: PublishButtonProps;
}

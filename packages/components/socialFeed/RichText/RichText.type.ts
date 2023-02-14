import { OpenGraphType } from "../../../hooks/feed/types";
import { PublishButtonProps } from "./PublishButton";

export interface RichTextProps {
  onChange?: (text: string, hashtags?: string[]) => void;
  onBlur?: () => void;
  initialValue?: string;
  readOnly?: boolean;
  openGraph?: OpenGraphType;
  allowTruncation?: boolean;
  publishButtonProps: PublishButtonProps;
}

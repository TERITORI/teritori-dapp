import { OpenGraphType } from "../../hooks/feed/types";

export interface RichTextProps {
  onChange?: (text: string, hashtags?: string[]) => void;
  onBlur?: () => void;
  initialValue?: string;
  readOnly?: boolean;
  staticToolbar?: boolean;
  openGraph?: OpenGraphType;
  allowTruncation?: boolean;
}

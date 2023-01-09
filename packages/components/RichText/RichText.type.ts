import { OpenGraphType } from "../../hooks/feed/types";

export interface RichTextProps {
  onChange?: (text: string) => void;
  onBlur?: () => void;
  initialValue?: string;
  readOnly?: boolean;
  staticToolbar?: boolean;
  openGraph?: OpenGraphType;
}

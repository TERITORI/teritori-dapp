export interface RichTextProps {
  onChange?: (text: string) => void;
  onBlur?: () => void;
  initialValue?: string;
  readOnly?: boolean;
  staticToolbar?: boolean;
}

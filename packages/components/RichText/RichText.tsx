import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

interface RichTextProps {
  onChange?: (text: string) => void;
  initialValue?: string;
  readOnly?: boolean;
}
export const RichText = ({ onChange = () => {} }: RichTextProps) => {
  const richText = React.useRef(null);
  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <RichEditor ref={richText} onChange={onChange} />
      </KeyboardAvoidingView>
      <RichToolbar
        editor={richText}
        actions={[actions.setBold, actions.setItalic, actions.setUnderline]}
      />
    </View>
  );
};

import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import { RichTextProps } from "./RichText.type";

export const RichText = ({ onChange = () => {}, onBlur }: RichTextProps) => {
  const richText = React.useRef(null);
  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <RichEditor ref={richText} onChange={onChange} onBlur={onBlur} />
      </KeyboardAvoidingView>
      <RichToolbar
        editor={richText}
        actions={[actions.setBold, actions.setItalic, actions.setUnderline]}
      />
    </View>
  );
};

import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import { ActionsContainer } from "./ActionsContainer";
import { PublishButton } from "./PublishButton";
import { RichTextProps } from "./RichText.type";
import { ToolbarContainer } from "./ToolbarContainer";

export const RichText: React.FC<RichTextProps> = ({
  onChange = () => {},
  onBlur,
  readOnly,
  publishButtonProps,
}) => {
  const richText = React.useRef(null);
  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <RichEditor ref={richText} onChange={onChange} onBlur={onBlur} />
      </KeyboardAvoidingView>

      <ActionsContainer readOnly={readOnly}>
        <ToolbarContainer>
          <RichToolbar
            editor={richText}
            actions={[actions.setBold, actions.setItalic, actions.setUnderline]}
          />
        </ToolbarContainer>
        <PublishButton {...publishButtonProps} />
      </ActionsContainer>
    </View>
  );
};

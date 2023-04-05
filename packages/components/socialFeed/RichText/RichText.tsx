import React, { useRef } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import { RichTextProps } from "./RichText.type";
import { ActionsContainer } from "./Toolbar/ActionsContainer";
import { ToolbarContainer } from "./ToolbarContainer";
import { PrimaryButton } from "../../buttons/PrimaryButton";

// /!\ It will not fully work on mobile

export const RichText: React.FC<RichTextProps> = ({
  onChange = () => {},
  onBlur,
  publishDisabled,
  loading,
  isPostConsultation,
}) => {
  const richText = useRef(null);
  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <RichEditor ref={richText} onChange={onChange} onBlur={onBlur} />
      </KeyboardAvoidingView>

      {!isPostConsultation && (
        <ActionsContainer>
          <ToolbarContainer>
            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
              ]}
            />
          </ToolbarContainer>
          <PrimaryButton
            disabled={publishDisabled}
            isLoading={loading}
            loader
            text="Publish"
            size="M"
          />
        </ActionsContainer>
      )}
    </View>
  );
};

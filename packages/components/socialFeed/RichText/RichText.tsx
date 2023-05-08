import React, { useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import { RichTextProps } from "./RichText.type";
import { ActionsContainer } from "./Toolbar/ActionsContainer";
import { ToolbarContainer } from "./Toolbar/ToolbarContainer";
import { SOCIAL_FEED_BREAKPOINT_M } from "../../../utils/style/layout";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SpacerColumn, SpacerRow } from "../../spacer";

// /!\ It will not fully work on mobile

export const RichText: React.FC<RichTextProps> = ({
  onChange = () => {},
  onBlur,
  publishDisabled,
  loading,
  isPostConsultation,
}) => {
  const { width: windowWidth } = useWindowDimensions();
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
        <>
          {windowWidth < SOCIAL_FEED_BREAKPOINT_M ? (
            <SpacerColumn size={1.5} />
          ) : (
            <SpacerRow size={3} />
          )}
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
          <SpacerColumn size={2} />
        </>
      )}
    </View>
  );
};

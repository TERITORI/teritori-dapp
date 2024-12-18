import React, { useCallback, useRef, useState } from "react";
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
import { fixLinkOnHTMLString } from "./utils";
import { useAppMode } from "../../../hooks/useAppMode";
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
  initialValue,
  publishText = "Publish",
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const richText = useRef(null);
  const [appMode] = useAppMode();
  const [initialHeight, setInitialHeight] = useState(windowHeight);

  const handleHeightChange = useCallback((height: number) => {
    setInitialHeight(height);
  }, []);

  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, height: initialHeight }}
      >
        <RichEditor
          initialContentHTML={fixLinkOnHTMLString(initialValue)}
          ref={richText}
          onChange={onChange}
          onBlur={onBlur}
          onHeightChange={handleHeightChange}
          containerStyle={{
            minHeight: initialHeight,
          }}
          editorStyle={
            appMode === "mini"
              ? {
                  backgroundColor: "#000",
                  color: "#fff",
                  caretColor: "#fff",
                  cssText: `
                   a, a:active, a:focus {
                      color: rgb(22, 187, 255);                     
                    }
                  `,
                }
              : {}
          }
          disabled={isPostConsultation}
        />
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
              text={publishText}
              size="M"
            />
          </ActionsContainer>
          <SpacerColumn size={2} />
        </>
      )}
    </View>
  );
};

export const isArticleHTMLNeedsTruncate = (html: string, isPreview = false) => {
  return false;
};

export const getTruncatedArticleHTML = (html: string) => {
  return {
    truncatedState: {},
    truncatedHtml: html,
  };
};

export const createStateFromHTML = (html: string) => {
  return {
    getCurrentContent: () => {
      return {
        getPlainText: () => html.replace(/<\/?[^>]+(>|$)/g, ""),
      };
    },
  };
};

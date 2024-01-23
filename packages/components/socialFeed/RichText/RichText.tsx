import { ContentState, EditorState } from "draft-js";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { useAppType } from "../../../hooks/useAppType";
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
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const richText = useRef(null);
  const [apptype] = useAppType();
  const [initialHeight, setInitialHeight] = useState(windowHeight);

  const initialHTML = useMemo(() => {
    const pattern = /src=\"(?!ipfs:\/\/)([^\\"]+)\"/g;
    const replacement = 'src="ipfs://$1"';
    const addedIPFShtml = initialValue.replace(pattern, replacement);

    return addedIPFShtml.replaceAll("ipfs://", "https://ipfs.io/ipfs/");
  }, [initialValue]);

  const handleHeightChange = useCallback((height: number) => {
    setInitialHeight(height * 2);
  }, []);

  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, minHeight: initialHeight }}
      >
        <RichEditor
          initialContentHTML={initialHTML}
          ref={richText}
          onChange={onChange}
          onBlur={onBlur}
          onHeightChange={handleHeightChange}
          containerStyle={{ minHeight: initialHeight }}
          editorStyle={
            apptype === "mini"
              ? {
                  backgroundColor: "#000",
                  color: "#fff",
                  caretColor: "#fff",
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

export const isArticleHTMLNeedsTruncate = (html: string, isPreview = false) => {
  return false;
};

export const getTruncatedArticleHTML = (html: string) => {
  return {
    truncatedState: ContentState,
    truncatedHtml: html,
  };
};

export const createStateFromHTML = (html: string) => {
  return new EditorState();
};

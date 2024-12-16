import { FC, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  ScrollView,
  TextInput,
  TextStyle,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";

import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Label } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { Toolbar } from "@/screens/FeedNewArticle/components/ArticleContentEditor/Toolbar/Toolbar";
import {
  ContentMode,
  markdownTagStyles,
  articleMd as md,
} from "@/utils/feed/markdown";
import { ARTICLE_MAX_WIDTH } from "@/utils/social-feed";
import { neutral00, neutralA3, neutralFF } from "@/utils/style/colors";
import { layout, RESPONSIVE_BREAKPOINT_S } from "@/utils/style/layout";
import { NewArticleFormValues } from "@/utils/types/feed";

interface Props {
  width: number;
}

export const ArticleContentEditor: FC<Props> = ({ width }) => {
  // ========== UI
  const { width: windowWidth } = useWindowDimensions();
  const { height } = useMaxResolution();
  const textInputRef = useRef<TextInput>(null);
  const [isTextInputHovered, setTextInputHovered] = useState(false);
  const borderWidth = 1;
  const textInputMinHeight = height - 142;
  const editionAndPreviewHeight = height - 80;
  const [textInputHeight, setTextInputHeight] = useState(textInputMinHeight);
  const [mode, setMode] = useState<ContentMode>("BOTH");
  const [renderHtmlWidth, setRenderHtmlWidth] = useState(0);
  const textInputContainerPadding =
    windowWidth < RESPONSIVE_BREAKPOINT_S
      ? 0
      : layout.spacing_x2 - borderWidth * 2;

  // ========== Form
  const { watch, control } = useFormContext<NewArticleFormValues>();
  const message = watch("message");

  // ========== Markdown
  const html = md.render(message);

  // ========== JSX
  return (
    <View
      style={{
        alignSelf: "center",
        width,
      }}
    >
      {/* ==== Toolbar */}
      <Toolbar setMode={setMode} />
      <SpacerColumn size={2} />

      {/* ==== Edition and preview */}
      <View
        style={{
          flexDirection: "row",
          width: windowWidth < RESPONSIVE_BREAKPOINT_S ? "100%" : width,
          maxWidth: ARTICLE_MAX_WIDTH + 16 * 2,
          height: editionAndPreviewHeight,
        }}
      >
        {/* ==== Edition */}
        {(mode === "BOTH" || mode === "EDITION") && (
          <CustomPressable
            style={{
              flex: 1,
            }}
            onPress={() => textInputRef.current?.focus()}
            onHoverIn={() => setTextInputHovered(true)}
            onHoverOut={() => setTextInputHovered(false)}
          >
            <Label
              isRequired
              style={isTextInputHovered && { color: neutralFF }}
            >
              Article content edition
            </Label>
            <SpacerColumn size={1.5} />

            <Controller<NewArticleFormValues>
              name="message"
              control={control}
              render={({ field }) => {
                const { value, onChange } = field as {
                  value: string;
                  onChange: (value: string) => void;
                };
                return (
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    style={[
                      {
                        flex: 1,
                        padding: textInputContainerPadding,
                        borderRadius: 12,
                      },
                      windowWidth >= RESPONSIVE_BREAKPOINT_S && {
                        borderWidth,
                        borderColor: isTextInputHovered ? neutralFF : neutral00,
                      },
                    ]}
                  >
                    <TextInput
                      scrollEnabled={false}
                      multiline
                      value={value}
                      style={[
                        {
                          height: textInputHeight,
                          outlineStyle: "none",
                          color: neutralA3,
                          border: "none",
                          textAlignVertical: "top",
                        } as TextStyle,
                      ]}
                      onChangeText={onChange}
                      onContentSizeChange={(e) => {
                        // The input grows depending on the content height
                        setTextInputHeight(e.nativeEvent.contentSize.height);
                      }}
                      ref={textInputRef}
                    />
                  </ScrollView>
                );
              }}
            />
          </CustomPressable>
        )}

        {/* ==== Preview */}
        {(mode === "BOTH" || mode === "PREVIEW") && (
          <View
            style={{
              flex: 1,
            }}
          >
            <Label>Article content preview</Label>
            <SpacerColumn size={1.5} />

            <ScrollView
              showsHorizontalScrollIndicator={false}
              style={{
                borderRadius: 12,
                borderWidth,
                borderColor: neutral00,
                paddingBottom: textInputContainerPadding,
                paddingHorizontal: textInputContainerPadding,
                marginTop: textInputContainerPadding,
              }}
              onLayout={(e) => setRenderHtmlWidth(e.nativeEvent.layout.width)}
            >
              <RenderHtml
                source={{ html }}
                tagsStyles={markdownTagStyles}
                contentWidth={renderHtmlWidth - textInputContainerPadding * 2}
              />
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

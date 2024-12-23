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
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { Toolbar } from "@/screens/FeedNewArticle/components/ArticleContentEditor/Toolbar/Toolbar";
import {
  ContentMode,
  articleMd as md,
  renderHtmlTagStyles,
} from "@/utils/feed/markdown";
import { ARTICLE_MAX_WIDTH } from "@/utils/social-feed";
import {
  neutral00,
  neutral33,
  neutralA3,
  neutralFF,
} from "@/utils/style/colors";
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
  const textInputContainerPadding = layout.spacing_x2 - borderWidth * 2;
  const responsiveTextInputContainerPadding =
    windowWidth < RESPONSIVE_BREAKPOINT_S ? 0 : textInputContainerPadding;
  const toolbarWrapperHeight = 68;
  const labelsWrappersHeight = 32;
  const editionAndPreviewHeight =
    height - toolbarWrapperHeight - textInputContainerPadding * 2;
  const textInputMinHeight =
    editionAndPreviewHeight -
    labelsWrappersHeight -
    responsiveTextInputContainerPadding * 2;

  const [textInputHeight, setTextInputHeight] = useState(textInputMinHeight);
  const [mode, setMode] = useState<ContentMode>("BOTH");
  const [renderHtmlWidth, setRenderHtmlWidth] = useState(0);

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
      <View style={{ height: toolbarWrapperHeight }}>
        <Toolbar setMode={setMode} mode={mode} />
      </View>

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
            <View style={{ height: labelsWrappersHeight }}>
              <Label
                isRequired
                style={isTextInputHovered && { color: neutralFF }}
              >
                Article content edition
              </Label>
            </View>

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
                        padding: responsiveTextInputContainerPadding,
                        borderRadius: 12,
                      },
                      windowWidth >= RESPONSIVE_BREAKPOINT_S && {
                        borderWidth,
                        borderColor: isTextInputHovered ? neutralFF : neutral33,
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
            <View style={{ height: labelsWrappersHeight }}>
              <Label>Article content preview</Label>
            </View>

            <ScrollView
              showsHorizontalScrollIndicator={false}
              style={{
                borderRadius: 12,
                borderWidth,
                borderColor: neutral00,
                paddingBottom: responsiveTextInputContainerPadding,
                paddingHorizontal: responsiveTextInputContainerPadding,
                marginTop: responsiveTextInputContainerPadding,
              }}
              onLayout={(e) => setRenderHtmlWidth(e.nativeEvent.layout.width)}
            >
              <RenderHtml
                source={{ html }}
                tagsStyles={renderHtmlTagStyles}
                contentWidth={
                  renderHtmlWidth - responsiveTextInputContainerPadding * 2
                }
              />
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

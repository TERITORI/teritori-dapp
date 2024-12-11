import type { MixedStyleRecord } from "@native-html/transient-render-engine";
import markdownit from "markdown-it";
import { full as emoji } from "markdown-it-emoji";
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
import { ContentMode } from "@/screens/FeedNewArticle/components/ArticleContentEditor/utils";
import { ARTICLE_MAX_WIDTH } from "@/utils/social-feed";
import {
  neutral00,
  neutral17,
  neutralA3,
  neutralFF,
  primaryColor,
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
  const textInputMinHeight = height - 142;
  const editionAndPreviewHeight = height - 80;
  const [textInputHeight, setTextInputHeight] = useState(textInputMinHeight);
  const [mode, setMode] = useState<ContentMode>("BOTH");
  const [renderWidth, setRenderWidth] = useState(0);
  const textInputContainerPadding =
    windowWidth < RESPONSIVE_BREAKPOINT_S
      ? 0
      : layout.spacing_x2 - borderWidth * 2;

  // ========== Form
  const { watch, control } = useFormContext<NewArticleFormValues>();
  const message = watch("message");

  // ========== Markdown
  const md = markdownit({
    linkify: true,
    breaks: true,
  }).use(emoji);
  const html = md.render(message);

  const markdownTagStyles: MixedStyleRecord = {
    body: {
      color: neutralA3,
      fontSize: 14,
      letterSpacing: -(14 * 0.04),
      lineHeight: 22,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",
    },
    p: {
      marginVertical: 4,
      color: neutralA3,
      fontSize: 14,
      letterSpacing: -(14 * 0.04),
      lineHeight: 22,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",
    },
    code: {
      color: neutralA3,
      fontSize: 13,
      letterSpacing: -(13 * 0.04),
      lineHeight: 22,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",

      backgroundColor: neutral17,
      marginVertical: 4,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: "flex-start",
    },
    pre: {
      fontSize: 13,
      letterSpacing: -(13 * 0.04),
      fontFamily: "Exo_500Medium",
      fontWeight: "500",

      backgroundColor: neutral17,
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 4,
    },
    strong: { fontWeight: "700" },
    a: {
      color: primaryColor,
      textDecorationLine: "none",
    },
    hr: { backgroundColor: neutralA3 },
    h1: {
      color: neutralFF,
      fontSize: 28,
      letterSpacing: -(28 * 0.02),
      lineHeight: 37,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",
    },
    h2: {
      color: neutralFF,
      fontSize: 21,
      letterSpacing: -(21 * 0.02),
      lineHeight: 28,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",
    },
    h3: {
      color: neutralFF,
      fontSize: 16,
      letterSpacing: -(16 * 0.02),
      lineHeight: 23,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",
    },
    h4: {
      color: neutralFF,
      fontSize: 14,
      letterSpacing: -(14 * 0.04),
      lineHeight: 20,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",
    },
    h5: {
      color: neutralA3,
      fontSize: 14,
      letterSpacing: -(14 * 0.04),
      lineHeight: 20,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",
    },
    h6: {
      color: neutralA3,
      fontSize: 12,
      letterSpacing: -(12 * 0.04),
      lineHeight: 16,
      fontFamily: "Exo_500Medium",
      fontWeight: "500",
    },
  };

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
              onLayout={(e) => setRenderWidth(e.nativeEvent.layout.width)}
            >
              <RenderHtml
                source={{ html }}
                tagsStyles={markdownTagStyles}
                contentWidth={renderWidth - textInputContainerPadding * 2}
              />
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

import type { MixedStyleRecord } from "@native-html/transient-render-engine";
import markdownit from "markdown-it";
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
import { neutral00, neutralA3, neutralFF } from "@/utils/style/colors";
import { layout, RESPONSIVE_BREAKPOINT_S } from "@/utils/style/layout";
import { NewArticleFormValues } from "@/utils/types/feed";
import { LocalFileData } from "@/utils/types/files";

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
  const textInputMinHeight = height - 140;
  const [textInputHeight, setTextInputHeight] = useState(textInputMinHeight);
  const [textInputSelection, setTextInputSelection] = useState({
    start: 0,
    end: 0,
  }); // Used to get the cursor position
  const [mode, setMode] = useState<ContentMode>("BOTH");
  const [renderWidth, setRenderWidth] = useState(0);
  const textInputContainerPadding =
    windowWidth < RESPONSIVE_BREAKPOINT_S
      ? 0
      : layout.spacing_x2 - borderWidth * 2;

  // TODO: Find type: evt.nativeEvent.target was not recognised by LayoutChangeEvent, but the object target exist, so i don't understand (Same as NewsFeedInput)
  // https://github.com/necolas/react-native-web/issues/795#issuecomment-1297511068, fix that i found for shrink lines when we deleting lines in the input
  const adjustTextInputSize = (evt: any) => {
    const el = evt?.nativeEvent?.target;
    if (el) {
      el.style.height = 0;
      const newHeight = el.offsetHeight - el.clientHeight + el.scrollHeight;
      el.style.height = `${newHeight < textInputMinHeight ? textInputMinHeight : newHeight}px`;
    }
  };

  // ========== Form
  const { watch, control, setValue } = useFormContext<NewArticleFormValues>();
  const message = watch("message");

  const addImage = (file: LocalFileData) => {
    if (!file?.url) {
      console.error("Invalid file: Missing URL or MIME type");
      return;
    }
    const textBefore = message.substring(0, textInputSelection.start);
    const textAfter = message.substring(
      textInputSelection.start,
      message.length - 1,
    );
    const result = `${textBefore}![image](${file.url})${textAfter}`;
    setValue("message", result);
  };

  // ========== Markdown
  const md = markdownit();
  const html = md.render(message);

  // TODO: Style this
  const markdownTagStyles: MixedStyleRecord = {
    body: { fontSize: 14, color: neutralA3 },
    h1: { fontSize: 24, fontWeight: "bold" },
    p: { margin: 0 },
    strong: { fontWeight: "bold", color: "yellow" },
    a: { color: "blue", textDecorationLine: "underline" },
    // img: {resizeMode: "contain"}
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
      <Toolbar
        addEmoji={() => {
          /*TODO*/
        }}
        addGIF={() => {
          /*TODO*/
        }}
        addAudio={() => {
          /*TODO*/
        }}
        addVideo={() => {
          /*TODO*/
        }}
        addImage={addImage}
        setMode={setMode}
      />
      <SpacerColumn size={2} />

      {/* ==== Edition and preview */}
      <View
        style={{
          flexDirection: "row",
          width: windowWidth < RESPONSIVE_BREAKPOINT_S ? "100%" : width,
          maxWidth: ARTICLE_MAX_WIDTH + layout.spacing_x2 * 2,
          // height
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
                  <View
                    style={[
                      {
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
                      multiline
                      value={value}
                      style={[
                        {
                          height: textInputHeight,
                          outlineStyle: "none",
                          color: neutralA3,
                          border: "none",
                        } as TextStyle,
                      ]}
                      onChange={adjustTextInputSize}
                      onLayout={adjustTextInputSize}
                      onChangeText={onChange}
                      onSelectionChange={(e) =>
                        setTextInputSelection(e.nativeEvent.selection)
                      }
                      onContentSizeChange={(e) => {
                        // The input grows depending on the content height
                        setTextInputHeight(e.nativeEvent.contentSize.height);
                      }}
                      ref={textInputRef}
                    />
                  </View>
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
              contentContainerStyle={[
                mode !== "PREVIEW" && {
                  height: textInputHeight,
                },
                { minHeight: textInputMinHeight },
              ]}
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

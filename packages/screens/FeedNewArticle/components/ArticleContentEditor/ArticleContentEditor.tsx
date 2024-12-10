import { FC, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  ScrollView,
  TextInput,
  TextStyle,
  useWindowDimensions,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

import { OptimizedImage } from "@/components/OptimizedImage";
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
} from "@/utils/style/colors";
import { layout, RESPONSIVE_BREAKPOINT_S } from "@/utils/style/layout";
import { NewArticleFormValues } from "@/utils/types/feed";
import { LocalFileData } from "@/utils/types/files";

interface Props {
  width: number;
}

export const ArticleContentEditor: FC<Props> = ({ width }) => {
  // ========== Layout
  const { width: windowWidth } = useWindowDimensions();
  const { height } = useMaxResolution();
  const textInputRef = useRef<TextInput>(null);
  const [isTextInputHovered, setTextInputHovered] = useState(false);
  const borderWidth = 1;
  const textInputMinHeight = height - 140;
  const [textInputHeight, setTextInputHeight] = useState(textInputMinHeight);
  const [mode, setMode] = useState<ContentMode>("BOTH");
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
    setValue("message", `![image](${file.url})`);
  };

  // ========== Markdown
  const markdownStyle = {
    body: {
      color: neutralA3,
      lineBreak: "anywhere",
    } as TextStyle,
    // p:{
    //   // overflowWrap: 'break-word', // Gère le découpage des mots longs
    //   // wordWrap: 'break-word',
    //   width: '100%',
    //   maxWidth: 400, color: neutralA3, display: "flex",flexWrap: "wrap", flex: 1, flexShrink: 1},
    // span:{
    //   // overflowWrap: 'break-word', // Gère le découpage des mots longs
    //   // wordWrap: 'break-word',
    //   width: '100%',
    //   maxWidth: 400, color: neutralA3, display: "flex",flexWrap: "wrap", flex: 1, flexShrink: 1},
    // div:{
    //   // overflowWrap: 'break-word', // Gère le découpage des mots longs
    //   // wordWrap: 'break-word',
    //   width: '100%',
    //   maxWidth: 400, color: neutralA3, display: "flex", flexWrap: "wrap", flex: 1, flexShrink: 1},
    hr: { backgroundColor: neutralA3 },
    code_inline: {
      backgroundColor: neutral17,
      borderWidth: 0,
    },
    code_block: {
      backgroundColor: neutral17,
      borderWidth: 0,
    },
    fence: {
      backgroundColor: neutral17,
      borderWidth: 0,
    },
  };

  const markdownRules = {
    // TODO: type this
    image: (node, children, parent, styles) => {
      const { src } = node.attributes;
      return (
        <OptimizedImage
          key={src}
          sourceURI={src}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
          height={200}
          width={200}
        />
      );
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
      {/* ==== Editor views button */}
      {/*<View style={{ flexDirection: "row", alignSelf: "center" }}>*/}
      {/*  <CustomPressable*/}
      {/*    onPress={() => setMode("edition")}*/}
      {/*    style={{*/}
      {/*      backgroundColor: neutral1A,*/}
      {/*      padding: 8,*/}
      {/*      borderRadius: 8,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <BrandText style={fontSemibold12}>Edition</BrandText>*/}
      {/*  </CustomPressable>*/}
      {/*  <SpacerRow size={1} />*/}
      {/*  <CustomPressable*/}
      {/*    onPress={() => setMode("both")}*/}
      {/*    style={{*/}
      {/*      backgroundColor: neutral1A,*/}
      {/*      padding: 8,*/}
      {/*      borderRadius: 8,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <BrandText style={fontSemibold12}>Edition | Preview</BrandText>*/}
      {/*  </CustomPressable>*/}
      {/*  <SpacerRow size={1} />*/}
      {/*  <CustomPressable*/}
      {/*    onPress={() => setMode("preview")}*/}
      {/*    style={{*/}
      {/*      backgroundColor: neutral1A,*/}
      {/*      padding: 8,*/}
      {/*      borderRadius: 8,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <BrandText style={fontSemibold12}>Preview</BrandText>*/}
      {/*  </CustomPressable>*/}
      {/*</View>*/}

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
      <SpacerColumn size={3} />

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
              style={[
                {
                  borderRadius: 12,
                  borderWidth,
                  borderColor: neutral00,
                  // No paddingTop to offset the default vertical space from markdown's rendered elements
                  paddingHorizontal: textInputContainerPadding,
                  paddingBottom: textInputContainerPadding,
                },
              ]}
              contentContainerStyle={[
                mode !== "PREVIEW" && {
                  height: textInputHeight + textInputContainerPadding,
                },
                { minHeight: textInputMinHeight + textInputContainerPadding },
              ]} // + textInputContainerPadding to offset the inexistant ScrollView paddingTop
            >
              <Markdown style={markdownStyle} rules={markdownRules}>
                {message}
              </Markdown>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

import React, { useImperativeHandle, useRef } from "react";
import { TextInput, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

import penSVG from "../../../../../assets/icons/pen.svg";

import { BrandText } from "@/components/BrandText";
import { FilesPreviewsContainer } from "@/components/FilePreview/FilesPreviewsContainer";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerColumn } from "@/components/spacer";
import {
  SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT,
  removeFileFromArray,
  replaceFileInArray,
} from "@/utils/social-feed";
import {
  errorColor,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
  yellowDefault,
} from "@/utils/style/colors";
import { fontSemibold12, fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { NewPostFormValues } from "@/utils/types/feed";
import { LocalFileData } from "@/utils/types/files";

type Props = {
  formValues: NewPostFormValues;
  setValue: (index: keyof NewPostFormValues, data: any) => void;
  setSelection: (data: { start: number; end: number }) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  type: "comment" | "post";
};
export interface MiniCommentInputHandle {
  setValue: (text: string) => void;
  focusInput: () => void;
  blurInput: () => void;
}

const CHARS_LIMIT_WARNING_MULTIPLIER = 0.92;

export const CommentTextInput = React.forwardRef<MiniCommentInputHandle, Props>(
  (
    { formValues, setValue, setSelection, onBlur, onFocus, type },
    forwardRef,
  ) => {
    const inputMaxHeight = 200;
    const inputMinHeight = 30;
    const inputHeight = useSharedValue(30);
    const inputRef = useRef<TextInput>(null);

    const focusInput = () => inputRef.current?.focus();
    const blurInput = () => inputRef.current?.blur();

    const handleTextChange = (text: string) => {
      if (text.length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT) return;
      setValue("message", text);
    };
    useImperativeHandle(forwardRef, () => ({
      focusInput,
      blurInput,
      setValue: handleTextChange,
    }));

    return (
      <View
        style={{
          borderRadius: layout.borderRadius,
          borderWidth: 1,
          borderColor: neutralA3,
          paddingHorizontal: layout.spacing_x1,
          paddingVertical: layout.spacing_x0_75,
        }}
      >
        <CustomPressable onPress={focusInput}>
          <FlexRow style={{ marginTop: layout.spacing_x1 }}>
            <SVG
              height={24}
              width={24}
              source={penSVG}
              color={secondaryColor}
              style={{
                alignSelf: "flex-end",
                marginRight: layout.spacing_x1_5,
              }}
            />
            <Animated.View style={{ flex: 1, height: "auto" }}>
              <TextInput
                ref={inputRef}
                value={formValues.message}
                onSelectionChange={(event) =>
                  setSelection(event.nativeEvent.selection)
                }
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder={`Hey yo! ${type === "comment" ? "Write your comment" : "Post something"}`}
                placeholderTextColor={neutral77}
                onChangeText={handleTextChange}
                multiline
                onContentSizeChange={(e) => {
                  if (e.nativeEvent.contentSize.height < inputMaxHeight) {
                    inputHeight.value = e.nativeEvent.contentSize.height;
                  }
                }}
                style={[
                  fontSemibold16,
                  {
                    height: formValues.message
                      ? inputHeight.value || inputMinHeight
                      : inputMinHeight,
                    width: "100%",
                    color: secondaryColor,
                  },
                ]}
              />
            </Animated.View>
          </FlexRow>
        </CustomPressable>

        <BrandText
          style={[
            fontSemibold12,
            {
              color: !formValues?.message
                ? neutral77
                : formValues?.message?.length >
                      SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT *
                        CHARS_LIMIT_WARNING_MULTIPLIER &&
                    formValues?.message?.length <
                      SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT
                  ? yellowDefault
                  : formValues?.message?.length >=
                      SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT - 10
                    ? errorColor
                    : primaryColor,
              marginTop: layout.spacing_x0_5,
              alignSelf: "flex-end",
            },
          ]}
        >
          {formValues?.message?.length}
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            /{SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT}
          </BrandText>
        </BrandText>
        {formValues.files && formValues.files.length > 0 ? (
          <>
            <SpacerColumn size={3} />
            <View style={{ maxHeight: 120 }}>
              <FilesPreviewsContainer
                files={formValues.files}
                gifs={formValues.gifs}
                onDelete={(file) => {
                  setValue(
                    "files",
                    removeFileFromArray(
                      formValues?.files || [],
                      file as LocalFileData,
                    ),
                  );
                }}
                onDeleteGIF={(url) => {
                  setValue(
                    "gifs",
                    (formValues?.gifs || [])?.filter((gif) => gif !== url),
                  );
                  const gifFile = formValues?.files?.find((x) => x.url === url);
                  if (gifFile) {
                    setValue(
                      "files",
                      removeFileFromArray(
                        formValues?.files || [],
                        gifFile as LocalFileData,
                      ),
                    );
                  }
                }}
                onAudioUpdate={(updatedFile) => {
                  if (formValues?.files?.length) {
                    setValue(
                      "files",
                      replaceFileInArray(formValues?.files, updatedFile),
                    );
                  }
                }}
                showSmallPreview
              />
            </View>
          </>
        ) : null}
      </View>
    );
  },
);

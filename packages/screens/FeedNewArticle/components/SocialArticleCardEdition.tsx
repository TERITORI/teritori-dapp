import React, { FC, memo, useRef, useState } from "react";
import { Path, useFormContext } from "react-hook-form";
import {
  StyleProp,
  TextInput,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { Hoverable } from "react-native-hoverable";

import defaultThumbnailImage from "@/assets/default-images/default-article-thumbnail.png";
import { OptimizedImage } from "@/components/OptimizedImage";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { FileUploader } from "@/components/inputs/fileUploader";
import { SocialCardHeader } from "@/components/socialFeed/SocialCard/SocialCardHeader";
import { SpacerColumn } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { SOCIAl_CARD_BORDER_RADIUS } from "@/utils/social-feed";
import {
  neutral00,
  neutral33,
  neutralA3,
  neutralFF,
} from "@/utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "@/utils/style/fonts";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  SOCIAL_FEED_BREAKPOINT_M,
} from "@/utils/style/layout";
import { NewArticleFormValues } from "@/utils/types/feed";

// ========= IT'S A TEST. I WOULD LIKE AN EDITABLE CARD WYSIWYG =======

const ARTICLE_CARD_PADDING_VERTICAL = layout.spacing_x2;
const ARTICLE_CARD_PADDING_HORIZONTAL = layout.spacing_x2_5;

export const SocialArticleCardEdition: FC<{
  style?: StyleProp<ViewStyle>;
}> = memo(({ style }) => {
  const selectedWallet = useSelectedWallet();
  const newArticleForm = useFormContext<NewArticleFormValues>();
  const title = newArticleForm.watch("title");
  const shortDescription = newArticleForm.watch("shortDescription");
  const thumbnailImage = newArticleForm.watch("thumbnailImage");
  const [viewWidth, setViewWidth] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const [hoveredInput, setHoveredInput] =
    useState<Path<NewArticleFormValues> | null>(null);

  const titleInputMinHeight = 24;
  const titleInputMaxHeight = windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 44 : 64;
  const [titleInputHeight, setTitleInputHeight] = useState(titleInputMinHeight);
  const shortDescInputMaxHeight = 80;
  const [shortDescInputHeight, setShortDescInputHeight] = useState(
    shortDescInputMaxHeight,
  );

  const articleCardHeight = windowWidth < SOCIAL_FEED_BREAKPOINT_M ? 214 : 254;
  const titleFont =
    windowWidth < SOCIAL_FEED_BREAKPOINT_M ? fontSemibold16 : fontSemibold20;
  const thumbnailImageWidth = viewWidth / 3;
  const borderRadius =
    windowWidth < RESPONSIVE_BREAKPOINT_S ? 0 : SOCIAl_CARD_BORDER_RADIUS;

  const thumbnailURI = thumbnailImage?.url
    ? thumbnailImage.url.includes("://")
      ? thumbnailImage.url
      : "ipfs://" + thumbnailImage.url // we need this hack because ipfs "urls" in feed are raw CIDs
    : defaultThumbnailImage;

  const titleInputRef = useRef<TextInput>(null);
  const shortDescInputRef = useRef<TextInput>(null);

  return (
    <View
      onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
      style={[
        {
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius,
          backgroundColor: neutral00,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          height: articleCardHeight,
          flex: 1,
        },
        style,
      ]}
    >
      <View
        style={{
          justifyContent: "space-between",
          flex: 1,
          paddingVertical: ARTICLE_CARD_PADDING_VERTICAL,
          paddingHorizontal: ARTICLE_CARD_PADDING_HORIZONTAL,
        }}
      >
        <View>
          <SocialCardHeader
            isWrapped
            authorId={selectedWallet?.userId || ""}
            createdAt={Date.parse("2024-06-17") / 1000}
          />

          <SpacerColumn size={2.5} />

          {/* // TODO: Good growth and shrink input. Maybe need a maxLength */}
          <Hoverable
            onMouseEnter={() => setHoveredInput("title")}
            onMouseLeave={() => setHoveredInput(null)}
          >
            <TextInput
              style={[
                {
                  borderRadius: 8,
                  color: neutralFF,
                  height: titleInputHeight,
                  minHeight: titleInputMinHeight,
                  maxHeight: titleInputMaxHeight,
                  textAlignVertical: "top",
                  overflow: "hidden",
                  outlineStyle: "none",
                } as TextStyle,
                titleFont,
                hoveredInput === "title" && {
                  borderColor: neutralFF,
                  borderWidth: 1,
                },
              ]}
              ref={titleInputRef}
              scrollEnabled={false}
              multiline
              numberOfLines={2}
              // maxLength={100}
              value={title}
              placeholder="Write a preview title"
              onChangeText={(text) => {
                newArticleForm.setValue("title", text);

                // The idea was to prevent typing more than 2 lines
                newArticleForm.setValue("title", text);
                if (titleInputRef.current) {
                  titleInputRef.current.measure((x, y, width, height) => {
                    console.log("heightheight", height);
                    if (height > titleInputMaxHeight) {
                      newArticleForm.setValue("title", title.slice(0, -1));
                    } else {
                      setTitleInputHeight(height);
                    }
                  });
                }
              }}
              onContentSizeChange={(e) =>
                setTitleInputHeight(e.nativeEvent.contentSize.height)
              }
            />
          </Hoverable>

          <SpacerColumn size={2} />

          <Hoverable
            onMouseEnter={() => setHoveredInput("shortDescription")}
            onMouseLeave={() => setHoveredInput(null)}
          >
            <TextInput
              style={[
                hoveredInput === "shortDescription" && {
                  borderColor: neutralFF,
                  borderWidth: 1,
                },
                {
                  borderRadius: 8,
                  color: neutralA3,
                  height: shortDescInputHeight,
                  minHeight: shortDescInputMaxHeight,
                  textAlignVertical: "top",
                  overflow: "hidden",
                  outlineStyle: "none",
                } as TextStyle,
                fontSemibold14,
              ]}
              ref={shortDescInputRef}
              scrollEnabled={false}
              multiline
              // maxLength={140}
              numberOfLines={3}
              value={shortDescription}
              placeholder="Write a preview subtitle"
              onChangeText={(text) => {
                newArticleForm.setValue("shortDescription", text);

                // The idea was to prevent typing more than 3 lines
                if (shortDescInputRef.current && shortDescription) {
                  shortDescInputRef.current.measure((x, y, width, height) => {
                    console.log("heightheight", height);
                    if (height > shortDescInputMaxHeight) {
                      newArticleForm.setValue(
                        "shortDescription",
                        shortDescription.slice(0, -1),
                      );
                    } else {
                      setShortDescInputHeight(height);
                    }
                  });
                }
              }}
              onContentSizeChange={(e) =>
                setShortDescInputHeight(e.nativeEvent.contentSize.height)
              }
            />
          </Hoverable>
        </View>
      </View>

      {/*TODO: Input*/}
      <FileUploader
        onUpload={(files) =>
          newArticleForm.setValue("thumbnailImage", files?.[0])
        }
        mimeTypes={IMAGE_MIME_TYPES}
      >
        {({ onPress }) => (
          <CustomPressable
            onHoverIn={() => setHoveredInput("thumbnailImage")}
            onHoverOut={() => setHoveredInput(null)}
            onPress={onPress}
            style={
              hoveredInput === "thumbnailImage" && {
                borderColor: neutralFF,
                borderWidth: 1,
              }
            }
          >
            <OptimizedImage
              width={thumbnailImageWidth}
              height={articleCardHeight - 2}
              sourceURI={thumbnailURI}
              fallbackURI={defaultThumbnailImage}
              style={[
                {
                  zIndex: -1,
                  width: thumbnailImageWidth,
                  height: articleCardHeight - 2,
                  borderTopRightRadius: borderRadius,
                  borderBottomRightRadius: borderRadius,
                },
              ]}
            />
          </CustomPressable>
        )}
      </FileUploader>
    </View>
  );
});

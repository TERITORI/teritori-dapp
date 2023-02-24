import React from "react";
import { Image, View } from "react-native";

import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { HTML_TAG_REGEXP } from "../../../utils/regex";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { RichText } from "../RichText";
import { THUMBNAIL_WIDTH } from "./SocialMessageContent";

interface Props {
  metadata: SocialFeedMetadata;
  isPostConsultation?: boolean;
}

export const ArticlePreview: React.FC<Props> = ({
  metadata,
  isPostConsultation,
}) => {
  if (isPostConsultation) {
    const coverImage = metadata.files?.find((file) => file.isCoverImage);
    return (
      <>
        {!!metadata?.title && (
          <BrandText style={{ marginBottom: layout.padding_x1 }}>
            {metadata.title}
          </BrandText>
        )}
        {!!coverImage && (
          <Image
            source={{ uri: ipfsURLToHTTPURL(coverImage.url) }}
            resizeMode="cover"
            style={{
              width: "100%",
              height: 240,
              marginBottom: layout.padding_x1_5,
            }}
          />
        )}

        <RichText initialValue={metadata.message} readOnly />
      </>
    );
  }
  return (
    <View style={{ flexDirection: "row" }}>
      <View
        style={{
          flex: 1,
        }}
      >
        {!!metadata?.title && (
          <BrandText style={{ marginBottom: layout.padding_x1 }}>
            {metadata.title}
          </BrandText>
        )}
        <BrandText
          style={[fontSemibold13, { color: neutralA3 }]}
          numberOfLines={isPostConsultation ? undefined : 5}
        >
          {metadata.message.replace(HTML_TAG_REGEXP, "")}
        </BrandText>
      </View>
      {!!metadata.files?.length && (
        <Image
          source={{ uri: ipfsURLToHTTPURL(metadata.files[0]?.url) }}
          resizeMode="cover"
          style={{
            height: THUMBNAIL_WIDTH,
            width: THUMBNAIL_WIDTH,
            marginLeft: layout.padding_x2,
            borderRadius: 4,
          }}
        />
      )}
    </View>
  );
};

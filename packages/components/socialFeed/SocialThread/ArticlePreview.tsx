import React from "react";
import { Image, View } from "react-native";

import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { RichText } from "../RichText";
import { THUMBNAIL_WIDTH } from "./SocialMessageContent";
import { TextContent } from "./TextContent";

interface Props {
  metadata: SocialFeedMetadata;
  isPostConsultation?: boolean;
}

export const ArticlePreview: React.FC<Props> = ({
  metadata,
  isPostConsultation,
}) => {
  // ----- From /feed/post/{postId}
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
  // ----- From /feed
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

        <TextContent metadata={metadata} />
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

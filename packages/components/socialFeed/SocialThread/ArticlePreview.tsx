import React from "react";
import { Image, View } from "react-native";

import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { HTML_TAG_REGEXP } from "../../../utils/regex";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { THUMBNAIL_WIDTH } from "./SocialThreadContent";

interface Props {
  metadata: SocialFeedMetadata;
}

export const ArticlePreview: React.FC<Props> = ({ metadata }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingBottom: layout.padding_x1,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        {!!metadata?.title && (
          <BrandText style={{ marginVertical: layout.padding_x1 }}>
            {metadata.title}
          </BrandText>
        )}
        <BrandText
          style={[fontSemibold13, { color: neutralA3 }]}
          numberOfLines={4}
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

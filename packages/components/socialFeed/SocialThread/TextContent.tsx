import React from "react";
import { View } from "react-native";

import { HTML_TAG_REGEXP } from "../../../utils/regex";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { TextRenderer } from "../NewsFeed/TextRenderer/TextRenderer";

interface Props {
  metadata: SocialFeedMetadata;
}

export const TextContent: React.FC<Props> = ({ metadata }) => {
  return (
    <View>
      <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
        <TextRenderer text={metadata.message.replace(HTML_TAG_REGEXP, "")} />
      </BrandText>
    </View>
  );
};

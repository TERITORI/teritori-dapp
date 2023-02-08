import React from "react";
import { View } from "react-native";

import { HTML_TAG_REGEXP } from "../../../utils/regex";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SocialFeedMetadata } from "../../NewsFeed/NewsFeed.type";
import { TextRenderer } from "../../TextRenderer/TextRenderer";

interface Props {
  metadata: SocialFeedMetadata;
}

export const TextContent: React.FC<Props> = ({ metadata }) => {
  return (
    <View>
      {!!metadata?.title && (
        <BrandText style={{ marginVertical: layout.padding_x1 }}>
          {metadata.title}
        </BrandText>
      )}
      <BrandText
        style={[
          fontSemibold13,
          { color: neutralA3, marginBottom: layout.padding_x2 },
        ]}
      >
        <TextRenderer text={metadata.message.replace(HTML_TAG_REGEXP, "")} />
      </BrandText>
    </View>
  );
};

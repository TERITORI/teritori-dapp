import React from "react";
import { View } from "react-native";

import { HTML_TAG_REGEXP } from "../../utils/regex";
import { neutralA3 } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ImagePreview } from "../FilePreview/UploadedFilePreview/ImagePreview";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
interface Props {
  metadata: SocialFeedMetadata;
}

export const ImageThread: React.FC<Props> = ({ metadata }) => {
  return (
    <View
      style={{
        paddingBottom: layout.padding_x1,
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

      <ImagePreview files={metadata.files} isEditable={false} />
    </View>
  );
};

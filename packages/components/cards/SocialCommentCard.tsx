import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { neutralA3 } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold16 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { FilePreview } from "../FilePreview/FilePreview";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { AvatarWithFrame } from "../images/AvatarWithFrame";

export const SocialCommentCard: React.FC<{
  comment: PostResult;
  style?: StyleProp<ViewStyle>;
}> = ({ style, comment }) => {
  const imageMarginRight = layout.padding_x3_5;
  const tertiaryBoxPaddingHorizontal = layout.padding_x3;

  const { width: containerWidth } = useMaxResolution({
    responsive: true,
  });

  const metadata = JSON.parse(comment.metadata);
  const postByTNSMetadata = useTNSMetadata(comment?.post_by);

  return (
    <PrimaryBox
      mainContainerStyle={[
        {
          paddingVertical: layout.padding_x3,
          paddingHorizontal: tertiaryBoxPaddingHorizontal,
          borderRadius: 12,
          marginVertical: 0.5,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <AvatarWithFrame
          image={postByTNSMetadata?.metadata?.image}
          style={{
            marginRight: imageMarginRight,
          }}
          size={49}
        />
        <View style={{ width: containerWidth - 240 }}>
          <BrandText style={fontSemibold16}>
            {postByTNSMetadata?.metadata?.public_name}
          </BrandText>
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            {metadata.message}
          </BrandText>
          {!!metadata.fileURL && <FilePreview fileURL={metadata.fileURL} />}
        </View>
      </View>
    </PrimaryBox>
  );
};

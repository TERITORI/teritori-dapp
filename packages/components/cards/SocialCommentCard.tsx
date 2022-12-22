import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { DEFAULT_NAME, DEFAULT_USERNAME } from "../../utils/social-feed";
import {
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
} from "../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold13,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { FilePreview } from "../FilePreview/FilePreview";
import { SocialReactionActions } from "../SocialReactionActions";
import { tinyAddress } from "../WalletSelector";
import { AvatarWithFrame } from "../images/AvatarWithFrame";
import { SpacerColumn, SpacerRow } from "../spacer";

export const SocialCommentCard: React.FC<{
  comment: PostResult;
  style?: StyleProp<ViewStyle>;
}> = ({ style, comment }) => {
  const imageMarginRight = layout.padding_x3_5;

  const metadata = JSON.parse(comment.metadata);
  const postByTNSMetadata = useTNSMetadata(comment?.post_by);

  return (
    <View style={[styles.mainContainer, style]}>
      <AvatarWithFrame
        image={postByTNSMetadata?.metadata?.image}
        style={{
          marginRight: imageMarginRight,
        }}
        size={68}
      />
      <View style={styles.content}>
        <View style={styles.detailsContainer}>
          <View style={styles.rowCenter}>
            <BrandText style={fontSemibold16}>
              {postByTNSMetadata?.metadata?.public_name || DEFAULT_NAME}
            </BrandText>
            <SpacerRow size={1.5} />
            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              @
              {postByTNSMetadata?.metadata?.tokenId
                ? tinyAddress(postByTNSMetadata?.metadata?.tokenId || "", 19)
                : DEFAULT_USERNAME}
            </BrandText>
          </View>

          <SpacerColumn size={1} />
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            {metadata.message}
          </BrandText>
          {!!metadata.fileURL && <FilePreview fileURL={metadata.fileURL} />}
        </View>

        <View style={styles.actionContainer}>
          <BrandText style={[fontMedium13, { color: neutral77 }]}>
            {comment.post_by}
          </BrandText>
          <SocialReactionActions statStyle={styles.stat} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: layout.padding_x3,
    paddingHorizontal: layout.padding_x3,
    borderRadius: 12,
    marginVertical: 0.5,
    borderColor: neutral33,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
  },
  content: { flex: 1 },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {},
  actionContainer: {
    borderTopWidth: 1,
    marginTop: layout.padding_x1_5,
    paddingTop: layout.padding_x1_5,
    borderColor: neutral22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: { backgroundColor: neutral22 },
});

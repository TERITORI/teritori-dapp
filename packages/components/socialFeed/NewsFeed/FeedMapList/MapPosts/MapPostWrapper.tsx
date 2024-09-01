import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { Post } from "@/api/feed/v1/feed";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { GradientText } from "@/components/gradientText";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import {
  getMapPostIconSVG,
  getMapPostTextGradientType,
} from "@/utils/feed/map";
import { DEFAULT_USERNAME } from "@/utils/social-feed";
import { fontSemibold10 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

export const MapPostWrapper: FC<{
  post: Post;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ post, children, style }) => {
  const [, authorAddress] = parseUserId(post.authorId);
  const authorNSInfo = useNSUserInfo(post.authorId);
  const username =
    authorNSInfo?.metadata?.tokenId ||
    tinyAddress(authorAddress) ||
    DEFAULT_USERNAME;

  return (
    <View
      style={[
        {
          padding: layout.spacing_x0_5,
        },
        style,
      ]}
    >
      <FlexRow>
        <SVG source={getMapPostIconSVG(post.category)} width={24} height={24} />
        <SpacerRow size={0.75} />

        <GradientText
          gradientType={getMapPostTextGradientType(post.category)}
          style={fontSemibold10}
        >
          @{username}
        </GradientText>
        <SpacerRow size={0.5} />
      </FlexRow>

      <SpacerColumn size={0.5} />
      {children}
    </View>
  );
};

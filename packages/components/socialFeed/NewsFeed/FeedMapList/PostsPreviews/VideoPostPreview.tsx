import { FC } from "react";
import { Image, View } from "react-native";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { GradientText } from "@/components/gradientText";
import { Separator } from "@/components/separators/Separator";
import { PostPreviewWrapper } from "@/components/socialFeed/NewsFeed/FeedMapList/PostsPreviews/PostPreviewWrapper";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { getMapPostIconSVG, getMapPostTextGradient } from "@/utils/feed/map";
import { zodTryParseJSON } from "@/utils/sanitize";
import { DEFAULT_USERNAME } from "@/utils/social-feed";
import {
  gradientColorDarkBlue,
  gradientColorLightBlue,
  neutral33,
  neutralFF,
  withAlpha,
} from "@/utils/style/colors";
import { fontSemibold10 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import { ZodSocialFeedPostMetadata } from "@/utils/types/feed";

export const VideoPostPreview: FC<{
  // post: Post;
}> = (
  {
    // post
  },
) => {
  // const postMetadata = zodTryParseJSON(
  //   ZodSocialFeedPostMetadata,
  //   post.metadata,
  // );

  return (
    <PostPreviewWrapper

    // post={post}
    >
      <View>
        <BrandText style={fontSemibold10}>Video Name</BrandText>
        <SpacerColumn size={0.5} />

        <Separator />
        <SpacerColumn size={0.5} />

        {/*TODO: Video player (simplified*/}

        <BrandText style={fontSemibold10}>
          bfbyfbeibzege eg bezig ez
          {/*{postMetadata?.message}*/}
        </BrandText>
      </View>
    </PostPreviewWrapper>
  );
};

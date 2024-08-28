import { FC } from "react";
import { Image, View } from "react-native";
import { gradientColorDarkBlue, gradientColorLightBlue, neutral33, neutralFF, withAlpha } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { BrandText } from "@/components/BrandText";
import { Post } from "@/api/feed/v1/feed";
import { getMapPostIconSVG, getMapPostTextGradient } from "@/utils/feed/map";
import { tinyAddress } from "@/utils/text";
import { DEFAULT_USERNAME } from "@/utils/social-feed";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { GradientText } from "@/components/gradientText";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { PostPreviewWrapper } from "@/components/socialFeed/NewsFeed/FeedMapList/PostsPreviews/PostPreviewWrapper";
import { zodTryParseJSON } from "@/utils/sanitize";
import { ZodSocialFeedPostMetadata } from "@/utils/types/feed";
import { fontSemibold10 } from "@/utils/style/fonts";
import { Separator } from "@/components/separators/Separator";

export const MusicPostPreview: FC<{
  // post: Post;
}> = ({
        // post
      }) => {
  // const postMetadata = zodTryParseJSON(
  //   ZodSocialFeedPostMetadata,
  //   post.metadata,
  // );

  return (
    <PostPreviewWrapper

      // post={post}

    >
      <View>
        <BrandText style={fontSemibold10}>Music Name</BrandText>
        <SpacerColumn size={.5}/>

        <Separator/>
        <SpacerColumn size={.5}/>

        {/*TODO: Music player (simplified*/}

        <BrandText style={fontSemibold10}>
          {"bfbyfbeibzege eg bezig ez"}
          {/*{postMetadata?.message}*/}
        </BrandText>
      </View>
    </PostPreviewWrapper>
  )
}

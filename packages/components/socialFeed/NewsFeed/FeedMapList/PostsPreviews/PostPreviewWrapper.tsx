import { FC, ReactNode } from "react";
import { View } from "react-native";
import { layout } from "@/utils/style/layout";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { Post } from "@/api/feed/v1/feed";
import { getMapPostIconSVG, getMapPostTextGradient, getMapPostTextGradientType } from "@/utils/feed/map";
import { tinyAddress } from "@/utils/text";
import { DEFAULT_USERNAME } from "@/utils/social-feed";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { GradientText } from "@/components/gradientText";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { PostCategory } from "@/utils/types/feed";
import { fontSemibold10 } from "@/utils/style/fonts";

export const PostPreviewWrapper: FC<{
  // post: Post;
  children: ReactNode;
}> = ({
                                         // post,
                                           children
      }) => {
  // const [, authorAddress] = parseUserId(post.authorId);
  // const authorNSInfo = useNSUserInfo(post.authorId);
  // const username =
  //   authorNSInfo?.metadata?.tokenId ||
  //   tinyAddress(authorAddress) ||
  //   DEFAULT_USERNAME;

  return (
    <View style={{
      // backgroundColor: withAlpha(neutral33, .5), borderRadius: 8,
      // borderWidth: 1, borderColor: withAlpha(neutralFF, .2)
      padding: layout.spacing_x0_5,
    }}>
      <FlexRow>
        {/*<SVG source={getMapPostIconSVG(post.category)} width={24} height={24}/>*/}
        <SVG source={getMapPostIconSVG(PostCategory.Article)} width={24} height={24}/>
        <SpacerRow size={.75}/>
        {/*<GradientText gradientProps={getMapPostTextGradient(post.category)}>{username}</GradientText>*/}
        <GradientText gradientType={getMapPostTextGradientType(PostCategory.Article)} style={fontSemibold10}>{"@fromage"}</GradientText>
        <SpacerRow size={.5}/>
      </FlexRow>

      <SpacerColumn size={.5}/>
      {children}
    </View>
  )
}

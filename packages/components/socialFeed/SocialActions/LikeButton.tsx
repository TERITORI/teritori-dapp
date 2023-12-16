import React, { Dispatch, FC, SetStateAction } from "react";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import thumbUpSVG from "../../../../assets/icons/thumb-up.svg";
import { Post } from "../../../api/feed/v1/feed";
import { useSocialReactions } from "../../../hooks/useSocialReactions";
import { neutral22, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SpacerRow } from "../../spacer";

export const LikeButton: FC<{
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
}> = ({ post, setPost }) => {
  const { handleReaction, isPostMutationLoading } = useSocialReactions({
    post,
    setPost,
  });

  if (isPostMutationLoading)
    return <ActivityIndicator animating color={secondaryColor} size={32} />;
  return (
    <TouchableOpacity
      onPress={() => handleReaction("👍")}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: layout.spacing_x0_75,
        paddingRight: layout.spacing_x1_5,
        paddingLeft: layout.spacing_x1,
        borderRadius: 999,
        backgroundColor: neutral22,
      }}
    >
      <SVG source={thumbUpSVG} height={20} width={20} color={secondaryColor} />
      <SpacerRow size={0.75} />
      <BrandText style={fontSemibold13}>
        {post.reactions.find((reaction) => reaction.icon === "👍")?.count || 0}
      </BrandText>
    </TouchableOpacity>
  );
};

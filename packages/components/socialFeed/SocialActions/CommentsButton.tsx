import { TouchableOpacity } from "react-native-gesture-handler";

import chatSVG from "../../../../assets/icons/social-threads/chat.svg";
import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useAppNavigation } from "../../../utils/navigation";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";

export const CommentsButton: React.FC<{
  post: PostResult;
}> = ({ post }) => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("FeedPostView", { id: post.identifier })
      }
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <SVG
        source={chatSVG}
        height={20}
        width={20}
        style={{ marginRight: layout.padding_x1_5 }}
      />
      <BrandText style={fontSemibold14}>{post.sub_post_length}</BrandText>
    </TouchableOpacity>
  );
};

import { StyleProp, TextStyle, View, ViewStyle } from "react-native";

import { PostCategory } from "./NewsFeed/NewsFeed.type";
import { useFeedPosting } from "../../hooks/feed/useFeedPosting";
import { useTheme } from "../../hooks/useTheme";
import { errorColor, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export const FeedFeeText: React.FC<{
  networkId: string | undefined;
  userId: string | undefined;
  category: PostCategory;
  style?: StyleProp<ViewStyle>;
}> = ({ networkId, userId, category, style }) => {
  const theme = useTheme();
  const { canPayForPost, prettyPublishingFee, prettyFeeBalance } =
    useFeedPosting(networkId, userId, category);
  const balanceColor = canPayForPost ? theme.textColor : errorColor;
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        },
        style,
      ]}
    >
      <BrandText style={testCStyle}>
        Publishing fee:{" "}
        <BrandText style={[testCStyle, { color: theme.textColor }]}>
          {prettyPublishingFee}
        </BrandText>
      </BrandText>
      <BrandText style={testCStyle}>
        Balance:{" "}
        <BrandText style={[testCStyle, { color: balanceColor }]}>
          {prettyFeeBalance}
        </BrandText>
      </BrandText>
    </View>
  );
};

const testCStyle: TextStyle = {
  ...fontSemibold14,
  color: neutral77,
};

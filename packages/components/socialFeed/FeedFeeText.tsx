import { StyleProp, TextStyle, View, ViewStyle } from "react-native";

import { PostCategory } from "./NewsFeed/NewsFeed.type";
import { Coin } from "../../api/teritori-chain/cosmos/base/v1beta1/coin";
import { useCanPay } from "../../hooks/feed/useCanPay";
import { useFeedPostFee } from "../../hooks/feed/useFeedPostFee";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTheme } from "../../hooks/useTheme";
import { getStakingCurrency } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { errorColor, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export const FeedFeeText: React.FC<{
  category: PostCategory;
  style?: StyleProp<ViewStyle>;
}> = ({ category, style }) => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId;
  const theme = useTheme();
  const { prettyPostFee } = useFeedPostFee(networkId, category);
  const { postFee } = useFeedPostFee(networkId, category);
  const feeCurrency = getStakingCurrency(networkId);
  const cost: Coin = {
    amount: postFee.toString(),
    denom: feeCurrency?.denom || "",
  };
  const canPay = useCanPay({ userId, cost });
  const balanceColor = canPay ? theme.textColor : errorColor;
  const prettyFeeBalance = prettyPrice(
    networkId,
    postFee.toString(),
    feeCurrency?.denom,
  );
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
          {prettyPostFee}
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

import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { neutralA3 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { Token } from "@/utils/types/types";

interface SelectTokenModalProps {
  item: Token;
}

export const LaunchpadERC20DetailTokenBox: React.FC<SelectTokenModalProps> = ({
  item,
}) => {
  return (
    <View
      style={{
        width: "100%",
        borderWidth: 2,
        borderRadius: 4,
        borderColor: neutralA3,
        paddingHorizontal: layout.spacing_x1,
        paddingVertical: layout.spacing_x0_75,
      }}
    >
      <BrandText>{"Name: " + item.name}</BrandText>
      <BrandText>{"Symbol: " + item.symbol}</BrandText>
      <BrandText>{"Decimals: " + item.decimals}</BrandText>
      <BrandText>
        {"Total Supply : " + item.totalSupply + " " + item.symbol}
      </BrandText>
      <BrandText>{item.allowMint ? "Allow Mint" : "Not Allow Mint"}</BrandText>
      <BrandText>{item.allowBurn ? "Allow Burn" : "Not Allow Burn"}</BrandText>
    </View>
  );
};

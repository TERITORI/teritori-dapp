import React from "react";
import { StyleProp, TextStyle, TouchableOpacity } from "react-native";

import { useNSUserInfo } from "../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../hooks/useSelectedNetwork";
import useSelectedWallet from "../hooks/useSelectedWallet";
import { getCosmosNetwork } from "../networks";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { useAppNavigation } from "../utils/navigation";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import FlexRow from "./FlexRow";
import { RoundedGradientImage } from "./images/RoundedGradientImage";

type PlayerNameProps = {
  userId: string;
  style?: StyleProp<TextStyle>;
};

export const UserNameInline: React.FC<PlayerNameProps> = ({
  userId,
  style,
}) => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(selectedWallet?.userId);
  const selectedNetworkId = useSelectedNetworkId();
  const network = getCosmosNetwork(selectedNetworkId);
  const name = userInfo?.metadata?.tokenId || selectedWallet?.address || "";

  return (
    <FlexRow alignItems="center" style={style}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        onPress={() => {
          navigation.navigate("UserPublicProfile", {
            id: userId,
          });
        }}
      >
        <RoundedGradientImage
          size="XXS"
          imageSource={{
            uri: ipfsURLToHTTPURL(
              userInfo?.metadata?.image ||
                network?.nameServiceDefaultImage ||
                ""
            ),
          }}
        />
        <BrandText
          style={[{ marginLeft: layout.padding_x1_5 }, fontSemibold14]}
          ellipsizeMode="middle"
          numberOfLines={1}
        >
          {name}
        </BrandText>
      </TouchableOpacity>
    </FlexRow>
  );
};

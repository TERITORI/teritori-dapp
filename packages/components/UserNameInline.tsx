import React from "react";
import { StyleProp, TextStyle, TouchableOpacity } from "react-native";

import { useTNSMetadata } from "../hooks/useTNSMetadata";
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
  const address = userId.split("-")[1];
  const tnsMetadata = useTNSMetadata(address);

  const name = tnsMetadata?.metadata?.tokenId || address || "";

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
              tnsMetadata?.metadata?.image ||
                process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL ||
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

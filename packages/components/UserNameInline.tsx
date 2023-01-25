import {useAppNavigation} from "../utils/navigation";
import {useTNSMetadata} from "../hooks/useTNSMetadata";
import FlexRow from "./containers/FlexRow";
import { StyleProp, TextStyle, TouchableOpacity} from "react-native";
import {ipfsURLToHTTPURL} from "../utils/ipfs";
import {BrandText} from "./BrandText";
import {layout} from "../utils/style/layout";
import React from "react";
import {fontSemibold14} from "../utils/style/fonts";
import {RoundedGradientImage} from "./images/RoundedGradientImage";

type PlayerNameProps = {
  userId: string;
  style?: StyleProp<TextStyle>
};

export const UserNameInline: React.FC<PlayerNameProps> = ({ userId, style }) => {
  const navigation = useAppNavigation();
  const address = userId.split("-")[1];
  const tnsMetadata = useTNSMetadata(address);

  const name = tnsMetadata?.metadata?.tokenId || address || "";

  return (
    <FlexRow alignItems="center" style={style}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          navigation.navigate("UserPublicProfile", {
            id: userId,
          });
        }}
      >
        <RoundedGradientImage
          size="XXS"
          imageSource={{ uri: ipfsURLToHTTPURL(
              tnsMetadata?.metadata?.image ||
              process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL ||
              ""
            ), }}
        />
        <BrandText
          style={[{ marginLeft: layout.padding_x1_5 }, fontSemibold14]}
          numberOfLines={1}
        >
          {name}
        </BrandText>
      </TouchableOpacity>
    </FlexRow>
  );
};

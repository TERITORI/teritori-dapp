import React from "react";
import { Image, View } from "react-native";

import emptyCircleFrameSVG from "../../../../assets/empty-circle-frame.svg";
import { getCosmosNetwork, parseUserId } from "../../../networks";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold9 } from "../../../utils/style/fonts";
import { fullSidebarWidth, layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { CustomPressable } from "../../buttons/CustomPressable";

export const SidebarProfileButton: React.FC<{
  userId: string;
  image: string;
  tokenId: string;
  isExpanded?: boolean;
}> = ({ userId, image, tokenId, isExpanded }) => {
  const navigation = useAppNavigation();
  const imageWidth = 68;
  const [network] = parseUserId(userId);
  const cosmosNetwork = getCosmosNetwork(network?.id);

  return (
    <CustomPressable
      onPress={() =>
        navigation.navigate("UserPublicProfile", {
          id: userId,
        })
      }
    >
      <View
        style={[
          {
            marginVertical: layout.padding_x1,
            marginLeft: layout.padding_x0_25,
          },
          isExpanded && { flexDirection: "row", alignItems: "center" },
        ]}
      >
        <Image
          source={{
            uri: ipfsURLToHTTPURL(
              image ? image : cosmosNetwork?.nameServiceDefaultImage || ""
            ),
          }} // TODO: proper fallback
          style={[
            {
              top: 14,
              left: 14,
              zIndex: 2,
              marginBottom: 20,
              position: "absolute",
              borderRadius: 999,
            },
            {
              width: 40,
              aspectRatio: 1,
            },
          ]}
        />
        <SVG
          source={emptyCircleFrameSVG}
          width={imageWidth}
          height={imageWidth}
        />

        <View
          style={[
            { marginLeft: layout.padding_x0_5 },
            !isExpanded && {
              maxWidth: imageWidth - layout.padding_x0_5,
              alignItems: "center",
              marginTop: layout.padding_x0_5,
            },
            isExpanded && {
              marginLeft: layout.padding_x0_5,
              maxWidth:
                fullSidebarWidth -
                imageWidth -
                layout.padding_x0_5 * 2 -
                layout.padding_x2,
            },
          ]}
        >
          <BrandText style={fontSemibold12} numberOfLines={1}>
            {`@${tokenId}`}
          </BrandText>
          <BrandText style={[fontSemibold9, { color: neutral77 }]}>
            My Profile
          </BrandText>
        </View>
      </View>
    </CustomPressable>
  );
};

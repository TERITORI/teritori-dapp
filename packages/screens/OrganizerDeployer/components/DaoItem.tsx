import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { OmniLink } from "../../../components/OmniLink";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SpacerColumn } from "../../../components/spacer";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { NetworkKind, parseUserId } from "../../../networks";
import {
  neutral17,
  neutral33,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";

interface DaoItemProps {
  userId: string;
}

export const DaoItem: React.FC<DaoItemProps> = ({ userId }) => {
  const [network, daoAddress] = parseUserId(userId);
  const {
    metadata: { image, public_name: name, public_bio: description, tokenId },
  } = useNSUserInfo(userId);
  const imageWithFallback =
    image ||
    (network?.kind === NetworkKind.Cosmos && network.nameServiceDefaultImage) ||
    "";
  const imageSize = 100;
  return (
    <OmniLink
      to={{ screen: "UserPublicProfile", params: { id: userId } }}
      style={styles.container}
    >
      <View style={{ alignItems: "center" }}>
        <OptimizedImage
          width={imageSize}
          height={imageSize}
          source={{
            uri: imageWithFallback,
          }}
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: 9999,
          }}
        />
        <SpacerColumn size={2.5} />
        <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
          {name || "Anon DAO"}
        </BrandText>
      </View>
      <SpacerColumn size={2.5} />
      <BrandText style={[fontSemibold14, { color: secondaryColor, flex: 1 }]}>
        {description || "A Decentralized Autonomous Organization"}
      </BrandText>
      <SpacerColumn size={2.5} />
      <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
        {tokenId || tinyAddress(daoAddress, 24)}
      </BrandText>
    </OmniLink>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 300,
    flexDirection: "column",
    paddingVertical: layout.padding_x2_5,
    paddingHorizontal: layout.padding_x2_5,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 12,
    marginHorizontal: layout.padding_x2,
    marginVertical: layout.padding_x2,
  },
  comingSoonText: StyleSheet.flatten([
    fontSemibold12,
    {
      position: "absolute",
      top: 0,
      right: 0,
      padding: layout.padding_x0_5,
      paddingHorizontal: layout.padding_x1,
      borderBottomLeftRadius: 12,
      borderTopRightRadius: 12,
      backgroundColor: neutral17,
    },
  ]),
});

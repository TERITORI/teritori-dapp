import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { OmniLink } from "../../../components/OmniLink";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SpacerColumn } from "../../../components/spacer";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { NetworkKind, parseUserId } from "../../../networks";
import {
  neutral17,
  neutral33,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";

interface DaoItemProps {
  userId: string;
  style?: StyleProp<ViewStyle>;
}

export const DaoItem: React.FC<DaoItemProps> = ({ userId, style }) => {
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
      style={[styles.container, style]}
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
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          {tokenId ? `@${tokenId}` : tinyAddress(daoAddress, 24)}
        </BrandText>
      </View>
      <SpacerColumn size={2.5} />
      <BrandText
        style={[fontSemibold14, { color: neutral77 }]}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {description || "A Decentralized Autonomous Organization"}
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

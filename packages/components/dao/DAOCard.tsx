import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { secondaryColor, neutral77, neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { AvatarWithFrame } from "../images/AvatarWithFrame";
import { SpacerColumn } from "../spacer";

export const DAOCard: React.FC<{
  daoId: string;
  style?: StyleProp<ViewStyle>;
}> = ({ daoId, style }) => {
  const [, daoAddress] = parseUserId(daoId);
  const {
    metadata: { public_name: name, public_bio: description, tokenId },
  } = useNSUserInfo(daoId);

  return (
    <OmniLink
      to={{ screen: "UserPublicProfile", params: { id: daoId } }}
      style={[styles.container, style]}
    >
      <View style={{ alignItems: "center" }}>
        <AvatarWithFrame userId={daoId} size="L" />
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
});

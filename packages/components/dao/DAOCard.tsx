import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { GnoDAORegistration } from "../../hooks/gno/useGnoDAOs";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { secondaryColor, neutral77, neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import {
  AvatarWithFrame,
  UserAvatarWithFrame,
} from "../images/AvatarWithFrame";
import { SpacerColumn } from "../spacer";

export const DAOCard: React.FC<{
  daoId: string;
  style?: StyleProp<ViewStyle>;
}> = ({ daoId, style }) => {
  const {
    metadata: { public_name: name, public_bio: description, tokenId },
  } = useNSUserInfo(daoId);
  return (
    <DAOCardView
      daoId={daoId}
      name={name}
      description={description}
      tokenId={tokenId}
      style={style}
      avatar={<UserAvatarWithFrame userId={daoId} size="L" />}
    />
  );
};

export const GnoDAOCard: React.FC<{
  daoId: string;
  registration: GnoDAORegistration;
  style?: StyleProp<ViewStyle>;
}> = ({ daoId, style, registration }) => {
  const [network] = parseUserId(daoId);
  return (
    <DAOCardView
      daoId={daoId}
      name={registration.name}
      description={registration.description}
      style={style}
      avatar={
        <AvatarWithFrame
          networkId={network?.id}
          image={registration.imageURI}
          isDAO
          size="L"
        />
      }
    />
  );
};

const DAOCardView: React.FC<{
  daoId: string;
  name: string | null | undefined;
  tokenId?: string | null;
  description: string | null | undefined;
  style?: StyleProp<ViewStyle>;
  avatar: React.ReactElement;
}> = ({ daoId, name, tokenId, description, style, avatar }) => {
  const [, daoAddress] = parseUserId(daoId);
  return (
    <OmniLink
      to={{ screen: "UserPublicProfile", params: { id: daoId } }}
      style={[
        {
          width: 250,
          height: 300,
          flexDirection: "column",
          paddingVertical: layout.spacing_x2_5,
          paddingHorizontal: layout.spacing_x2_5,
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius: 12,
        },
        style,
      ]}
    >
      <View style={{ alignItems: "center" }}>
        {avatar}
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

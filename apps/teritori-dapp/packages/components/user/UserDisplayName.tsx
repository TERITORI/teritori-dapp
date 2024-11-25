import { FC } from "react";
import { StyleProp, TextStyle } from "react-native";

import { BrandText } from "../BrandText";

import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { DEFAULT_NAME } from "@/utils/social-feed";
import { fontSemibold16 } from "@/utils/style/fonts";

export const UserDisplayName: FC<{
  userId: string;
  style?: StyleProp<TextStyle>;
}> = ({ userId, style }) => {
  const { metadata } = useNSUserInfo(userId);
  return (
    <BrandText style={[fontSemibold16, style]} numberOfLines={1}>
      {metadata?.public_name ||
        metadata?.tokenId?.split(".")?.[0] ||
        DEFAULT_NAME}
    </BrandText>
  );
};

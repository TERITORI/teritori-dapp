import React from "react";
import { View } from "react-native";

import { PremiumSubscriptionBottom } from "./PremiumSubscriptionBottom";
import ModalBase from "../../../../components/modals/ModalBase";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerColumn } from "@/components/spacer";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { DEFAULT_NAME } from "@/utils/social-feed";
import { neutral55, neutral77 } from "@/utils/style/colors";
import { fontBold16, fontMedium14, fontSemibold16 } from "@/utils/style/fonts";

export const PremiumSubscriptionModal: React.FC<{
  onClose: () => void;
  onSubscribe?: () => void;
  isVisible: boolean;
  userId: string;
}> = ({ onClose, onSubscribe, isVisible, userId }) => {
  const { metadata } = useNSUserInfo(userId);
  const [, userAddress] = parseUserId(userId);

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={464}
      label="Premium Subscription"
      childrenBottom={
        <PremiumSubscriptionBottom
          onSubscribe={() => {
            onClose();
            onSubscribe && onSubscribe();
          }}
        />
      }
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          marginBottom: layout.spacing_x1,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            You're going to subscribe to
          </BrandText>

          <SpacerColumn size={2} />

          <RoundedGradientImage
            sourceURI={metadata.image}
            style={{ marginRight: 24 }}
          />
          <SpacerColumn size={2} />
          <BrandText style={[fontBold16]}>
            {metadata?.tokenId ? metadata?.public_name : DEFAULT_NAME}
          </BrandText>
          <BrandText style={[fontMedium14, { color: neutral55, marginTop: 2 }]}>
            @{metadata?.tokenId ? metadata.tokenId : userAddress}
          </BrandText>
        </View>
      </View>
    </ModalBase>
  );
};

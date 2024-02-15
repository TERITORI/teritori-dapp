import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { AccordionSelectComponent } from "./AccordionSelectComponent";
import { PremiumSubscriptionBottom } from "./PremiumSubscriptionBottom";
import ModalBase from "../../../../components/modals/ModalBase";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerColumn } from "@/components/spacer";
import { MembershipConfig } from "@/contracts-clients/cw721-membership";
import { usePremiumChannel } from "@/hooks/feed/usePremiumChannel";
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
  const [network] = parseUserId(userId);
  const [user, userAddress] = parseUserId(userId);
  const { data: channel } = usePremiumChannel(user?.id, userAddress);

  const [selectedItem, setSelectedItem] = useState<MembershipConfig>();

  useEffect(() => {
    if (channel?.memberships_config) {
      setSelectedItem((prev) => {
        if (prev) {
          return prev;
        }
        return channel.memberships_config[0];
      });
    }
  }, [channel]);

  if (!user?.id || channel === undefined || !network) {
    return null;
  }

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={464}
      scrollable
      label="Premium Subscription"
      childrenBottom={
        <PremiumSubscriptionBottom
          networkId={network.id}
          item={selectedItem}
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

          <RoundedGradientImage sourceURI={metadata.image} />
          <SpacerColumn size={2} />
          <BrandText style={[fontBold16]}>
            {metadata?.tokenId ? metadata?.public_name : DEFAULT_NAME}
          </BrandText>
          <BrandText style={[fontMedium14, { color: neutral55, marginTop: 2 }]}>
            @{metadata?.tokenId ? metadata.tokenId : userAddress}
          </BrandText>
        </View>
      </View>
      <PrimaryBox
        style={{
          width: "100%",
          borderColor: "transparent",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {channel?.memberships_config?.map((memberships, index) => {
          return (
            <AccordionSelectComponent
              key={index}
              networkId={network.id}
              item={memberships}
              selectedItem={selectedItem}
              onItemSelect={(item) => {
                setSelectedItem(item);
              }}
            />
          );
        })}
      </PrimaryBox>
    </ModalBase>
  );
};

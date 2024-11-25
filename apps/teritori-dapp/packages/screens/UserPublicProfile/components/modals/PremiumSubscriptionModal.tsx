import React, { useState } from "react";
import { View } from "react-native";

import { AccordionSelectComponent } from "./AccordionSelectComponent";
import { PremiumSubscriptionBottom } from "./PremiumSubscriptionBottom";

import { BrandText } from "@/components/BrandText";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { usePremiumChannel } from "@/hooks/feed/usePremiumChannel";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getUserId, parseUserId } from "@/networks";
import { mustGetCw721MembershipSigningClient } from "@/utils/feed/client";
import { DEFAULT_NAME } from "@/utils/social-feed";
import { neutral55, neutral77 } from "@/utils/style/colors";
import { fontBold16, fontMedium14, fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const PremiumSubscriptionModal: React.FC<{
  onClose: () => void;
  isVisible: boolean;
  userId: string;
}> = ({ onClose, isVisible, userId }) => {
  const { metadata } = useNSUserInfo(userId);
  const [network, channelAddress] = parseUserId(userId);
  const { data: channel } = usePremiumChannel(network?.id, channelAddress);
  const selectedWallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();

  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const selectedItem = channel?.memberships_config[selectedItemIndex];

  if (!network?.id || channel === undefined || !network) {
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
          onSubscribe={wrapWithFeedback(async () => {
            try {
              if (!selectedItem) {
                throw new Error("No item selected");
              }
              if (!selectedWallet) {
                throw new Error("No wallet selected");
              }
              const client = await mustGetCw721MembershipSigningClient(
                selectedWallet.userId,
              );
              await client.subscribe(
                {
                  channelAddr: channelAddress,
                  membershipKind: selectedItemIndex,
                  recipientAddr: selectedWallet.address,
                },
                undefined,
                undefined,
                [
                  {
                    amount: selectedItem.price.amount,
                    denom: selectedItem.price.denom,
                  },
                ],
              );
            } finally {
              onClose();
            }
          })}
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

          <UserAvatarWithFrame
            userId={getUserId(network.id, channelAddress)}
            size="XL"
          />
          <SpacerColumn size={2} />
          <BrandText style={[fontBold16]}>
            {metadata?.tokenId ? metadata?.public_name : DEFAULT_NAME}
          </BrandText>
          <BrandText style={[fontMedium14, { color: neutral55, marginTop: 2 }]}>
            @{metadata?.tokenId ? metadata.tokenId : channelAddress}
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
              onItemSelect={() => {
                setSelectedItemIndex(index);
              }}
            />
          );
        })}
      </PrimaryBox>
    </ModalBase>
  );
};

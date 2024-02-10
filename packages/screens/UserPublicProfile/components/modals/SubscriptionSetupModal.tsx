import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { SubscriptionBottomComponent } from "./SubscriptionBottomComponent";
import { AccordionComponent } from "../accordion/AccordionComponent";

import addSVG from "@/assets/icons/add-secondary.svg";
import settingsSVG from "@/assets/icons/settings-primary.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import ModalBase from "@/components/modals/ModalBase";
import { Separator } from "@/components/separators/Separator";
import { SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  Cw721MembershipClient,
  MembershipConfig,
} from "@/contracts-clients/cw721-membership";
import { usePremiumChannel } from "@/hooks/feed/usePremiumChannel";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  getNetworkFeature,
  parseUserId,
} from "@/networks";
import { NetworkFeature } from "@/networks/features";
import {
  neutral22,
  neutral33,
  primaryColor,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalMembershipConfig } from "@/utils/types/premiumFeed";

export const SubscriptionSetupModal: React.FC<{
  userId: string;
  isVisible: boolean;
  onClose: () => void;
}> = ({ userId, isVisible, onClose }) => {
  const selectedWallet = useSelectedWallet();

  const [network, channelAddress] = parseUserId(userId);
  const networkId = network?.id;

  const { data: channel } = usePremiumChannel(networkId, channelAddress);

  const [tiers, setTiers] = useState<LocalMembershipConfig[]>([]);
  const { wrapWithFeedback } = useFeedbacks();

  useEffect(() => {
    if (!channel) {
      return;
    }
    setTiers(channel.memberships_config || []);
  }, [channel]);

  const addItem = useCallback((item: LocalMembershipConfig) => {
    setTiers((tiers) => [...tiers, item]);
  }, []);

  const removeItem = useCallback((id: number) => {
    setTiers((tiers) => tiers.filter((_, index) => index !== id));
  }, []);

  const handleChangeTier = useCallback(
    (
      index: number,
      cb: (oldTier: LocalMembershipConfig) => LocalMembershipConfig,
    ) => {
      setTiers((tiers) => {
        const updatedTiers = [...tiers];
        updatedTiers[index] = cb(updatedTiers[index]);
        return updatedTiers;
      });
    },
    [],
  );

  if (!networkId || channel === undefined) {
    return null;
  }

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={457}
      hideMainSeparator
      scrollable
      boxStyle={{ borderColor: neutral33 }}
      labelComponent={
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <SVG
              source={settingsSVG}
              height={20}
              width={20}
              color={primaryColor}
            />
            <SpacerRow size={1} />

            <BrandText style={[fontSemibold20, { color: secondaryColor }]}>
              Premium Subscription Setup
            </BrandText>
          </View>
        </View>
      }
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          marginBottom: layout.spacing_x2,
        }}
      >
        <PrimaryBox
          style={{
            width: "100%",
            borderColor: neutral33,
            backgroundColor: neutral22,
            padding: layout.spacing_x1,
            borderWidth: 1,
          }}
        >
          {tiers.map((tier, index) => {
            return (
              <AccordionComponent
                key={index}
                networkId={networkId}
                tier={tier}
                tierIndex={index}
                onChangeTier={handleChangeTier}
                onRemoveItem={() => {
                  removeItem(index);
                }}
              />
            );
          })}

          <View
            style={{
              marginTop: layout.spacing_x1,
              marginBottom: layout.spacing_x2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 32,
                width: 100,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: secondaryColor,
              }}
              onPress={() => {
                const emptyConfig: LocalMembershipConfig = {};
                addItem(emptyConfig);
              }}
            >
              <SVG source={addSVG} width={16} height={16} />
              <SpacerRow size={1} />
              <BrandText
                style={[
                  fontSemibold14,
                  { color: secondaryColor, lineHeight: layout.spacing_x2 },
                ]}
              >
                Add tier
              </BrandText>
            </TouchableOpacity>
          </View>

          <Separator />

          <SubscriptionBottomComponent
            onClose={onClose}
            onSubmit={wrapWithFeedback(async () => {
              const sender = selectedWallet?.address;
              if (!sender) {
                throw new Error("No wallet selected");
              }

              const premiumFeedFeature = getNetworkFeature(
                networkId,
                NetworkFeature.CosmWasmPremiumFeed,
              );
              if (!premiumFeedFeature) {
                throw new Error("This network does not support premium feed");
              }

              const validatedTiers = tiers.map((t) => {
                if (
                  !t.display_name ||
                  !t.description ||
                  !t.price ||
                  !t.duration_seconds
                ) {
                  throw new Error("Invalid tier");
                }
                const vt: MembershipConfig = {
                  display_name: t.display_name,
                  description: t.description,
                  price: t.price,
                  duration_seconds: t.duration_seconds,
                  nft_image_uri: t.nft_image_uri || "",
                  nft_name_prefix: "Sub",
                  trade_royalties: 80,
                };
                return vt;
              });

              const cosmWasmClient =
                await getKeplrSigningCosmWasmClient(networkId);
              const client = new Cw721MembershipClient(
                cosmWasmClient,
                sender,
                premiumFeedFeature.membershipContractAddress,
              );

              await client.upsertChannel({
                membershipsConfig: validatedTiers,
              });
            })}
          />
        </PrimaryBox>
      </View>
    </ModalBase>
  );
};

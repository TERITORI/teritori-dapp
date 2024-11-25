import { Decimal } from "@cosmjs/math";
import { isEqual } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
  ChannelResponse,
  MembershipConfig,
} from "@/contracts-clients/cw721-membership";
import { usePremiumChannel } from "@/hooks/feed/usePremiumChannel";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNativeCurrency, getNetworkFeature, parseUserId } from "@/networks";
import { NetworkFeature } from "@/networks/features";
import { bigDaySeconds } from "@/utils/big-time";
import { mustGetCw721MembershipSigningClient } from "@/utils/feed/client";
import { mapTierToFormElement } from "@/utils/feed/premium";
import {
  neutral22,
  neutral33,
  primaryColor,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  SubscriptionFormElem,
  SubscriptionFormValues,
} from "@/utils/types/premium-feed";

export const SubscriptionSetupModal: React.FC<{
  userId: string;
  isVisible: boolean;
  onClose: () => void;
}> = ({ userId, isVisible, onClose }) => {
  const [network, channelAddress] = parseUserId(userId);
  const networkId = network?.id;

  const { data: channel } = usePremiumChannel(networkId, channelAddress);

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
      <SubscriptionSetupForm
        channel={channel}
        networkId={networkId}
        onClose={onClose}
      />
    </ModalBase>
  );
};

const SubscriptionSetupForm: React.FC<{
  channel: ChannelResponse | null;
  networkId: string;
  onClose: () => void;
}> = ({ channel, networkId, onClose }) => {
  const selectedWallet = useSelectedWallet();
  const [loadStates, setLoadStates] = useState<
    Record<string, boolean | undefined>
  >({});

  const isUploadingFiles = Object.values(loadStates).some((v) => v);

  const { wrapWithFeedback } = useFeedbacks();

  const defaultValues = useMemo(() => {
    let tiers: SubscriptionFormElem[] = [];
    if (channel) {
      tiers = channel.memberships_config.map((tier) =>
        mapTierToFormElement(networkId, tier),
      );
    }
    return {
      tiers,
    };
  }, [channel, networkId]);

  const { control } = useForm<SubscriptionFormValues>({
    defaultValues,
  });

  const {
    fields: defaultFields,
    remove,
    append,
    update,
  } = useFieldArray({
    control,
    name: "tiers",
  });

  const tiers = useWatch({ control, name: "tiers" });

  const fields = useMemo(
    () =>
      tiers.map((t, index) => ({
        ...defaultFields[index],
        ...t,
      })),
    [defaultFields, tiers],
  );

  const createNewTier = useCallback(() => {
    const feature = getNetworkFeature(
      networkId,
      NetworkFeature.CosmWasmPremiumFeed,
    );
    if (!feature) {
      throw new Error("This network does not support premium feed");
    }
    const newElem: SubscriptionFormElem = {
      title: "",
      amount: "",
      denom: feature.mintDenom,
      durationDays: "",
      description: "",
      imageURI:
        "ipfs://bafybeibc4fr7vjmhsw7ysoctwg2amotnfh2lw6x2byy4wqinhn7ano55xq",
      open: false,
    };
    append(newElem);
  }, [append, networkId]);

  const { chainTiers, hasChange } = useMemo(() => {
    try {
      const validatedTiers = tiers.map((formElem) => {
        if (
          !formElem.title ||
          !formElem.description ||
          !formElem.amount ||
          !formElem.denom ||
          !formElem.durationDays ||
          !formElem.imageURI
        ) {
          throw new Error("Invalid tier");
        }
        const currency = getNativeCurrency(networkId, formElem.denom);
        if (!currency) {
          throw new Error("Invalid currency");
        }
        const atomicAmount = Decimal.fromUserInput(
          formElem.amount,
          currency.decimals,
        ).atomics;
        const durationSeconds = (
          bigDaySeconds * BigInt(formElem.durationDays)
        ).toString();
        const vt: MembershipConfig = {
          display_name: formElem.title,
          description: formElem.description,
          price: { amount: atomicAmount, denom: formElem.denom },
          duration_seconds: durationSeconds,
          nft_image_uri: formElem.imageURI,
          nft_name_prefix: "Sub",
        };
        return vt;
      });
      return {
        chainTiers: validatedTiers,
        hasChange: !isEqual(channel?.memberships_config || [], validatedTiers),
      };
    } catch (e) {
      console.error("Error validating tiers", e);
      return {
        chainTiers: undefined,
        hasChange: false,
      };
    }
  }, [channel?.memberships_config, networkId, tiers]);

  return (
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
        {fields.map((elem, index) => {
          return (
            <AccordionComponent
              key={elem.id}
              elem={elem}
              elemIndex={index}
              remove={() => {
                setLoadStates((prev) => {
                  const newState = { ...prev };
                  delete newState[elem.id];
                  return newState;
                });
                remove(index);
              }}
              setIsLoading={(value) => {
                setLoadStates((prev) => ({ ...prev, [elem.id]: value }));
              }}
              update={update}
              networkId={networkId}
              control={control}
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
              paddingHorizontal: layout.spacing_x2,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: secondaryColor,
            }}
            onPress={createNewTier}
          >
            <SVG source={addSVG} width={10} height={10} />
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
          submitDisabled={isUploadingFiles || !hasChange}
          submitLabel={channel ? "Save" : "Create"}
          onSubmit={wrapWithFeedback(async () => {
            if (!chainTiers) {
              throw new Error("Invalid tiers");
            }
            if (!selectedWallet) {
              throw new Error("No wallet selected");
            }

            const client = await mustGetCw721MembershipSigningClient(
              selectedWallet.userId,
            );

            if (channel) {
              await client.updateChannel({
                id: channel.id,
                membershipsConfig: chainTiers,
              });
            } else {
              await client.createChannel({
                membershipsConfig: chainTiers,
                tradeRoyaltiesPer10k: 800, // 8% default
              });
            }

            onClose();
          })}
        />
      </PrimaryBox>
    </View>
  );
};

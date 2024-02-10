import { Decimal } from "@cosmjs/math";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useIpfs } from "@/hooks/useIpfs";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  NetworkFeature,
  getNativeCurrency,
  getNetworkFeature,
} from "@/networks";
import { TextInputSubscriptionDuration } from "@/screens/UserPublicProfile/components/inputs/TextInputSubscriptionDuration";
import { TextInputSubscriptionMultiline } from "@/screens/UserPublicProfile/components/inputs/TextInputSubscriptionMultiline";
import { TextInputSubscriptionPrice } from "@/screens/UserPublicProfile/components/inputs/TextInputSubscriptionPrice";
import { MintUploader } from "@/screens/UserPublicProfile/components/mintUploader/mintUploader.web";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import {
  ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
  ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH, // why use those values?
} from "@/utils/social-feed";
import { errorColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  LocalMembershipConfig,
  SubscriptionFormValues,
} from "@/utils/types/premiumFeed";

interface AccordionBottomProps {
  networkId: string;
  tier: LocalMembershipConfig;
  tierIndex: number;
  onChangeTier: (
    cb: (oldTier: LocalMembershipConfig) => LocalMembershipConfig,
  ) => void;
  onRemoveItem: () => void;
}

export const AccordionBottomComponent = ({
  networkId,
  onRemoveItem,
  tierIndex,
  tier,
  onChangeTier,
}: AccordionBottomProps) => {
  const { control, watch, setValue } = useForm<SubscriptionFormValues>({
    defaultValues: [],
    mode: "onBlur",
  });
  const selectedWallet = useSelectedWallet();
  const { uploadToIPFS } = useIpfs();

  const priceKey = `${tierIndex}.price` as const;

  useEffect(() => {
    if (tier.price !== undefined) {
      const currency = getNativeCurrency(networkId, tier.price.denom);
      if (currency) {
        const userValue = Decimal.fromAtomics(
          tier.price.amount,
          currency.decimals,
        ).toString();
        setValue(priceKey, userValue);
      }
    }
    if (tier.duration_seconds !== undefined) {
      setValue(
        `${tierIndex}.duration`,
        (BigInt(tier.duration_seconds) / bigDaySeconds).toString(),
      );
    }
    if (tier.description !== undefined) {
      setValue(`${tierIndex}.description`, tier.description);
    }
  }, [networkId, priceKey, setValue, tier, tierIndex]);

  const config = getNetworkFeature(
    networkId,
    NetworkFeature.CosmWasmPremiumFeed,
  );
  const tierPriceDenom = tier.price?.denom || config?.mintDenom;
  const price = watch(priceKey);

  useEffect(() => {
    onChangeTier((tier) => {
      try {
        if (!price) {
          throw new Error("No price");
        }
        const config = getNetworkFeature(
          networkId,
          NetworkFeature.CosmWasmPremiumFeed,
        );
        if (!config) {
          throw new Error("This network does not support premium feed");
        }
        const tierPriceDenom = tier.price?.denom || config.mintDenom;
        console.log("setting price amount", price, "for tier", tier);
        const currency = getNativeCurrency(networkId, tierPriceDenom);
        if (!currency) {
          return tier;
        }
        const atomics = Decimal.fromUserInput(
          price,
          currency?.decimals,
        ).atomics;
        const newTier = {
          ...tier,
          price: { amount: atomics, denom: tierPriceDenom },
        };
        return newTier;
      } catch {
        const newTier = { ...tier, price: undefined };
        return newTier;
      }
    });
  }, [networkId, onChangeTier, price]);

  // const tierPriceAmount = tier.price?.amount || "0";

  return (
    <>
      <MintUploader
        style={{
          marginTop: layout.spacing_x3,
        }}
        fileImageStyle={{
          objectFit: "cover",
          height: ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
          maxWidth: ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
        }}
        onUpload={async (files) => {
          if (files.length !== 1) {
            throw new Error("Only one file is allowed");
          }
          if (!selectedWallet) {
            throw new Error("No wallet selected");
          }
          const file = files[0];
          const web3URI = await uploadToIPFS(selectedWallet.userId, file);
          onChangeTier((tier) => {
            const newTier = { ...tier, nft_image_uri: web3URI };
            return newTier;
          });
        }}
        defaultFile={tier.nft_image_uri}
        mimeTypes={IMAGE_MIME_TYPES}
      />

      <SpacerColumn size={1} />

      <TextInputSubscriptionPrice<SubscriptionFormValues>
        label="Price"
        placeHolder="9.99"
        networkId={networkId}
        denom={tierPriceDenom || ""}
        control={control}
        name={priceKey}
      />
      <TextInputSubscriptionDuration<SubscriptionFormValues>
        label="Tier duration"
        placeHolder="Type tier duration here"
        name={`${tierIndex}.duration`}
        onChangeText={(text) =>
          onChangeTier((tier) => {
            try {
              const durationSeconds = BigInt(text) * bigDaySeconds;
              const newTier = {
                ...tier,
                duration_seconds: durationSeconds.toString(),
              };
              return newTier;
            } catch (e) {
              console.error("Error parsing duration", e);
              return tier;
            }
          })
        }
        control={control}
      />
      <TextInputSubscriptionMultiline<SubscriptionFormValues>
        label="Tier description"
        placeHolder="Type tier description here"
        name={`${tierIndex}.description`}
        value={tier.description}
        control={control}
        onChangeText={(text) =>
          onChangeTier((tier) => {
            const newTier = { ...tier, description: text };
            return newTier;
          })
        }
      />
      <View
        style={{
          marginBottom: layout.spacing_x1,
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
            width: 126,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: errorColor,
          }}
          onPress={onRemoveItem}
        >
          <SVG source={trashSVG} width={16} height={16} />
          <SpacerRow size={1} />
          <BrandText
            style={[
              fontSemibold14,
              { color: errorColor, lineHeight: layout.spacing_x2 },
            ]}
          >
            Remove tier
          </BrandText>
        </TouchableOpacity>
      </View>
    </>
  );
};

const bigDaySeconds = BigInt(24) * BigInt(60) * BigInt(60);

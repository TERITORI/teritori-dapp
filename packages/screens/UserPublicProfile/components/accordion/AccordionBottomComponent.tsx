import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
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
import { LocalFileData } from "@/utils/types/files";
import {
  LocalMembershipConfig,
  SubscriptionFormValues,
} from "@/utils/types/premiumFeed";

interface AccordionBottomProps {
  networkId: string;
  image: string;
  tier: LocalMembershipConfig;
  tierIndex: number;
  onChangeTier: (
    cb: (oldTier: LocalMembershipConfig) => LocalMembershipConfig,
  ) => void;
  setFiles: (files: LocalFileData[]) => void;
  onRemoveItem: () => void;
}

export const AccordionBottomComponent = ({
  networkId,
  onRemoveItem,
  setFiles,
  tierIndex,
  tier,
  onChangeTier,
  image,
}: AccordionBottomProps) => {
  const { control, watch, setValue } = useForm<SubscriptionFormValues>({
    defaultValues: [],
    mode: "onBlur",
  });

  useEffect(() => {
    if (tier.price !== undefined) {
      setValue(`${tierIndex}.price`, tier.price.amount);
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
  }, [tier, setValue, tierIndex]);

  const priceKey = `${tierIndex}.price` as const;

  useEffect(() => {
    onChangeTier((tier) => {
      const inputAmount = watch(priceKey, tier.price?.amount || "0");
      const newTier = {
        ...tier,
        price: { amount: inputAmount, denom: tier.price?.denom || "utori" },
      };
      return newTier;
    });
  }, [onChangeTier, watch, priceKey]);

  const tierPriceDenom = tier.price?.denom || "utori"; // FIXME: hardcoded denom
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
        onUpload={(files) =>
          files.length > 0 ? setFiles([files?.[0]]) : setFiles([])
        }
        defaultFile={image}
        mimeTypes={IMAGE_MIME_TYPES}
      />

      <SpacerColumn size={1} />

      <TextInputSubscriptionPrice<SubscriptionFormValues>
        label="Price"
        placeHolder="9.99"
        networkId={networkId}
        denom={tierPriceDenom}
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

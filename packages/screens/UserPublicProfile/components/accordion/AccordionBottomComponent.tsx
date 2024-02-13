import React from "react";
import {
  Control,
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
} from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useIpfs } from "@/hooks/useIpfs";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature, getNetworkFeature } from "@/networks";
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
import { SubscriptionFormValues } from "@/utils/types/premium-feed";

interface AccordionBottomProps {
  networkId: string;
  control: Control<SubscriptionFormValues>;
  elem: FieldArrayWithId<SubscriptionFormValues, "tiers", "id">;
  elemIndex: number;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<SubscriptionFormValues, "tiers">;
  setIsLoading?: (value: boolean) => void;
}

export const AccordionBottomComponent = ({
  networkId,
  control,
  elem: tier,
  elemIndex: tierIndex,
  remove,
  update,
  setIsLoading,
}: AccordionBottomProps) => {
  const selectedWallet = useSelectedWallet();
  const { uploadToIPFS } = useIpfs();

  const priceKey = `tiers.${tierIndex}.amount` as const;
  const durationKey = `tiers.${tierIndex}.durationDays` as const;
  const descriptionKey = `tiers.${tierIndex}.description` as const;

  const config = getNetworkFeature(
    networkId,
    NetworkFeature.CosmWasmPremiumFeed,
  );
  const tierPriceDenom = tier?.denom || config?.mintDenom;

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
          if (!tier) {
            throw new Error("No tier");
          }
          const file = files[0];
          const web3URI = await uploadToIPFS(selectedWallet.userId, file);
          update(tierIndex, { ...tier, imageURI: web3URI });
        }}
        setIsLoading={setIsLoading}
        defaultFile={tier?.imageURI}
        mimeTypes={IMAGE_MIME_TYPES}
      />

      <SpacerColumn size={1} />

      <TextInputSubscriptionPrice
        label="Price"
        placeHolder="9.99"
        networkId={networkId}
        denom={tierPriceDenom || ""}
        control={control}
        name={priceKey}
      />
      <TextInputSubscriptionDuration
        label="Tier duration"
        placeHolder="Type tier duration here"
        name={durationKey}
        control={control}
      />
      <TextInputSubscriptionMultiline
        label="Tier description"
        placeHolder="Type tier description here"
        name={descriptionKey}
        control={control}
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
            paddingHorizontal: layout.spacing_x2,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: errorColor,
          }}
          onPress={() => remove(tierIndex)}
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

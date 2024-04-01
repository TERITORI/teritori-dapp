import React from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../CreateCollection.type";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { TextInputLaunchpadRequired } from "@/screens/Launchpad/components/inputs/TextInputLaunchpadRequired";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const ConfigureRoyaltyDetails: React.FC<{
  createCollectionForm: UseFormReturn<CollectionFormValues>;
}> = ({ createCollectionForm }) => {
  return (
    <View style={{ maxWidth: 416 }}>
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Royalty Details</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about royalty
      </BrandText>
      <SpacerColumn size={2} />

      <TextInputLaunchpadRequired<CollectionFormValues>
        label="Payment Address "
        placeHolder="teritori123456789qwertyuiopasdfghjklzxcvbnm"
        name="royaltyAddress"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Address to receive royalties
            </BrandText>
          </View>
        }
        control={createCollectionForm.control}
      />

      <TextInputLaunchpadRequired<CollectionFormValues>
        label="Share Percentage "
        placeHolder="8%"
        name="royaltyPercentage"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Percentage of royalties to be paid
            </BrandText>
          </View>
        }
        control={createCollectionForm.control}
      />
    </View>
  );
};

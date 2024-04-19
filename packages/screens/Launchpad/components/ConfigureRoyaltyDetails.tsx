import React from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../utils/types/launchpad";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const ConfigureRoyaltyDetails: React.FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();

  return (
    <View style={{ maxWidth: 416 }}>
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Royalty Details</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Configure royalties
      </BrandText>
      <SpacerColumn size={2} />

      <TextInputLaunchpad<CollectionFormValues>
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
        form={collectionForm}
        required={false}
      />

      <TextInputLaunchpad<CollectionFormValues>
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
        form={collectionForm}
        required={false}
      />
    </View>
  );
};

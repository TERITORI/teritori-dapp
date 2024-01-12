import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { neutral00, neutral55, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { NewConfigureRoyaltyDetailsFormValues } from "../CreateCollection.type";

export const ConfigureRoyaltyDetails: React.FC = () => {
  const { control } = useForm<NewConfigureRoyaltyDetailsFormValues>({
    defaultValues: {
      PaymentAddress: "",
      SharePercentage: "",
    },
    mode: "onBlur",
  });

  return (
    <View style={{ maxWidth: 416 }}>
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Royalty Details</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about royalty
      </BrandText>
      <SpacerColumn size={2} />
      <TextInputCustom<NewConfigureRoyaltyDetailsFormValues>
        rules={{ required: true }}
        label="Payment Address "
        placeHolder="teritori123456789qwertyuiopasdfghjklzxcvbnm"
        name="PaymentAddress"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Address to receive royalties
            </BrandText>
          </View>
        }
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewConfigureRoyaltyDetailsFormValues>
        rules={{ required: true }}
        label="Share Percentage "
        placeHolder="8%"
        name="SharePercentage"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Percentage of royalties to be paid
            </BrandText>
          </View>
        }
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
    </View>
  );
};

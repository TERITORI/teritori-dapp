import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { ConfigureRoyaltyDetails } from "./ConfigureRoyaltyDetails";

import { BrandText } from "@/components/BrandText";
import { DateTimeInput } from "@/components/inputs/DateTimeInput";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { LaunchpadMintPeriods } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadMinting/LaunchpadMintPeriods";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";

export const LaunchpadMinting: FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();
  const revealTime = collectionForm.watch("revealTime");
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: layout.spacing_x2,
      }}
    >
      <View style={{ maxWidth: 416, width: "100%" }}>
        <BrandText style={fontSemibold20}>Minting details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Configure the global minting settings
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="Number of Tokens "
          placeHolder="0"
          name="tokensCount"
          form={collectionForm}
        />

        <Controller<CollectionFormValues>
          name="revealTime"
          control={collectionForm.control}
          render={({ field: { onChange } }) => (
            <DateTimeInput
              label="Reveal Time"
              onChange={onChange}
              timestamp={revealTime}
              isDirty={collectionForm.getFieldState("revealTime").isDirty}
            />
          )}
        />
        <SpacerColumn size={2} />

        <Separator />
        <SpacerColumn size={2} />
        <BrandText style={fontSemibold20}>Minting Periods</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Configure the minting periods, a whitelist can be applied
        </BrandText>

        <LaunchpadMintPeriods />

        <SpacerColumn size={1} />
        <Separator />
        <ConfigureRoyaltyDetails />
      </View>
    </View>
  );
};

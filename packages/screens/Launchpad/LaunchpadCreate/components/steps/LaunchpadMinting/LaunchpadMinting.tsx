import React, { Dispatch, FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../../../../utils/types/launchpad";
import { ConfigureRoyaltyDetails } from "../../ConfigureRoyaltyDetails";

import { BrandText } from "@/components/BrandText";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import {
  LaunchpadCreateStep,
  LaunchpadCreateStepKey,
  LaunchpadStepper,
} from "@/screens/Launchpad/LaunchpadCreate/components/LaunchpadStepper";
import { LaunchpadMintPeriods } from "@/screens/Launchpad/LaunchpadCreate/components/steps/LaunchpadMinting/LaunchpadMintPeriods";
import { DateTimeInputLaunchpad } from "@/screens/Launchpad/components/inputs/DateTimeInputLaunchpad";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadMinting: FC<{
  steps: LaunchpadCreateStep[];
  setSelectedStepKey: Dispatch<React.SetStateAction<LaunchpadCreateStepKey>>;
}> = ({ steps, setSelectedStepKey }) => {
  const collectionForm = useFormContext<CollectionFormValues>();
  const revealTime = collectionForm.watch("revealTime");
  return (
    <>
      <LaunchpadStepper
        steps={steps}
        selectedStepKey={5}
        setSelectedStepKey={setSelectedStepKey}
      />
      <SpacerColumn size={4} />

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
              <DateTimeInputLaunchpad
                label="Reveal Time"
                onChange={onChange}
                timestamp={revealTime}
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
    </>
  );
};

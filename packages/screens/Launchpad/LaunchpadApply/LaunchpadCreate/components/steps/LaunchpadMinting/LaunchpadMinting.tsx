import { FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { ConfigureRoyaltyDetails } from "./ConfigureRoyaltyDetails";

import { BrandText } from "@/components/BrandText";
import { DateTimeInput } from "@/components/inputs/DateTimeInput";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { launchpadCreateFormMaxWidth } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/LaunchpadCreateScreen";
import { LaunchpadMintPeriods } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadMinting/LaunchpadMintPeriods";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium14, fontMedium20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";

interface Props {
  collectionForm: UseFormReturn<CollectionFormValues>;
}

export const LaunchpadMinting: FC<Props> = ({ collectionForm }) => {
  const revealTime = collectionForm.watch("revealTime");
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: layout.spacing_x2,
      }}
    >
      <View style={{ maxWidth: launchpadCreateFormMaxWidth, width: "100%" }}>
        <BrandText style={fontMedium20}>Minting details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontMedium14, { color: neutral77 }]}>
          Configure the global minting settings
        </BrandText>
        <SpacerColumn size={2} />

        <Controller<CollectionFormValues>
          name="revealTime"
          control={collectionForm.control}
          render={({ field: { onChange } }) => (
            <DateTimeInput
              label="Reveal Time"
              onChange={onChange}
              timestamp={revealTime}
              isDirty={collectionForm.getFieldState("revealTime").isDirty}
              required={false}
            />
          )}
        />
        <SpacerColumn size={2} />

        <Separator />
        <SpacerColumn size={2} />
        <BrandText style={fontMedium20}>Minting Periods</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontMedium14, { color: neutral77 }]}>
          Configure the minting periods, a whitelist can be applied
        </BrandText>

        <LaunchpadMintPeriods collectionForm={collectionForm} />

        <SpacerColumn size={1} />
        <Separator />
        <ConfigureRoyaltyDetails collectionForm={collectionForm} />
      </View>
    </View>
  );
};

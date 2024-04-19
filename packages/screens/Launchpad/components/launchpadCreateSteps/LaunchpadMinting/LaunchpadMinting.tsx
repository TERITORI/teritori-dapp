import React from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../../../utils/types/launchpad";
import { ConfigureRoyaltyDetails } from "../../ConfigureRoyaltyDetails";

import { BrandText } from "@/components/BrandText";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { LaunchpadMintPeriods } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/LaunchpadMintPeriods";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadMinting: React.FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: layout.spacing_x2,
      }}
    >
      <View style={{ width: 416 }}>
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

        <TextInputLaunchpad<CollectionFormValues>
          label="Reveal Time"
          placeHolder="dd.mm.yyyy | hh:mm PM"
          name="revealTime"
          form={collectionForm}
          required={false}
        />

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

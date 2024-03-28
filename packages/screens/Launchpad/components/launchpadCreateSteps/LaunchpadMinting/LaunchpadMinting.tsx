import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../CreateCollection.type";
import { ConfigureRoyaltyDetails } from "../../ConfigureRoyaltyDetails";
import { TextInputLaunchpadRequired } from "../../inputs/TextInputLaunchpadRequired";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { MintWhitelistsForm } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/mintWhitelistsForm/MintWhitelistsForm";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const CreateRoyaltyTabItems = {
  noRoyalty: {
    name: "No royalty",
  },
  configureRoyaltyDetails: {
    name: "Configure royalty details",
  },
};

export const LaunchpadMinting: React.FC<{
  createCollectionForm: UseFormReturn<CollectionFormValues>;
}> = ({ createCollectionForm }) => {
  const [selectedRoyaltyTab, setSelectedRoyaltyTab] =
    useState<keyof typeof CreateRoyaltyTabItems>("noRoyalty");

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
          Information about your minting settings
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Number of Tokens "
          placeHolder="0"
          name="nbTokens"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Unit Price"
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Price of each token (min. 50 TORI)
              </BrandText>
            </View>
          }
          placeHolder="0"
          name="unitPrice"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Per Address Limit "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Start time for the minting
              </BrandText>
            </View>
          }
          placeHolder="0"
          name="perAddressLimit"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Start Time "
          placeHolder="--.--.---- --:--"
          name="startTime"
          control={createCollectionForm.control}
        />

        <SpacerColumn size={1} />
        <BrandText style={fontSemibold20}>Whitelist Minting Details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Information about your minting settings
        </BrandText>

        <MintWhitelistsForm />

        {selectedRoyaltyTab === "configureRoyaltyDetails" && (
          <ConfigureRoyaltyDetails
            createCollectionForm={createCollectionForm}
          />
        )}
      </View>
    </View>
  );
};

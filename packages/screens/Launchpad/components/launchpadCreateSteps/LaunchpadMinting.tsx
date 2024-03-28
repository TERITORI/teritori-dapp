import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { CreateCollectionFormValues } from "../../CreateCollection.type";
import { ConfigureRoyaltyDetails } from "../ConfigureRoyaltyDetails";
import { ExistingWhitelist } from "../ExistingWhitelist";
import { NavBar } from "../NavBar";
import { NewWhitelist } from "../NewWhitelist";
import { TextInputLaunchpadRequired } from "../inputs/TextInputLaunchpadRequired";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const CreateWhitelistTabItems = {
  noWhitelist: {
    name: "No whitelist",
  },
  existingWhitelist: {
    name: "Existing whitelist",
  },
  newWhitelist: {
    name: "New whitelist",
  },
};

const CreateRoyaltyTabItems = {
  noRoyalty: {
    name: "No royalty",
  },
  configureRoyaltyDetails: {
    name: "Configure royalty details",
  },
};

export const LaunchpadMinting: React.FC<{
  createCollectionForm: UseFormReturn<CreateCollectionFormValues>;
}> = ({ createCollectionForm }) => {
  const [selectedWhitelistTab, setSelectedWhitelistTab] =
    useState<keyof typeof CreateWhitelistTabItems>("noWhitelist");
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

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
          label="Number of Tokens "
          placeHolder="0"
          name="nbTokens"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
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

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
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

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
          label="Start Time "
          placeHolder="--.--.---- --:--"
          name="startTime"
          control={createCollectionForm.control}
        />

        <NavBar
          items={CreateWhitelistTabItems}
          selected={selectedWhitelistTab}
          onSelect={setSelectedWhitelistTab}
        />

        {selectedWhitelistTab === "existingWhitelist" && (
          <ExistingWhitelist createCollectionForm={createCollectionForm} />
        )}
        {selectedWhitelistTab === "newWhitelist" && (
          <NewWhitelist createCollectionForm={createCollectionForm} />
        )}

        <NavBar
          items={CreateRoyaltyTabItems}
          selected={selectedRoyaltyTab}
          onSelect={setSelectedRoyaltyTab}
        />

        {selectedRoyaltyTab === "configureRoyaltyDetails" && (
          <ConfigureRoyaltyDetails
            createCollectionForm={createCollectionForm}
          />
        )}
      </View>
    </View>
  );
};

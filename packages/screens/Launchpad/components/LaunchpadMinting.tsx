import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { ConfigureRoyaltyDetails } from "./ ConfigureRoyaltyDetails";
import { ExistingWhitelist } from "./ExistingWhitelist";
import { NavBar } from "./NavBar";
import { NewWhitelist } from "./NewWhitelist";
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
import { NewCollectionMintFormValues } from "../CreateCollection.type";

const CreateWhitelistTabItems = {
  nowhitelist: {
    name: "No whitelist",
  },
  existinghitelist: {
    name: "Existing whitelist",
  },
  newhitelist: {
    name: "New whitelist",
  },
};

const CreateRoyaltyTabItems = {
  noroyalty: {
    name: "No royalty",
  },
  configureroyaltydetails: {
    name: "Configure royalty details",
  },
};

export const LaunchpadMinting: React.FC = () => {
  const { control } = useForm<NewCollectionMintFormValues>({
    defaultValues: {
      token: "",
      unitPrice: "",
      perAddressLimit: "",
      startTime: "",
    },
    mode: "onBlur",
  });

  const [selectedWhitelistTab, setSelectedWhitelistTab] =
    useState<keyof typeof CreateWhitelistTabItems>("nowhitelist");

  const [selectedRoyaltyTab, setSelectedRoyaltyTab] =
    useState<keyof typeof CreateRoyaltyTabItems>("noroyalty");

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

        <TextInputCustom<NewCollectionMintFormValues>
          rules={{ required: true }}
          label="Number of Tokens "
          placeHolder="0"
          name="token"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />
        <TextInputCustom<NewCollectionMintFormValues>
          rules={{ required: true }}
          label="Unit Price"
          placeHolder="0"
          name="unitPrice"
          control={control}
          variant="labelOutside"
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Price of each token (min. 50 TORI)
              </BrandText>
            </View>
          }
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <TextInputCustom<NewCollectionMintFormValues>
          rules={{ required: true }}
          label="Per Address Limit "
          placeHolder="0"
          name="perAddressLimit"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />
        <TextInputCustom<NewCollectionMintFormValues>
          rules={{ required: true }}
          label="Start Time "
          placeHolder="--.--.---- --:--"
          name="startTime"
          control={control}
          variant="labelOutside"
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Start time for the minting
              </BrandText>
            </View>
          }
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />
        <NavBar
          items={CreateWhitelistTabItems}
          selected={selectedWhitelistTab}
          onSelect={setSelectedWhitelistTab}
        />

        {selectedWhitelistTab === "existinghitelist" && <ExistingWhitelist />}
        {selectedWhitelistTab === "newhitelist" && <NewWhitelist />}

        <NavBar
          items={CreateRoyaltyTabItems}
          selected={selectedRoyaltyTab}
          onSelect={setSelectedRoyaltyTab}
        />

        {selectedRoyaltyTab === "configureroyaltydetails" && (
          <ConfigureRoyaltyDetails />
        )}
      </View>
    </View>
  );
};
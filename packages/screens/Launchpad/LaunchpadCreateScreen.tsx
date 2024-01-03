import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ConfigureRoyaltyDetails } from "./components/ ConfigureRoyaltyDetails";
import { Assets } from "./components/Assets";
import { CollectionDetails } from "./components/CollectionDetails";
import { ExistingWhitelist } from "./components/ExistingWhitelist";
import { NewWhitelist } from "./components/NewWhitelist";
import { Uri } from "./components/Uri";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { ScreenFC } from "../../utils/navigation";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const CreateCollectionTabItems = {
  assets: {
    name: "Upload assets & metadata",
  },
  uri: {
    name: "Use an existing base URI",
  },
};

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

export const LaunchpadCreateScreen: ScreenFC<"LaunchpadCreate"> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof CreateCollectionTabItems>("assets");

  const [selectedWhitelistTab, setSelectedWhitelistTab] =
    useState<keyof typeof CreateWhitelistTabItems>("nowhitelist");

  const [selectedRoyaltyTab, setSelectedRoyaltyTab] =
    useState<keyof typeof CreateRoyaltyTabItems>("noroyalty");
  return (
    <ScreenContainer fullWidth footerChildren noScroll={false}>
      <View
        style={{
          paddingHorizontal: layout.spacing_x3_5,
          alignItems: "center",
        }}
      >
        <SpacerColumn size={8} />
        <BrandText style={fontSemibold28}>Create Collection</BrandText>
        <SpacerColumn size={2} />
        <BrandText style={styles.descriptionText}>
          Make sure you check out documentation on how to create your collection
        </BrandText>
        <SpacerColumn size={2} />

        <Tabs
          items={CreateCollectionTabItems}
          selected={selectedTab}
          style={{
            height: 64,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          onSelect={setSelectedTab}
        />
        {selectedTab === "assets" && <Assets />}
        {selectedTab === "uri" && <Uri />}
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            width: "100%",
            maxWidth: 416,
          }}
        >
          <CollectionDetails />
          <Tabs
            items={CreateWhitelistTabItems}
            selected={selectedWhitelistTab}
            style={{
              height: 64,
              width: "100%",
            }}
            onSelect={setSelectedWhitelistTab}
          />

          {selectedWhitelistTab === "existinghitelist" && <ExistingWhitelist />}
          {selectedWhitelistTab === "newhitelist" && <NewWhitelist />}

          <Tabs
            items={CreateRoyaltyTabItems}
            selected={selectedRoyaltyTab}
            style={{
              height: 64,
              width: "100%",
            }}
            onSelect={setSelectedRoyaltyTab}
          />

          {selectedRoyaltyTab === "configureroyaltydetails" && (
            <ConfigureRoyaltyDetails />
          )}

          <SpacerColumn size={2} />

          <PrimaryButton
            width={224}
            size="XL"
            text="Submit"
            loader
            // onPress={formHandleSubmit(handleSubmit)}
          />
          <SpacerColumn size={2} />
        </View>
      </View>
    </ScreenContainer>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  descriptionText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
});

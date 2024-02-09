import React, { useState } from "react";
import { View } from "react-native";

import { AssetsTab } from "./AssetsTab";
import { UriTab } from "./UriTab";
import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import { neutral77, primaryColor } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../utils/style/fonts";

const AssetsandMetadataTabItems = {
  assets: {
    name: "Upload assets & metadata",
  },
  uri: {
    name: "Use an existing base URI",
  },
};

export const LaunchpadAssetsandMetadata: React.FC = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof AssetsandMetadataTabItems>("assets");

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <BrandText style={fontSemibold28}>Assets & Metadata</BrandText>

        <SpacerColumn size={2} />

        <BrandText
          style={[
            fontSemibold14,
            {
              color: neutral77,
            },
          ]}
        >
          Make sure you check out{" "}
          <BrandText
            style={[
              fontSemibold14,
              {
                color: primaryColor,
              },
            ]}
          >
            documentation
          </BrandText>{" "}
          on how to create your collection
        </BrandText>
      </View>

      <SpacerColumn size={2} />

      <Tabs
        items={AssetsandMetadataTabItems}
        selected={selectedTab}
        style={{
          height: 64,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onSelect={setSelectedTab}
      />
      {selectedTab === "assets" && <AssetsTab />}
      {selectedTab === "uri" && <UriTab />}
    </View>
  );
};

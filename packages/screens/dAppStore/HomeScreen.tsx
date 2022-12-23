import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { FullHeightSeparator } from "../../components/FullHeightSeparator";
import { FullWidthSeparator } from "../../components/FullWidthSeparator";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";
import {DAppBox, dAppType} from "./DAppBox";
import { Header } from "./Header";

interface dAppGroup {
  groupName: string;
  icon: string;
  options: dAppType[];
}

const availableApps: dAppGroup[] = [
  {
    groupName: "Teritori Core dApps",
    icon: "",
    options: [
      {
        title: "dApp 1",
        description: "Short desc",
        icon: "",
      },
      {
        title: "dApp 3",
        description: "Short desc",
        icon: "",
      },
    ],
  },
  {
    groupName: "Top Apps",
    icon: "",
    options: [
      {
        title: "dApp 1",
        description: "Short desc",
        icon: "",
      },
      {
        title: "dApp 1",
        description: "Short desc",
        icon: "",
      },
      {
        title: "dApp 1",
        description: "Short desc",
        icon: "",
      },
      {
        title: "dApp 3",
        description: "Short desc",
        icon: "",
      },
    ],
  },
  {
    groupName: "External & Permissionless dApps",
    icon: "",
    options: [
      {
        title: "dApp 1",
        description: "Short desc",
        icon: "",
      },
      {
        title: "dApp 3",
        description: "Short desc",
        icon: "",
      },
    ],
  },
];

export const dAppStore: ScreenFC<"dAppStore"> = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <ScreenContainer
      fullWidth
      headerChildren={<BrandText>dApp Store</BrandText>}
    >
      <Header setSearchInput={setSearchInput} />

      <FullWidthSeparator />

      <View style={{ flexDirection: "row", height: "100vh" }}>
        <View
          style={{
            flex: 1,
            marginLeft: "3em",
            paddingTop: 32,
            maxWidth: 300,
          }}
        >
          <BrandText style={{ height: 32 }}>dApps in sidebar</BrandText>
          <div>No apps</div>
        </View>

        <FullHeightSeparator />

        <View
          style={{
            flex: 1,
            marginLeft: "3em",
            height: 250,
            paddingTop: 32,
          }}
        >
          {availableApps.map((element, index) => {
            return (
              <View
                style={{
                  marginBottom: 16,
                }}
                key={index}
              >
                <BrandText style={{ height: 48 }}>
                  {element.groupName}
                </BrandText>
                <View
                  style={{
                    flex: 1,
                    marginBottom: 16,
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {element.options
                    .filter((option: dAppType) =>
                      option.title
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                    )
                    .map((option: dAppType, index: React.Key) => {
                      return <DAppBox key={index} option={option} />;
                    })}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScreenContainer>
  );
};

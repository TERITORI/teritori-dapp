import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { FullHeightSeparator } from "../../components/FullHeightSeparator";
import { FullWidthSeparator } from "../../components/FullWidthSeparator";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";
import { DAppBox, dAppType } from "./DAppBox";
import { Header } from "./Header";
import { SelectedDraggable } from "./SelectedDraggable";

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
        isChecked: true,
      },
      {
        title: "dApp 3",
        description: "Longer Longer Longer Longer Longer Longer Longer Longer",
        icon: "",
        isChecked: false,
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
        isChecked: false,
      },
      {
        title: "dApp 1",
        description:
          "Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer",
        icon: "",
        isChecked: false,
      },
      {
        title: "dApp 1",
        description: "Short desc",
        icon: "",
        isChecked: false,
      },
      {
        title: "dApp 3",
        description: "Short desc",
        icon: "",
        isChecked: false,
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
        isChecked: false,
      },
      {
        title: "dApp 3",
        description: "Short desc",
        icon: "",
        isChecked: false,
      },
    ],
  },
];

export const DAppStore: ScreenFC<"dAppStore"> = () => {
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
            marginLeft: "2em",
            marginRight: "1em",
            paddingTop: 32,
            maxWidth: 300,
          }}
        >
          <BrandText style={{ height: 32 }}>dApps in sidebar</BrandText>
          <View
            style={{
              flex: 1,
              height: 250,
              marginRight: "1em",
              paddingTop: 32,
            }}
          >
            {availableApps.length > 0 ? (
              availableApps.map((element, index) => {
                return (
                  <View
                    style={{
                      marginBottom: 16,
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 16,
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      {element.options
                        .filter((option: dAppType) => option.isChecked)
                        .map((option: dAppType, index: React.Key) => {
                          return <SelectedDraggable option={option} key={index} />;
                        })}
                    </View>
                  </View>
                );
              })
            ) : (
              <div>No apps</div>
            )}
          </View>
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

import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { selectAvailableApps } from "../../../store/slices/dapps-store";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";
import { DAppBox } from "./DAppBox";

export const RightRail = (props: { searchInput: string }) => {
  const availableApps = useSelector(selectAvailableApps);

  return (
    <View
      style={{
        flex: 1,
        marginLeft: "3em",
        height: 250,
        paddingTop: layout.padding_x4,
      }}
    >
      {Object.values(availableApps).map((element, index) => {
        return (
          <View
            style={{
              marginBottom: layout.padding_x2,
            }}
            key={index}
          >
            <BrandText
              style={{ height: layout.padding_x4 + layout.padding_x2 }}
            >
              {element.groupName}
            </BrandText>
            <View
              style={{
                flex: 1,
                marginBottom: layout.padding_x2,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {Object.values(element.options)
                .filter((option: dAppType) =>
                  option.title
                    .toLowerCase()
                    .includes(props.searchInput.toLowerCase())
                )
                .map((option: dAppType, index: React.Key) => {
                  return <DAppBox key={index} option={option} />;
                })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

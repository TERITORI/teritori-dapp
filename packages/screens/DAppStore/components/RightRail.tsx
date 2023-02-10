import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { selectAvailableApps } from "../../../store/slices/dapps-store";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";
import { DAppBox } from "./DAppBox";

export const RightRail = ({ searchInput }: { searchInput: string }) => {
  const availableApps = useSelector(selectAvailableApps);

  return (
    <View
      style={{
        flex: 1,
        minHeight: 250,
        maxWidth: 1024,
        paddingLeft: layout.padding_x3,
        paddingTop: layout.padding_x4,
      }}
    >
      {Object.values(availableApps).map((element, index) => {
        return element.active ? (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: layout.padding_x2_5,
              }}
            >
              <SVGorImageIcon
                icon={element.icon}
                key={element.id}
                iconSize={24}
                style={{
                  marginRight: layout.padding_x1_5,
                }}
              />
              <BrandText>{element.groupName}</BrandText>
            </View>
            <View
              style={{
                flex: 1,
                marginBottom: layout.padding_x2_5,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {Object.values(element.options)
                .filter((option: dAppType) =>
                  option.title.toLowerCase().includes(searchInput.toLowerCase())
                )
                .map((option: dAppType, index: React.Key) => {
                  return (
                    <DAppBox
                      key={index}
                      option={option}
                      style={{
                        marginRight: layout.padding_x2_5,
                        marginBottom: layout.padding_x2_5,
                      }}
                    />
                  );
                })}
            </View>
          </View>
        ) : (
          <></>
        );
      })}
    </View>
  );
};

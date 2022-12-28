import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { selectAvailableApps } from "../../../store/slices/dapps-store";
import { neutral67 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";
import { SelectedDraggable } from "./SelectedDraggable";

export const LeftRail = () => {
  const availableApps = useSelector(selectAvailableApps);

  const selectedApps = Object.values(availableApps).flatMap((element) => {
    return Object.values(element.options).filter(
      (option: dAppType) => option.isChecked
    );
  });
  const sortStrategy = (a: dAppType, b: dAppType) =>
    a.order < b.order ? -1 : 1;

  return (
    <View
      style={{
        flex: 1,
        marginLeft: layout.padding_x4,
        marginRight: layout.padding_x2,
        paddingTop: layout.padding_x4,
        maxWidth: 300,
      }}
    >
      <BrandText style={{ height: 32 }}>dApps in sidebar</BrandText>
      {selectedApps.length > 0 ? (
        <View
          style={{
            flex: 1,
            height: 250,
            marginRight: layout.padding_x4,
            paddingTop: layout.padding_x4,
          }}
        >
          {Object.values(selectedApps)
            .sort(sortStrategy)
            .map((option, index) => {
              return <SelectedDraggable option={option} key={index} />;
            })}
        </View>
      ) : (
        <BrandText
          style={{
            fontSize: 13,
            color: neutral67,
            marginTop: layout.padding_x1_5,
          }}
        >
          No dApps added to the list
        </BrandText>
      )}
    </View>
  );
};

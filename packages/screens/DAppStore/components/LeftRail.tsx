import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { selectAvailableApps } from "../../../store/slices/dapps-store";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";
import { SelectedDraggable } from "./SelectedDraggable";

export const LeftRail = () => {
  const availableApps = useSelector(selectAvailableApps);

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
      <View
        style={{
          flex: 1,
          height: 250,
          marginRight: layout.padding_x4,
          paddingTop: layout.padding_x4,
        }}
      >
        {Object.values(availableApps).length > 0 ? (
          Object.values(availableApps).map((element, index) => {
            return (
              <View
                style={{
                  marginBottom: layout.padding_x2,
                }}
                key={index}
              >
                <View
                  style={{
                    flex: 1,
                    marginBottom: layout.padding_x2,
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {Object.values(element.options)
                    .filter((option: dAppType, index) => option.isChecked)
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
  );
};

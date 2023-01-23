import React, { useState } from "react";
import { View } from "react-native";
import { DraxList, DraxProvider } from "react-native-drax";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import {
  selectCheckedApps,
  selectAvailableApps,
  setSelectedApps,
} from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import { neutral67 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { getValuesFromId } from "../query";
import { SelectedDraggable } from "./SelectedDraggable";

export const LeftRail = () => {
  const dispatch = useAppDispatch();
  const selectedApps = useSelector(selectCheckedApps);
  const availableApps = useSelector(selectAvailableApps);
  const [isDraggable, setIsDraggable] = useState(true);

  return (
    <View
      style={{
        flex: 1,
        marginLeft: layout.padding_x4,
        marginRight: layout.padding_x2,
        paddingTop: layout.padding_x4,
        maxWidth: 300,
        height: "100%",
      }}
    >
      <BrandText style={{ height: 32 }}>dApps in sidebar</BrandText>
      {selectedApps.length > 0 ? (
        <DraxProvider>
          <View
            style={{
              minHeight: 250,
              paddingTop: layout.padding_x4,
            }}
          >
            <DraxList
              data={selectedApps}
              onItemReorder={({ fromIndex, toIndex }) => {
                const newData = selectedApps.slice();
                newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
                dispatch(setSelectedApps(newData));
              }}
              itemsDraggable={isDraggable}
              renderItemContent={({ item, index }) => {
                const { appId, groupKey } = getValuesFromId(item);
                return (
                  <SelectedDraggable
                    dragHandler={setIsDraggable}
                    option={availableApps[groupKey].options[appId]}
                    index={index}
                    key={index}
                  />
                );
              }}
            />
          </View>
        </DraxProvider>
      ) : (
        <BrandText
          style={{
            fontSize: 13,
            color: neutral67,
            marginTop: layout.padding_x1_5,
            display: "flex",
          }}
        >
          No dApps added to the list
        </BrandText>
      )}
    </View>
  );
};

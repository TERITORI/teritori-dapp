import React, { useState } from "react";
import { View } from "react-native";
import { DraxList, DraxProvider } from "react-native-drax";
import { useSelector } from "react-redux";

import { SelectedDraggable } from "./SelectedDraggable";
import { BrandText } from "../../../components/BrandText";
import {
  selectAvailableApps,
  selectCheckedApps,
  setSelectedApps,
} from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import { neutral67 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { getValuesFromId } from "../query/util";

export const LeftRail = () => {
  const dispatch = useAppDispatch();
  const selectedApps = useSelector(selectCheckedApps);
  const availableApps = useSelector(selectAvailableApps);
  const [isDraggable, setIsDraggable] = useState(true);
  return (
    <View
      style={{
        flex: 1,
        marginLeft: layout.spacing_x3,
        marginRight: layout.spacing_x2,
        paddingTop: layout.spacing_x4,
        maxWidth: 300,
        height: "100%",
      }}
    >
      <BrandText style={{ marginBottom: layout.spacing_x2_5 }}>
        dApps in Sidebar
      </BrandText>
      {selectedApps.length > 0 && Object.keys(availableApps).length > 0 ? (
        <DraxProvider>
          <View
            style={{
              minHeight: 250,
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
                return availableApps ? (
                  availableApps[groupKey] ? (
                    <SelectedDraggable
                      dragHandler={setIsDraggable}
                      option={availableApps[groupKey]?.options[appId]}
                      index={index}
                      key={index}
                    />
                  ) : null
                ) : (
                  <BrandText>No apps</BrandText>
                );
              }}
              keyExtractor={(item) => item}
            />
          </View>
        </DraxProvider>
      ) : (
        <BrandText
          style={{
            fontSize: 13,
            color: neutral67,
            marginTop: layout.spacing_x1_5,
            display: "flex",
          }}
        >
          No dApps added to the list
        </BrandText>
      )}
    </View>
  );
};

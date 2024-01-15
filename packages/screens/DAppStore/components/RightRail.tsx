import React from "react";
import { useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";

import { DAppBox } from "./DAppBox";
import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { GridList } from "../../../components/layout/GridList";
import { selectAvailableApps } from "../../../store/slices/dapps-store";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";

export const RightRail = ({ searchInput }: { searchInput: string }) => {
  const availableApps = useSelector(selectAvailableApps);
  const { width } = useWindowDimensions();
  const isMobile = width < 760;
  return (
    <View
      style={{
        flex: 1,
        minHeight: 250,
        paddingHorizontal: isMobile ? 0 : layout.spacing_x3,
        paddingTop: layout.spacing_x4,
        justifyContent: isMobile ? "flex-end" : "flex-start",
      }}
    >
      {availableApps
        ? Object.values(availableApps).map((element, index) => {
            return element.active ? (
              <View
                key={element.id}
                style={{ marginBottom: layout.spacing_x4 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: isMobile ? layout.spacing_x1_5 : 0,
                    marginBottom: layout.spacing_x2_5,
                  }}
                >
                  <SVGorImageIcon
                    icon={element.icon}
                    iconSize={24}
                    style={{
                      marginRight: layout.spacing_x1_5,
                    }}
                  />
                  <BrandText>{element.groupName}</BrandText>
                </View>
                <GridList<dAppType>
                  noFixedHeight
                  keyExtractor={(item) => item.id}
                  data={Object.values(element.options).filter(
                    (option: dAppType) =>
                      option.title
                        .toLowerCase()
                        .includes(searchInput.toLowerCase()),
                  )}
                  minElemWidth={300}
                  renderItem={({ item: option }, elemWidth) => {
                    return (
                      <DAppBox
                        key={index}
                        option={option}
                        style={{ width: elemWidth }}
                      />
                    );
                  }}
                />
              </View>
            ) : (
              <></>
            );
          })
        : null}
    </View>
  );
};

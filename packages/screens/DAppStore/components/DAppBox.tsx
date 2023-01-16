import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { SecondaryBox } from "../../../components/boxes/SecondaryBox";
import {
  selectCheckedApps,
  setCheckedApp,
} from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import {
  mineShaftColor,
  neutral17,
  neutral67,
  withAlpha,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";
import { CheckboxDappStore } from "./CheckboxDappStore";

const checkBoxStyles = StyleSheet.create({
  container: {
    marginHorizontal: layout.padding_x2,
    marginVertical: layout.padding_x4,
  },
  checkbox: {
    margin: layout.padding_x1,
    width: layout.padding_x2_5,
    height: layout.padding_x2_5,
    borderRadius: 4,
    borderWidth: 1,
  },
});

export function DAppBox(props: { option: dAppType }) {
  const selectedApps = useSelector(selectCheckedApps);
  const dispatch = useAppDispatch();
  const draggableId = `${props.option.groupKey}*SEPARATOR*${props.option.id}`;
  const [isChecked, setChecked] = useState(selectedApps.includes(draggableId));

  const handleClick = () => {
    const action = {
      draggableId,
      isChecked: !isChecked,
    };
    dispatch(setCheckedApp(action));
  };

  useEffect(() => {
    setChecked(selectedApps.includes(draggableId));
  }, [selectedApps]);

  return (
    <TouchableHighlight onPress={handleClick}>
      <SecondaryBox
        height={85}
        width={320}
        noBrokenCorners
        style={{
          marginRight: 12,
          marginBottom: 12,
        }}
        mainContainerStyle={{
          alignItems: "flex-start",
          padding: layout.padding_x1,
          borderRadius: 22,
          borderColor: mineShaftColor,
          backgroundColor: isChecked ? withAlpha(neutral17, 0.64) : undefined,
          borderWidth: 1,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
        >
          <SecondaryBox
            noBrokenCorners
            style={{ marginLeft: 6 }}
            mainContainerStyle={{
              backgroundColor: withAlpha(neutral17, 0.64),
              borderRadius: 6,
              padding: 6,
            }}
            width={64}
            height={64}
            cornerWidth={5.5}
          >
            <SVGorImageIcon icon={props.option.icon} iconSize={48} />
          </SecondaryBox>
          <View
            style={{
              flexDirection: "column",
              marginLeft: layout.padding_x2,
              width: "50%",
            }}
          >
            <BrandText style={[fontMedium14]} numberOfLines={1}>
              {props.option.title}
            </BrandText>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral67, marginTop: layout.padding_x0_5 },
              ]}
              numberOfLines={1}
            >
              {props.option.description}
            </BrandText>
          </View>
          <CheckboxDappStore isChecked={isChecked} styles={checkBoxStyles} />
        </View>
      </SecondaryBox>
    </TouchableHighlight>
  );
}

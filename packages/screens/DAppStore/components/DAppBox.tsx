import React, { useEffect, useState } from "react";
import { StyleProp, TouchableHighlight, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { SecondaryBox } from "../../../components/boxes/SecondaryBox";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import {
  selectCheckedApps,
  setCheckedApp,
} from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import { neutral00, neutral17, neutral77 } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";
import { CheckboxDappStore } from "./CheckboxDappStore";

export const DAppBox: React.FC<{
  option: dAppType;
  style?: StyleProp<ViewStyle>;
}> = ({
  option: { description, groupKey, icon, id, title, alwaysOn },
  style,
}) => {
  const selectedApps = useSelector(selectCheckedApps);
  const dispatch = useAppDispatch();
  const draggableId = `${groupKey}*SEPARATOR*${id}`;
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
  }, [selectedApps, draggableId]);

  return (
    <TouchableHighlight onPress={handleClick} disabled={alwaysOn}>
      <TertiaryBox
        height={88}
        width={306}
        noBrokenCorners
        style={style}
        mainContainerStyle={{
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          flexDirection: "row",
          paddingVertical: layout.padding_x1_5,
          paddingLeft: layout.padding_x1_5,
          paddingRight: layout.padding_x2_5,
          borderRadius: 20,
          backgroundColor: isChecked ? neutral17 : neutral00,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SecondaryBox
            noBrokenCorners
            mainContainerStyle={{
              backgroundColor: neutral17,
              borderRadius: 12,
              padding: layout.padding_x1,
            }}
            width={64}
            height={64}
          >
            <SVGorImageIcon icon={icon} iconSize={48} />
          </SecondaryBox>
          <View
            style={{
              marginHorizontal: layout.padding_x2,
              maxWidth: 158,
              width: "100%",
            }}
          >
            <BrandText style={fontSemibold14} numberOfLines={1}>
              {title}
            </BrandText>
            <BrandText
              isTicker
              style={[
                fontSemibold13,
                { color: neutral77, marginTop: layout.padding_x0_5 },
              ]}
            >
              {description}
            </BrandText>
          </View>
        </View>

        {!alwaysOn ? <CheckboxDappStore isChecked={isChecked} /> : null}
      </TertiaryBox>
    </TouchableHighlight>
  );
};

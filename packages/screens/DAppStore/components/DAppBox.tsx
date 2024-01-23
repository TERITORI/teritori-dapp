import React, { useEffect, useState } from "react";
import { Pressable, StyleProp, useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";

import { CheckboxDappStore } from "./CheckboxDappStore";
import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { Box, BoxStyle } from "../../../components/boxes/Box";
import {
  selectCheckedApps,
  setCheckedApp,
} from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import {
  neutral00,
  neutral17,
  neutral33,
  neutral77,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SEPARATOR } from "../query/util";
import { dAppType } from "../types";

export const DAppBox: React.FC<{
  option: dAppType;
  style?: StyleProp<BoxStyle>;
}> = ({
  option: { description, groupKey, icon, id, title, alwaysOn },
  style,
}) => {
  const selectedApps = useSelector(selectCheckedApps);
  const dispatch = useAppDispatch();
  const draggableId = `${groupKey}${SEPARATOR}${id}`;
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
  const { width } = useWindowDimensions();
  const isMobile = width < 760;

  return (
    <Pressable onPress={handleClick} disabled={alwaysOn}>
      <Box
        style={[
          {
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingVertical: layout.spacing_x1_5,
            paddingLeft: layout.spacing_x1_5,
            paddingRight: layout.spacing_x2_5,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: neutral33,
            backgroundColor: isChecked ? neutral17 : neutral00,
            height: 88,
            width: isMobile ? width * 0.8 : 306,
          },
          style,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Box
            style={{
              backgroundColor: neutral17,
              borderRadius: 12,
              padding: layout.spacing_x1,
              width: 64,
              height: 64,
            }}
          >
            <SVGorImageIcon icon={icon} iconSize={48} />
          </Box>
          <View
            style={{
              marginHorizontal: layout.spacing_x2,
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
                { color: neutral77, marginTop: layout.spacing_x0_5 },
              ]}
            >
              {description}
            </BrandText>
          </View>
        </View>

        {!alwaysOn && <CheckboxDappStore isChecked={isChecked} />}
      </Box>
    </Pressable>
  );
};

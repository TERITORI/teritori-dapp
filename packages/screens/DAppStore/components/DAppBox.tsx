import React, { useEffect, useState } from "react";
import { Pressable, StyleProp, View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "@/components/BrandText";
import { Checkbox } from "@/components/Checkbox";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { Box, BoxStyle } from "@/components/boxes/Box";
import { selectCheckedApps, setCheckedApp } from "@/store/slices/dapps-store";
import { useAppDispatch } from "@/store/store";
import { SEPARATOR } from "@/utils/dapp-store";
import {
  neutral00,
  neutral17,
  neutral33,
  neutral77,
} from "@/utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { dAppType } from "@/utils/types/dapp-store";

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

  return (
    <Pressable onPress={handleClick} disabled={alwaysOn}>
      <Box
        style={[
          {
            alignItems: "center",
            flexDirection: "row",
            padding: layout.spacing_x1_5,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: neutral33,
            backgroundColor: isChecked ? neutral17 : neutral00,
            height: 88,
          },
          style,
        ]}
      >
        <Box
          style={{
            backgroundColor: isChecked ? neutral00 : neutral17,
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
            flex: 1,
          }}
        >
          <BrandText style={fontSemibold14} numberOfLines={1}>
            {title}
          </BrandText>
          <BrandText
            isTicker
            style={[
              fontSemibold13,
              {
                color: neutral77,
                marginTop: layout.spacing_x0_5,
              },
            ]}
          >
            {description}
          </BrandText>
        </View>

        {!alwaysOn && <Checkbox isChecked={isChecked} />}
      </Box>
    </Pressable>
  );
};

import React, { useEffect, useState } from "react";
import {
  StyleProp,
  TouchableHighlight,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { useSelector } from "react-redux";

import { CheckboxDappStore } from "./CheckboxDappStore";
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
import { SEPARATOR } from "../query/util";
import { dAppType } from "../types";

export const DAppBox: React.FC<{
  option: dAppType;
  style?: StyleProp<ViewStyle>;
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
    <TouchableHighlight onPress={handleClick} disabled={alwaysOn}>
      <TertiaryBox
        height={88}
        width={isMobile ? width * 0.8 : 306}
        noBrokenCorners
        style={style}
        mainContainerStyle={{
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          flexDirection: "row",
          paddingVertical: layout.spacing_x1_5,
          paddingLeft: layout.spacing_x1_5,
          paddingRight: layout.spacing_x2_5,
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
              padding: layout.spacing_x1,
            }}
            width={64}
            height={64}
          >
            {!!icon && <SVGorImageIcon icon={icon} iconSize={48} />}
          </SecondaryBox>
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
      </TertiaryBox>
    </TouchableHighlight>
  );
};

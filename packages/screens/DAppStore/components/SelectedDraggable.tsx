import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { TrashIcon, Bars3Icon } from "react-native-heroicons/solid";
import { Hoverable } from "react-native-hoverable";

import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { Box } from "../../../components/boxes/Box";
import { setCheckedApp } from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import {
  errorColor,
  neutral33,
  neutral44,
  neutral67,
  withAlpha,
} from "../../../utils/style/colors";
import { fontBold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SEPARATOR } from "../query/util";
import { dAppType } from "../types";

export const SelectedDraggable: React.FC<{
  option?: dAppType;
  index: number;
  dragHandler: (value: boolean) => void;
}> = ({ dragHandler, index, option }) => {
  const { groupKey, icon, id, title, alwaysOn } = option || {};
  const [showTrashIcon, setShowTrashIcon] = useState(false);
  const dispatch = useAppDispatch();
  const draggableId = `${groupKey}${SEPARATOR}${id}`;
  const deleteFromList = () => {
    const action = {
      draggableId,
      isChecked: false,
    };
    dispatch(setCheckedApp(action));
    dragHandler(true);
  };

  return (
    <Hoverable
      onMouseEnter={() => setShowTrashIcon(true)}
      onMouseLeave={() => setShowTrashIcon(false)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: layout.spacing_x1,
      }}
    >
      <Hoverable
        onMouseEnter={() => {
          if (!alwaysOn) {
            setShowTrashIcon(true);
          }
          dragHandler(false);
        }}
        onMouseLeave={() => {
          dragHandler(true);
        }}
      >
        <TouchableOpacity onPress={deleteFromList} disabled={alwaysOn}>
          <Box
            style={{
              backgroundColor: !showTrashIcon
                ? withAlpha(neutral33, 0.64)
                : withAlpha(errorColor, 0.14),
              width: 32,
              height: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BrandText
              style={[fontBold12, { color: neutral67 }]}
              numberOfLines={1}
            >
              {showTrashIcon ? <TrashIcon size={14} fill="red" /> : index + 1}
            </BrandText>
          </Box>
        </TouchableOpacity>
      </Hoverable>

      <Box
        style={{
          marginLeft: layout.spacing_x1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: layout.spacing_x1_5,
          paddingLeft: layout.spacing_x1_5,
          paddingRight: layout.spacing_x2,
          width: 256,
          height: 48,
          borderWidth: 1,
          borderColor: neutral33,
          ...Platform.select({
            web: {
              cursor: "grab",
            },
          }),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!!icon && <SVGorImageIcon icon={icon} iconSize={24} />}

          <BrandText
            style={[fontBold12, { marginLeft: layout.spacing_x1_5 }]}
            numberOfLines={1}
          >
            {title}
          </BrandText>
        </View>

        <Bars3Icon size={24} fill={neutral44} />
      </Box>
    </Hoverable>
  );
};

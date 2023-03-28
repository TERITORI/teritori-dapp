import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { TrashIcon, Bars3Icon } from "react-native-heroicons/solid";
import { Hoverable } from "react-native-hoverable";

import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { SecondaryBox } from "../../../components/boxes/SecondaryBox";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
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

export function SelectedDraggable({
  dragHandler,
  index,
  option: { groupKey, icon, id, title, alwaysOn },
}: {
  option: dAppType;
  index: number;
  dragHandler: (value: boolean) => void;
}) {
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
        marginBottom: layout.padding_x1,
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
          <SecondaryBox
            noBrokenCorners
            mainContainerStyle={{
              backgroundColor: !showTrashIcon
                ? withAlpha(neutral33, 0.64)
                : withAlpha(errorColor, 0.14),
            }}
            width={32}
            height={48}
          >
            <BrandText
              style={[fontBold12, { color: neutral67 }]}
              numberOfLines={1}
            >
              {showTrashIcon ? <TrashIcon size={14} fill="red" /> : index + 1}
            </BrandText>
          </SecondaryBox>
        </TouchableOpacity>
      </Hoverable>

      <TertiaryBox
        height={48}
        width={256}
        noBrokenCorners
        style={{
          marginLeft: layout.padding_x1,
          ...Platform.select({
            web: {
              cursor: "grab",
            },
          }),
        }}
        mainContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: layout.padding_x1_5,
          paddingLeft: layout.padding_x1_5,
          paddingRight: layout.padding_x2,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVGorImageIcon icon={icon} iconSize={24} />

          <BrandText
            style={[fontBold12, { marginLeft: layout.padding_x1_5 }]}
            numberOfLines={1}
          >
            {title}
          </BrandText>
        </View>

        <Bars3Icon size={24} fill={neutral44} />
      </TertiaryBox>
    </Hoverable>
  );
}

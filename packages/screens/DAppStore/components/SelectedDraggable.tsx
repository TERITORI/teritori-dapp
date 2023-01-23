import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { TrashIcon, Bars3Icon } from "react-native-heroicons/solid";
import { Hoverable } from "react-native-hoverable";

import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { SecondaryBox } from "../../../components/boxes/SecondaryBox";
import { setCheckedApp } from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import {
  errorColor,
  mineShaftColor,
  neutral17,
  neutral33,
  neutral44,
  neutral67,
  withAlpha,
} from "../../../utils/style/colors";
import { fontBold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { dAppType } from "../types";

export function SelectedDraggable(props: {
  option: dAppType;
  index: number;
  dragHandler: (value: boolean) => void;
}) {
  const [showTrashIcon, setShowTrashIcon] = useState(false);
  const dispatch = useAppDispatch();
  const draggableId = `${props.option.groupKey}*SEPARATOR*${props.option.id}`;
  const deleteFromList = () => {
    const action = {
      draggableId,
      isChecked: false,
    };
    dispatch(setCheckedApp(action));
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
      <TouchableOpacity onPress={deleteFromList}>
        <Hoverable
          onMouseEnter={() => {
            setShowTrashIcon(true);
            props.dragHandler(false);
          }}
          onMouseLeave={() => props.dragHandler(true)}
        >
          <SecondaryBox
            noBrokenCorners
            style={{
              marginLeft: 6,
              ...Platform.select({
                web: {
                  cursor: "pointer",
                },
              }),
            }}
            mainContainerStyle={{
              backgroundColor: !showTrashIcon
                ? withAlpha(neutral33, 0.64)
                : withAlpha(errorColor, 0.14),
            }}
            width={32}
            height={50}
          >
            <BrandText
              style={[fontBold12, { color: neutral67 }]}
              numberOfLines={1}
            >
              {showTrashIcon ? (
                <TrashIcon size={14} fill="red" />
              ) : (
                props.index + 1
              )}
            </BrandText>
          </SecondaryBox>
        </Hoverable>
      </TouchableOpacity>
      <SecondaryBox
        height={50}
        width={256}
        noBrokenCorners
        style={{
          marginLeft: 5,
        }}
        mainContainerStyle={{
          alignItems: "flex-start",
          borderRadius: 8,
          borderColor: mineShaftColor,
          borderWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            ...Platform.select({
              web: {
                cursor: "grab",
              },
            }),
          }}
        >
          <SecondaryBox
            noBrokenCorners
            style={{ marginLeft: 6 }}
            mainContainerStyle={{
              backgroundColor: withAlpha(neutral17, 0.64),
              padding: 2,
            }}
            width={48}
            height={48}
          >
            <SVGorImageIcon icon={props.option.icon} iconSize={48} />
          </SecondaryBox>
          <View
            style={{
              flexDirection: "column",
              marginLeft: 16,
              width: "58%",
            }}
          >
            <BrandText style={[fontBold12]} numberOfLines={1}>
              {props.option.title}
            </BrandText>
          </View>
          <Bars3Icon size={24} fill={neutral44} />
        </View>
      </SecondaryBox>
    </Hoverable>
  );
}

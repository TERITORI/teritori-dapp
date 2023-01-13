import { TrashIcon } from "@heroicons/react/20/solid";
import { Bars3Icon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TouchableOpacity, View } from "react-native";

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

export function SelectedDraggable(props: { option: dAppType; index: number }) {
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
    <Draggable
      key={props.option.id}
      draggableId={draggableId}
      index={props.index}
    >
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          // const offset = document.getElementById(
          //   "left-rail-drag-container"
          // )?.offsetTop;
          // @ts-ignore
          provided.draggableProps.style.left = 48;
          // @ts-ignore
          provided.draggableProps.style.top =
            // @ts-ignore
            provided.draggableProps.style.top + 100;
        }
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: layout.padding_x1,
            }}
            onMouseEnter={() => setShowTrashIcon(true)}
            onMouseLeave={() => setShowTrashIcon(false)}
          >
            <TouchableOpacity onPress={deleteFromList}>
              <SecondaryBox
                noBrokenCorners
                style={{ marginLeft: 6 }}
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
                    <TrashIcon
                      style={{
                        width: 14,
                        height: 14,
                        stroke: "#cc3a43",
                      }}
                    />
                  ) : (
                    props.index + 1
                  )}
                </BrandText>
              </SecondaryBox>
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
                <div ref={provided.innerRef} {...provided.dragHandleProps}>
                  <Bars3Icon
                    style={{
                      width: 24,
                      height: 24,
                      stroke: neutral44,
                    }}
                  />
                </div>
              </View>
            </SecondaryBox>
          </div>
        );
      }}
    </Draggable>
  );
}

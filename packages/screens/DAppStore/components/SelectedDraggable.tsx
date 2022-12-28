import { TrashIcon } from "@heroicons/react/20/solid";
import { Bars3Icon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { View } from "react-native";

import burnSVG from "../../../../assets/icons/burn.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SecondaryBox } from "../../../components/boxes/SecondaryBox";
import { removePinnedApp } from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import {
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

export function SelectedDraggable(props: { option: dAppType }) {
  const [showTrashIcon, setShowTrashIcon] = useState(false);
  const dispatch = useAppDispatch();

  const deleteFromList = () => {
    const action = {
      appId: props.option.id,
    };
    dispatch(removePinnedApp(action));
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: layout.padding_x1,
      }}
      onMouseEnter={() => setShowTrashIcon(true)}
      onMouseLeave={() => setShowTrashIcon(false)}
    >
      <SecondaryBox
        noBrokenCorners
        style={{ marginLeft: 6 }}
        mainContainerStyle={{
          backgroundColor: withAlpha(neutral33, 0.64),
        }}
        width={32}
        height={50}
      >
        <BrandText style={[fontBold12, { color: neutral67 }]} numberOfLines={1}>
          {showTrashIcon ? (
            <TrashIcon
              style={{
                width: 24,
                height: 24,
                stroke: "red",
              }}
              onClick={deleteFromList}
            />
          ) : (
            props.option.order
          )}
        </BrandText>
      </SecondaryBox>

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
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
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
            <SVG source={burnSVG} />
          </SecondaryBox>
          <View
            style={{ flexDirection: "column", marginLeft: 16, width: "58%" }}
          >
            <BrandText style={[fontBold12]} numberOfLines={1}>
              {props.option.title}
            </BrandText>
          </View>
          <Bars3Icon
            style={{
              width: 24,
              height: 24,
              stroke: neutral44,
            }}
          />
        </View>
      </SecondaryBox>
    </div>
  );
}

import React, { Dispatch, FC, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";

import blackCricleSVG from "@/assets/icons/black-check.svg";
import crossSVG from "@/assets/icons/cross.svg";
import penSVG from "@/assets/icons/pen.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { BoxStyle } from "@/components/boxes/Box";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { SpacerRow } from "@/components/spacer";
import { primaryColor, primaryTextColor } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const EditButton: FC<{
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onPressSave: () => void;
  onPressCancel: () => void;
  isSaveDisabled?: boolean;
}> = ({
  isEditing,
  setIsEditing,
  onPressCancel,
  onPressSave,
  isSaveDisabled,
}) => {
  return (
    <View>
      {isEditing ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              onPressCancel();
            }}
            style={{ alignSelf: "flex-start" }}
          >
            <View style={boxBtn}>
              <SVG
                source={crossSVG}
                color={primaryTextColor}
                style={{ height: 16, width: 16 }}
              />
              <BrandText
                style={[
                  fontSemibold13,
                  { color: primaryTextColor, marginLeft: layout.spacing_x1 },
                ]}
              >
                Cancel
              </BrandText>
            </View>
          </TouchableOpacity>

          <SpacerRow size={1} />

          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              onPressSave();
            }}
            style={{ alignSelf: "flex-start" }}
            disabled={isSaveDisabled}
          >
            <View style={[boxBtn, isSaveDisabled && { opacity: 0.5 }]}>
              <SVG source={blackCricleSVG} />
              <BrandText
                style={[
                  fontSemibold13,
                  { color: primaryTextColor, marginLeft: layout.spacing_x0_75 },
                ]}
              >
                Save changes
              </BrandText>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={{ alignSelf: "flex-start" }}
        >
          <PrimaryBox
            style={{
              paddingRight: layout.spacing_x1_5,
              paddingLeft: layout.spacing_x1,
              paddingVertical: layout.spacing_x1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 40,
            }}
          >
            <View style={{ marginBottom: layout.spacing_x0_5 }}>
              <SVG width={20} height={20} source={penSVG} color="white" />
            </View>
            <BrandText
              style={[fontSemibold12, { marginLeft: layout.spacing_x0_75 }]}
            >
              Edit content
            </BrandText>
          </PrimaryBox>
        </TouchableOpacity>
      )}
    </View>
  );
};

const boxBtn: BoxStyle = {
  flexDirection: "row",
  alignSelf: "flex-start",
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
  backgroundColor: primaryColor,
  height: 40,
};

import React, { Dispatch, FC, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";

import blackCricleSVG from "@/assets/icons/black-check.svg";
import penSVG from "@/assets/icons/pen.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { BoxStyle } from "@/components/boxes/Box";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { neutral17, primaryColor } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const EditButton: FC<{
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  saveChanges: () => void;
}> = ({ isEditing, setIsEditing, saveChanges }) => {
  return (
    <View>
      {isEditing ? (
        <>
          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              saveChanges();
            }}
            style={{ alignSelf: "flex-start" }}
          >
            <View style={boxBtn}>
              <SVG source={blackCricleSVG} />
              <BrandText
                style={[fontSemibold13, { color: neutral17, marginLeft: 5 }]}
              >
                Save changes
              </BrandText>
            </View>
          </TouchableOpacity>
        </>
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
  marginTop: layout.spacing_x3,
};

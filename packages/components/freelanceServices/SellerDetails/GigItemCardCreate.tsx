import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import addCircle from "../../../../assets/icons/add-circle.svg";
import { useAppNavigation } from "../../../utils/navigation";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const GigItemCardCreate: React.FC<{
  width: number;
  height: number;
  mainContainerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
}> = ({ width, height, mainContainerStyle, boxStyle }) => {
  const navigation = useAppNavigation();

  return (
    <TertiaryBox
      width={width}
      height={height}
      mainContainerStyle={[mainContainerStyle]}
      style={[boxStyle]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("FreelanceServicesGigCreation");
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SVG source={addCircle} width={60} height={60} />
            <BrandText style={[fontSemibold14, { marginTop: 10 }]}>
              Create a new Gig
            </BrandText>
          </View>
        </TouchableOpacity>
      </View>
    </TertiaryBox>
  );
};

import React from "react";
import { View, ViewStyle, TextInput, useWindowDimensions } from "react-native";

import penSVG from "../../../../../assets/icons/pen.svg";

import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { neutral77, neutralA3, secondaryColor } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  value: string;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: ViewStyle;
};

export const SimpleCommentInput = ({
  value,
  onBlur,
  onFocus,
  style,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  return (
    <CustomPressable onPress={onFocus}>
      <View
        style={{
          borderRadius: layout.borderRadius,
          borderWidth: 1,
          borderColor: neutralA3,
          paddingHorizontal: layout.spacing_x1,
          paddingVertical: layout.spacing_x0_75,
          marginHorizontal: layout.spacing_x2,
          ...style,
        }}
      >
        <FlexRow style={{ alignItems: "center" }}>
          <SVG
            height={24}
            width={24}
            source={penSVG}
            color={secondaryColor}
            style={{
              alignSelf: "flex-end",
              marginRight: layout.spacing_x1_5,
            }}
          />
          <TextInput
            value={value}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Hey yo! Write your comment"
            placeholderTextColor={neutral77}
            multiline
            readOnly
            style={[
              fontSemibold16,
              {
                height: 30,
                color: secondaryColor,
                width: windowWidth - 150,
                alignSelf: "center",
              },
            ]}
            onPressOut={onFocus}
          />
        </FlexRow>
      </View>
    </CustomPressable>
  );
};

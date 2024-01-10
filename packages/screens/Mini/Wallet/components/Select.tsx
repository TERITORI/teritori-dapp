import React, { ReactNode, useRef, useState } from "react";
import { Animated, Dimensions, TextInput, View } from "react-native";

import chevronDownSVG from "../../../../../assets/icons/chevron-down-gray.svg";
import chevronDownWhiteSVG from "../../../../../assets/icons/chevron-down-white.svg";
import eyeLensSVG from "../../../../../assets/icons/search-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { Separator } from "../../../../components/separators/Separator";
import {
  neutral22,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontMedium16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type Props = {
  selected: string;
  options: {
    value: string;
    label: string | ReactNode;
    record?: any;
    subLabel?: string;
  }[];
  onSelect: (text: string, record?: any) => void;
  onSearchChange?: (text: string) => void;
  searchValue?: string;
  placeholder?: string;
};

export const Select = ({
  options,
  selected,
  onSearchChange,
  searchValue,
  onSelect,
  placeholder = "Select",
}: Props) => {
  const [showOptions, setShowOPtions] = useState(false);
  const rotationValue = useRef(new Animated.Value(1)).current;

  const toggleShowOptions = () => {
    setShowOPtions((prev) => !prev);
    Animated.timing(rotationValue, {
      toValue: showOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <CustomPressable
      onPress={toggleShowOptions}
      style={{
        height: showOptions ? Dimensions.get("window").height : "auto",
      }}
    >
      <View
        style={{
          backgroundColor: neutral22,
          borderColor: showOptions ? neutral77 : "transparent",
          borderWidth: 1,
          borderRadius: 10,
          position: "relative",
          zIndex: 100,
          borderBottomEndRadius: showOptions ? 0 : 10,
          borderBottomStartRadius: showOptions ? 0 : 10,
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
        }}
      >
        <CustomPressable
          onPress={toggleShowOptions}
          style={{
            paddingHorizontal: layout.spacing_x2,
            paddingVertical: layout.spacing_x1_5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText
            style={[
              fontMedium16,
              { color: showOptions || selected ? secondaryColor : neutral77 },
            ]}
          >
            {selected || placeholder}
          </BrandText>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["180deg", "0deg"],
                  }),
                },
              ],
            }}
          >
            <SVG
              source={showOptions ? chevronDownWhiteSVG : chevronDownSVG}
              height={24}
              width={24}
            />
          </Animated.View>
        </CustomPressable>
        {showOptions && (
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: -1,
              right: -1,
              zIndex: 99999,
              backgroundColor: neutral22,
              borderColor: neutral77,
              borderWidth: 1,
              borderBottomEndRadius: 10,
              borderBottomStartRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#000",
                marginHorizontal: layout.spacing_x2_5,
                marginVertical: layout.spacing_x1,
                padding: layout.spacing_x0_75,
                borderRadius: 10,
              }}
            >
              <SVG source={eyeLensSVG} height={24} width={24} />
              <TextInput
                value={searchValue}
                onChangeText={onSearchChange}
                placeholder="Search"
                placeholderTextColor={neutralA3}
                style={[fontMedium16, { flex: 1, color: secondaryColor }]}
              />
            </View>
            <View>
              {Array.isArray(options) &&
                options.map((opt, idx) => (
                  <React.Fragment key={`${opt.value}-${idx}`}>
                    <CustomPressable
                      onPress={() => {
                        onSelect(opt.value, opt.record);
                        toggleShowOptions();
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: layout.spacing_x2,
                        paddingVertical: layout.spacing_x1_5,
                      }}
                    >
                      {opt.label && typeof opt.label === "string" ? (
                        <BrandText style={[fontMedium16, {}]}>
                          {opt.label}
                        </BrandText>
                      ) : (
                        opt.label
                      )}
                      {opt.subLabel && (
                        <BrandText style={[fontMedium16, { color: neutralA3 }]}>
                          {opt.subLabel}
                        </BrandText>
                      )}
                    </CustomPressable>
                    {idx + 1 < options.length && <Separator />}
                  </React.Fragment>
                ))}
            </View>
          </View>
        )}
      </View>
    </CustomPressable>
  );
};

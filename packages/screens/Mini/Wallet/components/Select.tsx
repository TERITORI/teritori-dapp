import React, { FC, ReactNode, useRef, useState } from "react";
import { Animated, useWindowDimensions, View } from "react-native";
import { SvgProps } from "react-native-svg";

import chevronDownSVG from "../../../../../assets/icons/chevron-down-gray.svg";
import chevronDownWhiteSVG from "../../../../../assets/icons/chevron-down-white.svg";
import eyeLensSVG from "../../../../../assets/icons/search-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { Separator } from "../../../../components/separators/Separator";
import {
  neutral22,
  neutral39,
  neutral77,
  neutralA3,
  secondaryColor,
  withAlpha,
} from "../../../../utils/style/colors";
import { fontMedium16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import MiniTextInput from "../../components/MiniTextInput";

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
  enableIconAnimation?: boolean;
  icon?: FC<SvgProps> | string;
};

export const Select = ({
  options,
  selected,
  onSearchChange,
  searchValue,
  onSelect,
  placeholder = "Select",
  enableIconAnimation = true,
  icon,
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
  const { height: windowHeight } = useWindowDimensions();

  return (
    <CustomPressable
      onPress={toggleShowOptions}
      style={{
        height: showOptions ? windowHeight : "auto",
      }}
    >
      <View
        style={{
          backgroundColor: neutral22,
          borderColor: showOptions
            ? withAlpha(secondaryColor, 0.12)
            : "transparent",
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
          {enableIconAnimation ? (
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
          ) : (
            <View
              style={{
                backgroundColor: neutral39,
                borderRadius: 18,
                paddingHorizontal: 14,
                paddingVertical: 4,
              }}
            >
              <SVG
                source={icon ? icon : chevronDownSVG}
                height={24}
                width={24}
              />
            </View>
          )}
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
              borderColor: withAlpha(secondaryColor, 0.12),
              borderWidth: 1,
              borderBottomEndRadius: 10,
              borderBottomStartRadius: 10,
            }}
          >
            <View
              style={{
                paddingHorizontal: layout.spacing_x1,
                marginVertical: 10,
                width: "100%",
              }}
            >
              <MiniTextInput
                icon={eyeLensSVG}
                style={{
                  backgroundColor: "#000",
                  paddingVertical: layout.spacing_x1,
                  paddingHorizontal: layout.spacing_x1_5,
                }}
                value={searchValue}
                onChangeText={onSearchChange}
                placeholder="Search"
                placeholderTextColor={neutralA3}
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

import { LinearGradient } from "expo-linear-gradient";
import React, { ComponentType } from "react";
import { Modal, Pressable, View, StyleProp, ViewStyle } from "react-native";

import closeSVG from "../../../assets/icons/close.svg";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SeparatorGradient } from "../SeparatorGradient";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const ModalGradient: React.FC<{
  label?: string;
  onClose?: () => void;
  width?: number;
  visible?: boolean;
  Header?: ComponentType;
  childrenBottom?: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
  hideMainSeparator?: boolean;
  description?: string;
  displayHeader?: boolean;
  displayLinearGradient?: boolean;
  ColorLinearGradient?: string[];
  labelColor?: string;
  leftSquaresBackgroundColor?: string;
  rightSquaresBackgroundColor?: string;
  mainContainerStyle?: StyleProp<ViewStyle>;
}> = ({
  label,
  visible,
  width,
  onClose,
  childrenBottom,
  children,
  Header,
  hideMainSeparator,
  description,
  displayHeader = true,
  ColorLinearGradient = ["#000000"],
  displayLinearGradient = false,
  labelColor = "white",
  leftSquaresBackgroundColor = "#000000",
  rightSquaresBackgroundColor = "#000000",
  mainContainerStyle = { margin: "auto" },
}) => {
  return (
    <Modal
      style={{}}
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      {/*------ Modal background */}
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, .8)",
        }}
      >
        {/*------ Modal main container */}
        <TertiaryBox
          width={width}
          style={[mainContainerStyle]}
          differentSquaresColor
          leftSquaresBackgroundColor={leftSquaresBackgroundColor}
          rightSquaresBackgroundColor={rightSquaresBackgroundColor}
          mainContainerStyle={{
            alignItems: "flex-start",
            backgroundColor: "white",
          }}
        >
          <LinearGradient
            locations={[0.5, 0.8]}
            style={{ borderRadius: 7 }}
            colors={ColorLinearGradient}
          >
            {/*------ Modal header */}
            {displayHeader && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: modalMarginPadding,
                }}
              >
                {label && (
                  <BrandText
                    style={{
                      color: labelColor,
                      lineHeight: 24,
                    }}
                  >
                    {label}
                  </BrandText>
                )}

                {Header && <Header />}

                <Pressable onPress={onClose}>
                  <SVG
                    width={20}
                    height={20}
                    source={closeSVG}
                    style={{ marginLeft: modalMarginPadding }}
                  />
                </Pressable>
              </View>
            )}

            {children && (
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: modalMarginPadding,
                }}
              >
                {/*------- Modal main content */}
                {hideMainSeparator !== true && (
                  <SeparatorGradient
                    style={{ marginBottom: modalMarginPadding }}
                  />
                )}
                {children}
              </View>
            )}
            {/*------- Modal bottom content */}
            {childrenBottom}
          </LinearGradient>
        </TertiaryBox>
      </View>
    </Modal>
  );
};

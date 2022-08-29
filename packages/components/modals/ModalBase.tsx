import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, StyleProp, View, ViewStyle } from "react-native";

import closeSVG from "../../../assets/icons/close.svg";
import { neutral22 } from "../../utils/style/colors";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

// Just an horizontal gradient separator
const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View style={[{ height: 1, width: "100%" }, style]}>
    {/* Background gradient */}
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height: "100%", width: "100%" }}
      colors={["#2AF598", "#009EFD"]}
    />
  </View>
);

// The base components for modals. You can provide children (Modal's content) and childrenBottom (Optional Modal's bottom content)
export const ModalBase: React.FC<{
  label: string;
  onClose: () => void;
  width?: number;
  visible?: boolean;
  childrenBottom?: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
}> = ({ label, visible, width, onClose, childrenBottom, children }) => {
  return (
    <Modal
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
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
          style={{ margin: "auto" }}
          mainContainerStyle={{
            alignItems: "flex-start",
            backgroundColor: neutral22,
          }}
        >
          {/*------ Modal header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: modalMarginPadding,
            }}
          >
            <BrandText style={{ color: "white", lineHeight: 24 }}>
              {label}
            </BrandText>

            <Pressable onPress={onClose}>
              <SVG
                width={20}
                height={20}
                source={closeSVG}
                style={{ marginLeft: modalMarginPadding }}
              />
            </Pressable>
          </View>
          {children && (
            <View style={{ marginHorizontal: modalMarginPadding }}>
              {/*------- Modal main content */}
              <Separator style={{ marginBottom: modalMarginPadding }} />
              {children}
            </View>
          )}
          {/*------- Modal bottom content */}
          {childrenBottom}
        </TertiaryBox>
      </View>
    </Modal>
  );
};

export default ModalBase;

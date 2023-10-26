import { LinearGradient } from "expo-linear-gradient";
import React, { ComponentType } from "react";
import {
  Modal,
  Pressable,
  View,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import chevronLeft from "../../../assets/icons/chevron-left.svg";
import closeSVG from "../../../assets/icons/close.svg";
import {
  errorColor,
  neutral00,
  neutral17,
  neutral22,
  neutral33,
  successColor,
} from "../../utils/style/colors";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SeparatorGradient } from "../separators/SeparatorGradient";

const getModalColors = (status?: ModalBaseProps["modalStatus"]) => {
  switch (status) {
    case "danger":
      return [neutral00, errorColor];
    case "success":
      return [neutral00, successColor];
    case "dark":
      return [neutral00, neutral33];
    default:
      return [neutral00];
  }
};
// TODO: Simplify this component (Useless childrenBottom ?. Better to let the parent totally decides which children to use ? Used in WalletManager.tsx, be careful !)

type ModalBaseProps = {
  label?: string;
  onClose?: () => void;
  onBackPress?: () => void;
  width?: number;
  visible?: boolean;
  Header?: ComponentType;
  childrenBottom?: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
  hideMainSeparator?: boolean;
  modalStatus?: "danger" | "success" | "dark";
  scrollable?: boolean;
  contentStyle?: ViewStyle;
};

// The base components for modals. You can provide children (Modal's content) and childrenBottom (Optional Modal's bottom content)
const GradientModalBase: React.FC<ModalBaseProps> = ({
  label,
  visible,
  width,
  onClose,
  onBackPress,
  childrenBottom,
  children,
  Header,
  hideMainSeparator,
  modalStatus,
  scrollable,
  contentStyle,
}) => {
  return (
    <Modal
      style={{ flex: 1 }}
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      {/*------ Modal background */}
      <ScrollView
        scrollEnabled={scrollable}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, .8)",
        }}
        contentContainerStyle={[
          {
            alignItems: "center",
            justifyContent: "center",
          },
          scrollable
            ? {
                marginVertical: 20,
              }
            : {
                height: "100%",
                width: "100%",
              },
        ]}
      >
        {/*------ Modal main container */}
        <View
          style={[
            {
              margin: "auto",
              width,
              alignItems: "flex-start",
              backgroundColor: "#000000",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: neutral33,
              padding: modalMarginPadding,
            },
            contentStyle,
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              top: "40%",
              left: 0,
              bottom: 0,
              right: 0,
            }}
            colors={getModalColors(modalStatus)}
          />

          {/*------ Modal header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {onBackPress && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    height: 32,
                    width: 32,
                    backgroundColor: neutral22,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                  onPress={onBackPress}
                >
                  <SVG source={chevronLeft} height={12} width={12} />
                </TouchableOpacity>
              )}
              {label && (
                <BrandText style={{ color: "white", lineHeight: 24 }}>
                  {label}
                </BrandText>
              )}
            </View>

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
          {children && (
            <View
              style={{
                width: "100%",
                paddingHorizontal: 12,
                paddingVertical: 12,
                backgroundColor: neutral17,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: neutral33,
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
        </View>
      </ScrollView>
    </Modal>
  );
};

export default GradientModalBase;

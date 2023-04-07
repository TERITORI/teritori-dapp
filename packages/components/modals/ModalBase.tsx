import React, { ComponentType } from "react";
import {
  Modal,
  View,
  ScrollView,
  ViewComponent,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import chevronLeft from "../../../assets/icons/chevron-left.svg";
import closeSVG from "../../../assets/icons/close.svg";
import { neutral77, neutral22 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SeparatorGradient } from "../SeparatorGradient";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerColumn } from "../spacer";

// TODO: Simplify this component (Useless childrenBottom ?. Better to let the parent totally decides which children to use ? Used in WalletManager.tsx, be careful !)

type ModalBaseProps = {
  label?: string;
  labelComponent?: React.FC | ViewComponent | JSX.Element;
  onClose?: () => void;
  onBackPress?: () => void;
  width?: number;
  visible?: boolean;
  Header?: ComponentType;
  childrenBottom?: JSX.Element | JSX.Element[];
  hideMainSeparator?: boolean;
  description?: string;
  noBrokenCorners?: boolean;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  closeButtonStyle?: ViewStyle;
};

// The base components for modals. You can provide children (Modal's content) and childrenBottom (Optional Modal's bottom content)
export const ModalBase: React.FC<ModalBaseProps> = ({
  label,
  labelComponent,
  visible,
  width,
  onClose,
  childrenBottom,
  children,
  Header,
  hideMainSeparator,
  description,
  scrollable,
  contentStyle,
  containerStyle,
  onBackPress,
  noBrokenCorners,
  closeButtonStyle,
}) => {
  return (
    <Modal
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      {/*------ Modal background */}
      <ScrollView
        scrollEnabled={scrollable}
        style={[
          {
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, .8)",
          },
          containerStyle,
        ]}
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
        <TertiaryBox
          width={width}
          style={{ margin: "auto" }}
          mainContainerStyle={[
            {
              alignItems: "flex-start",
              backgroundColor: "#000000",
            },
            contentStyle,
          ]}
          noBrokenCorners={noBrokenCorners}
        >
          {/*------ Modal header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              padding: modalMarginPadding,
            }}
          >
            {(label || labelComponent || description) && (
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
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

                <View style={{ flex: 1, width: "100%" }}>
                  {label && (
                    <BrandText style={{ color: "white", lineHeight: 24 }}>
                      {label}
                    </BrandText>
                  )}

                  {labelComponent}

                  {description && (
                    <>
                      <SpacerColumn size={1} />
                      <BrandText
                        style={[
                          fontSemibold14,
                          {
                            color: neutral77,
                            width: "100%",
                            lineHeight: 20,
                            flexWrap: "wrap",
                          },
                        ]}
                      >
                        {description}
                      </BrandText>
                    </>
                  )}
                </View>
              </View>
            )}

            {Header && <Header />}

            <TouchableOpacity
              containerStyle={[
                { marginLeft: modalMarginPadding },
                closeButtonStyle,
              ]}
              style={{ justifyContent: "center" }}
              onPress={onClose}
            >
              <SVG width={20} height={20} source={closeSVG} />
            </TouchableOpacity>
          </View>
          {children && (
            <View
              style={{ width: "100%", paddingHorizontal: modalMarginPadding }}
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
        </TertiaryBox>
      </ScrollView>
    </Modal>
  );
};

export default ModalBase;

import React, { ComponentType } from "react";
import { Modal, Pressable, View } from "react-native";

import closeSVG from "../../../assets/icons/close.svg";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SeparatorGradient } from "../SeparatorGradient";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerColumn } from "../spacer";

// TODO: Simplify this component (Useless childrenBottom ?. Better to let the parent totally decides which children to use ? Used in WalletManager.tsx, be careful !)

// The base components for modals. You can provide children (Modal's content) and childrenBottom (Optional Modal's bottom content)
export const ModalBase: React.FC<{
  label?: string;
  onClose?: () => void;
  width?: number;
  visible?: boolean;
  Header?: ComponentType;
  childrenBottom?: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
  hideMainSeparator?: boolean;
  description?: string;
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
            backgroundColor: "#000000",
          }}
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
            <View style={{ flex: 1 }}>
              {label && (
                <BrandText style={{ color: "white", lineHeight: 24 }}>
                  {label}
                </BrandText>
              )}

              {description && (
                <>
                  <SpacerColumn size={1} />
                  <BrandText
                    style={[
                      fontSemibold14,
                      { color: neutral77, width: "100%", lineHeight: 20 },
                    ]}
                  >
                    {description}
                  </BrandText>
                </>
              )}
            </View>

            {Header && <Header />}

            <Pressable
              style={{ marginTop: layout.padding_x0_25 }}
              onPress={onClose}
            >
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
      </View>
    </Modal>
  );
};

export default ModalBase;

import React from "react";
import { Modal, View } from "react-native";

import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SeparatorGradient } from "../separators/SeparatorGradient";

// TODO: Simplify this component (Useless childrenBottom ?. Better to let the parent totally decides which children to use ? Used in WalletManager.tsx, be careful !)

// The base components for modals. You can provide children (Modal's content) and childrenBottom (Optional Modal's bottom content)
const ModalBaseTest: React.FC<{
  label: string;
  onClose?: () => void;
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
            backgroundColor: "#000000",
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

            {/* <Pressable onPress={onClose}>
              <SVG
                width={20}
                height={20}
                source={closeSVG}
                style={{ marginLeft: modalMarginPadding }}
              />
            </Pressable> */}
          </View>
          {children && (
            <View
              style={{ width: "100%", paddingHorizontal: modalMarginPadding }}
            >
              {/*------- Modal main content */}
              <SeparatorGradient style={{ marginBottom: modalMarginPadding }} />
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

export default ModalBaseTest;

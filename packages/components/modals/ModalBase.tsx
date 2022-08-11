import { LinearGradient } from "expo-linear-gradient";
import React, { ReactElement, useRef } from "react";
import { Modal, Pressable, View, ViewStyle, Image } from "react-native";

import crossPNG from "../../../assets/icons/cross.png";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { neutral23, neutral33 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";

// Just an horizontal separator
const Separator: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[{ height: 1 }, style]}>
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
  childrenBottom?: ReactElement;
}> = ({ label, visible, width, onClose, childrenBottom, children }) => {
  const mainContainerRef = useRef(null);
  useOnClickOutside(mainContainerRef, onClose);

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
        <View
          ref={mainContainerRef}
          style={{
            backgroundColor: neutral23,
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 8,
            width: width || "fit-content",
            margin: "auto",
          }}
        >
          {/*------ Modal main wrapper */}
          <View style={{ padding: 20 }}>
            {/*------ Modal header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BrandText style={{ color: "white", lineHeight: 24 }}>
                {label}
              </BrandText>

              <Pressable onPress={onClose}>
                <Image
                  style={{ height: 20, width: 20, marginLeft: 20 }}
                  source={crossPNG}
                />
              </Pressable>
            </View>
            {children && (
              <>
                {/*------- Modal main content */}
                <Separator style={{ marginVertical: 20 }} />
                {children}
              </>
            )}
          </View>
          {/*------- Modal bottom content */}
          <>{childrenBottom}</>
        </View>
      </View>
    </Modal>
  );
};

export default ModalBase;

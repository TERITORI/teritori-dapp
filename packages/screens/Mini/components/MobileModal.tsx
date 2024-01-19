import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren } from "react";
import {
  SafeAreaView,
  View,
  Modal,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from "react-native";

import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { neutral22 } from "../../../utils/style/colors";

interface MobileModalProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  innerContainerOptions?: {
    style?: StyleProp<ViewStyle>;
    height?: DimensionValue;
  };
}

export default function MobileModal({
  visible,
  onClose,
  children,
  innerContainerOptions = { style: {}, height: "75%" },
}: MobileModalProps) {
  const { style, height } = innerContainerOptions;

  return (
    <Modal
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
        onTouchCancel={onClose}
      >
        <CustomPressable style={{ flex: 1 }} onPress={onClose}>
          <View style={{ flex: 1 }}>{}</View>
        </CustomPressable>
        <View
          style={[
            {
              height: height ?? "75%",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              position: "relative",
            },
            style ?? {},
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={[neutral22, "#000"]}
            style={{
              flex: 1,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              position: "absolute",
              zIndex: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

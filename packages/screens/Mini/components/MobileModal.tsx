import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren, useEffect, useState } from "react";
import {
  KeyboardAvoidingView as KeyboardAvoiding,
  DimensionValue,
  Modal,
  SafeAreaView,
  StyleProp,
  View,
  ViewStyle,
  Keyboard,
} from "react-native";

import { CustomPressable } from "@/components/buttons/CustomPressable";
import { neutral22 } from "@/utils/style/colors";

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
  innerContainerOptions = { style: {}, height: "85%" },
}: MobileModalProps) {
  const { style } = innerContainerOptions;
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  console.log(keyboardVisible);

  return (
    <Modal
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
        onTouchCancel={onClose}
      >
        <CustomPressable style={{ flex: 1 }} onPress={onClose}>
          <View style={{ flex: 1 }} />
        </CustomPressable>

        <KeyboardAvoiding
          behavior="padding"
          keyboardVerticalOffset={keyboardVisible ? 150 : 0}
          style={{
            flex: 0.7,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: "relative",
          }}
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
          <View
            style={[
              {
                flex: 1,

                position: "relative",
              },
              style ?? {},
            ]}
          >
            {children}
          </View>
        </KeyboardAvoiding>
      </SafeAreaView>
    </Modal>
  );
}

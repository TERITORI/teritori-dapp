import * as React from "react";
import { View, Modal } from "react-native";

import { AnimatedLoader } from "./AnimatedLoader";

export const LoaderFullScreen: React.FC<{ visible: boolean }> = ({
  visible,
}) => {
  return (
    <Modal visible={visible} transparent>
      <LoaderFullSize />
    </Modal>
  );
};

export const LoaderFullSize: React.FC = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        backgroundColor: "rgba(0,0,0,.8)",
        position: "absolute",
      }}
    >
      <AnimatedLoader />
    </View>
  );
};

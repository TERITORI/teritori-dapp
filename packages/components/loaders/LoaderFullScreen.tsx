import * as React from "react";
import { View, Modal } from "react-native";

import { AnimatedLoader } from "./AnimatedLoader";

export const LoaderFullScreen: React.FC<{ visible: boolean }> = ({
  visible,
}) => {
  return (
    <Modal visible={visible} transparent>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,.8)",
          position: "absolute",
          zIndex: 10,
        }}
      >
        <AnimatedLoader />
      </View>
    </Modal>
  );
};

import * as React from "react";
import { View, Modal } from "react-native";

import Lottie from "../Lottie";

export const LoaderFullScreen: React.FC<{ visible: boolean }> = ({
  visible,
}) => {
  return (
    <Modal visible={visible} transparent>
      <View
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,.8)",
          position: "absolute",
          zIndex: 10,
        }}
      >
        <View
          style={{
            height: 80,
            width: 80,
            borderRadius: 999,
            margin: "auto",
          }}
        >
          <Lottie
            animationData={require("./animation-full-screen.json")}
            autoPlay
            loop
          />
        </View>
      </View>
    </Modal>
  );
};

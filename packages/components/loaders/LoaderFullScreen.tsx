import Lottie from "lottie-react";
import * as React from "react";
import { View, Modal } from "react-native";

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
  );
};

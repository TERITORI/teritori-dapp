import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import { ProgressBar } from "react-native-paper";

import closeIcon from "../../../../assets/icons/Pathwar/closeIcon.svg";
import warningGreenIcon from "../../../../assets/icons/Pathwar/warningGreenIcon.svg";
import { SVG } from "../../../components/SVG";
import { BrandText } from "../../BrandText/BrandText";
import ModalBase from "../../modals/ModalBase";

const useProgress = (maxTimeInSeconds = 60) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (progress < 1) {
        setElapsedTime((t) => t + 1);
      }
    }, 10);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setProgress(elapsedTime / maxTimeInSeconds);
  }, [elapsedTime]);

  return progress;
};

export const ModalValidation: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [displayStateValidation, setDisplayStateValidation] = useState(visible);
  const progress = useProgress();
  const { width } = useWindowDimensions();

  function handleConfirmClick() {
    onClose();
    setDisplayStateValidation(false);
  }

  return (
    <ModalBase
      visible={displayStateValidation}
      width={350}
      hideMainSeparator
      displayHeader={false}
      mainContainerStyle={{ marginLeft: width - 355, marginTop: 5 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          margin: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            right: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG source={warningGreenIcon} />
          <BrandText style={{ fontSize: 16, marginLeft: 10 }}>
            Validate Challenge Success!
          </BrandText>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleConfirmClick();
          }}
          style={{ left: 30 }}
        >
          <SVG source={closeIcon} />
        </TouchableOpacity>
      </View>
      <View style={{ width: 340, right: 19, borderRadius: 1 }}>
        <ProgressBar
          progress={progress}
          color="#C8FFAE"
          style={{ borderBottomLeftRadius: 30 }}
        />
      </View>
    </ModalBase>
  );
};

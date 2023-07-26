import React, { useEffect, useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import { ProgressBar } from "react-native-paper";

import closeIcon from "../../../../../assets/icons/Pathwar/closeIcon.svg";
import warningGreenIcon from "../../../../../assets/icons/Pathwar/warningGreenIcon.svg";
import { successColor } from "../../../../utils/style/colors";
import { fontSemibold16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";
import { ModalBase } from "../../../modals/ModalBase";

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
  }, [progress]);

  useEffect(() => {
    setProgress(elapsedTime / maxTimeInSeconds);
  }, [elapsedTime, maxTimeInSeconds]);

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
      containerStyle={{
        marginLeft: width - 355,
        marginTop: layout.padding_x0_5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          margin: layout.padding_x2_5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingRight: layout.padding_x4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG source={warningGreenIcon} />
          <BrandText
            style={[{ marginLeft: layout.padding_x1 }, fontSemibold16]}
          >
            Validate Challenge Success!
          </BrandText>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleConfirmClick();
          }}
          style={{ marginLeft: layout.padding_x2 }}
        >
          <SVG source={closeIcon} />
        </TouchableOpacity>
      </View>
      <View style={{ width: 340, right: 19, borderRadius: 1 }}>
        <ProgressBar
          progress={progress}
          color={successColor}
          style={{ borderBottomLeftRadius: 30 }}
        />
      </View>
    </ModalBase>
  );
};

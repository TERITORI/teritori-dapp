import React, { useState } from "react";
import { View } from "react-native";

import { Challenge } from "../../../../api/pathwar/v1/pathwar";
import {
  neutral00,
  neutral17,
  successColor,
} from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";
import { OptimizedImage } from "../../../OptimizedImage";
import { TertiaryBox } from "../../../boxes/TertiaryBox";
import { ModalGradient } from "../../../modals/ModalGradient";
import { RightRail } from "../DetailsCard";

export const ChallengeValidation: React.FC<{
  visible?: boolean;
  onClose: () => void;
  data: Challenge;
}> = ({ visible, onClose, data }) => {
  const [displayConfirmation, setDisplayConfirmation] = useState(visible);

  function handleConfirmClick() {
    onClose();
    setDisplayConfirmation(false);
  }

  return (
    <ModalGradient
      onClose={() => {
        handleConfirmClick();
      }}
      label="You have successfully passed this challenge"
      visible={displayConfirmation}
      width={500}
      labelColor={successColor}
      hideMainSeparator
      ColorLinearGradient={[neutral00, successColor]}
    >
      <TertiaryBox
        width={458}
        style={{ marginBottom: layout.padding_x2_5 }}
        mainContainerStyle={{ backgroundColor: neutral17 }}
        // squaresBackgroundColor={successColor}
        noRightBrokenBorder
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: layout.padding_x1_5,
            marginBottom: layout.padding_x2_5,
          }}
        >
          <TertiaryBox
            width={430}
            height={350}
            squaresBackgroundColor={neutral17}
            style={{ marginBottom: layout.padding_x2_5 }}
          >
            <OptimizedImage
              sourceURI={data.thumbnail}
              style={{
                borderTopRightRadius: 7,
                borderBottomLeftRadius: 7,
                width: 428,
                height: 348,
              }}
              width={428}
              height={348}
            />
          </TertiaryBox>

          <RightRail data={data} />
        </View>
      </TertiaryBox>
    </ModalGradient>
  );
};

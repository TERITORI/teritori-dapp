import React from "react";
import { Image, View } from "react-native";

import contributionIllustrationPNG from "../../../../assets/social-feeds/contribution-illustration.png";
import { fontSemibold13, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn } from "../../spacer";

type FlagConfirmedModalProps = {
  onClose: (nextModalName?: string) => void;
  isVisible: boolean;
};

export const FlagConfirmedModal: React.FC<FlagConfirmedModalProps> = ({
  onClose,
  isVisible,
}) => {
  const checkDetails = async () => {
    onClose("FlagDetailsModal");
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={640}
      labelComponent={
        <BrandText style={fontSemibold16}>
          Moderation contribution confirmed
        </BrandText>
      }
    >
      <View style={{ alignItems: "center" }}>
        <SpacerColumn size={4} />

        <Image
          source={contributionIllustrationPNG}
          style={{
            width: 200,
            height: 200,
            marginVertical: layout.spacing_x2,
          }}
        />

        <SpacerColumn size={2.5} />

        <BrandText style={fontSemibold13}>
          Thank you Teritorian, for contributing to make the Cosmos Safe.
        </BrandText>

        <SpacerColumn size={2.5} />

        <PrimaryButton
          size="SM"
          text="Check Details"
          onPress={checkDetails}
          width={160}
        />
      </View>
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

import React from "react";
import { Image, View } from "react-native";

import contributionIllustrationPNG from "../../../../assets/social-feeds/contribution-illustration.png";
import { fontSemibold13, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn } from "../../spacer";

type FlagDetailsModalProps = {
  postId: string;
  onClose: (nextModalName?: string) => void;
  isVisible: boolean;
};

export const FlagDetailsModal: React.FC<FlagDetailsModalProps> = ({
  postId,
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
          Community Opinions about this content
        </BrandText>
      }
    >
      <View style={{ alignItems: "center" }}>
        <SpacerColumn size={4} />

        <FlexRow style={{ justifyContent: "space-evenly" }}>
          <Image
            source={contributionIllustrationPNG}
            style={{
              width: 200,
              height: 200,
              marginVertical: layout.padding_x2,
            }}
          />

          <View>
            <BrandText style={fontSemibold13}>fdsfdss Safe.</BrandText>
            <BrandText style={fontSemibold13}>fdsfdss Safe.</BrandText>
            <BrandText style={fontSemibold13}>fdsfdss Safe.</BrandText>
          </View>
        </FlexRow>

        <SpacerColumn size={2.5} />

        <PrimaryButton
          size="SM"
          text="OKEY, bye."
          onPress={checkDetails}
          width={120}
          style={{ alignSelf: "center" }}
        />
      </View>
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

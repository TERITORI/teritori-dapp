import React, { useState } from "react";
import { Image, View } from "react-native";

import contributionIllustrationPNG from "../../../../assets/social-feeds/contribution-illustration.png";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../spacer";

type FlagConfirmModalProps = {
  postId: string;
  onClose: (nextModalName?: string) => void;
  isVisible: boolean;
};

type VoteOption = "banPost" | "dontBanPost";

export const FlagConfirmModal: React.FC<FlagConfirmModalProps> = ({
  postId,
  onClose,
  isVisible,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToastError } = useFeedbacks();

  const confirmVote = async (vote: VoteOption) => {
    setIsLoading(true);

    try {
    } catch (err: any) {
      console.error(err);
      setToastError({ title: "Vote failed", message: err.message });
    } finally {
      onClose("FlagConfirmedModal");
      setIsLoading(false);
    }
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={640}
      labelComponent={
        <FlexRow>
          <BrandText style={fontSemibold16}>
            Confirm your contribution to moderation
          </BrandText>
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            (Cannot be changed later)
          </BrandText>
        </FlexRow>
      }
    >
      <View style={{ alignItems: "center" }}>
        <SpacerColumn size={2.5} />

        <BrandText style={fontSemibold13}>
          This selected content will be banned from Teritori OS Interface.
        </BrandText>

        <SpacerColumn size={2.5} />

        <Image
          source={contributionIllustrationPNG}
          style={{
            width: 200,
            height: 200,
            marginVertical: layout.padding_x2,
          }}
        />

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <SecondaryButton
            size="SM"
            text="Don't ban"
            loader
            onPress={() => confirmVote("dontBanPost")}
            width={120}
          />

          <PrimaryButton
            size="SM"
            text="Ban"
            loader
            isLoading={isLoading}
            onPress={() => confirmVote("banPost")}
            width={120}
          />
        </View>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};

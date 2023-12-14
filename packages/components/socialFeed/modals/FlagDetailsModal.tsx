import React from "react";
import { Image, View } from "react-native";
import PieChart from "react-native-pie-chart";

import contributionIllustrationPNG from "../../../../assets/social-feeds/contribution-illustration.png";
import { useGetBanPostProposalById } from "../../../hooks/feed/useBanPostProposals";
import { primaryColor, purpleDark } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold16 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn } from "../../spacer";

type FlagDetailsModalProps = {
  proposalId: string;
  networkId: string;
  onClose: (nextModalName?: string) => void;
  isVisible: boolean;
};

const ILLUSTRATION_SIZE = 200;

export const FlagDetailsModal: React.FC<FlagDetailsModalProps> = ({
  proposalId,
  networkId,
  onClose,
  isVisible,
}) => {
  const proposal = useGetBanPostProposalById(networkId, proposalId);

  const checkDetails = async () => {
    onClose("FlagDetailsModal");
  };

  const totalVoteBan = proposal?.votes?.yes;
  const totalVoteNoBan = proposal?.votes?.no;
  const totalVotes = totalVoteBan + totalVoteNoBan;
  const voteBanPercent =
    totalVotes === 0
      ? 0
      : Math.round((totalVoteBan / (totalVoteBan + totalVoteNoBan)) * 100);
  const voteNoBanPercent = 100 - voteBanPercent;

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
          <View
            style={{
              position: "relative",
              width: ILLUSTRATION_SIZE,
              height: ILLUSTRATION_SIZE,
            }}
          >
            <PieChart
              widthAndHeight={ILLUSTRATION_SIZE}
              series={[voteBanPercent, voteNoBanPercent]}
              sliceColor={[purpleDark, primaryColor]}
              coverRadius={0.8}
              coverFill={null}
              style={{ position: "absolute", zIndex: 2 }}
            />

            <Image
              source={contributionIllustrationPNG}
              style={{
                width: ILLUSTRATION_SIZE - 10,
                height: ILLUSTRATION_SIZE - 10,
                top: 2,
                left: 5,
                position: "absolute",
              }}
            />
          </View>

          <View>
            <BrandText style={fontSemibold13}>
              Vote for Ban: {totalVoteBan} votes ({voteBanPercent}%)
            </BrandText>

            <SpacerColumn size={2} />

            <BrandText style={fontSemibold13}>
              Vote for No Ban: {totalVoteNoBan} votes ({voteNoBanPercent}%)
            </BrandText>

            <SpacerColumn size={2} />

            <BrandText style={fontSemibold13}>Thank you Teritorians,</BrandText>
            <BrandText style={fontSemibold13}>
              for contributing to make the Cosmos Safe.
            </BrandText>
          </View>
        </FlexRow>

        <SpacerColumn size={2.5} />

        <PrimaryButton
          size="SM"
          text="OKEY, bye."
          onPress={checkDetails}
          width={120}
          boxStyle={{ alignSelf: "center" }}
        />
      </View>
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

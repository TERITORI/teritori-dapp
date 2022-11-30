import moment from "moment";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { VictoryPie } from "victory";

import { BrandText } from "../../../components/BrandText/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { neutral77 } from "../../../utils/style/colors";
import { ProposalStatus } from "../types";
import { DepositProposalModal } from "./DepositProposalModal";
import { VoteProposalModal } from "./VoteProposalModal";

export const GovernanceDetails: React.FC<{
  visible?: boolean;
  onClose: () => void;
  numberProposal: string;
  titleProposal: string;
  descriptionProposal: string;
  totalParticipant: number;
  percentageTotalParticipant: string;
  votingEndTime: string;
  votingStartTime: string;
  submitTime: string;
  depositEndTime: string;
  percentageYes: string;
  percentageNo: string;
  percentageNoWithVeto: string;
  status: ProposalStatus;
}> = ({
  visible,
  onClose,
  numberProposal,
  titleProposal,
  descriptionProposal,
  totalParticipant,
  percentageTotalParticipant,
  votingStartTime,
  votingEndTime,
  submitTime,
  depositEndTime,
  percentageYes,
  percentageNo,
  percentageNoWithVeto,
  status,
}) => {
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [displayPopup] = useState(visible);

  const closeAll = () => {
    onClose();
    setVoteModalVisible(false);
    setDepositModalVisible(false);
  };

  const valueChartYes = parseInt(percentageYes.replace("%", ""), 10);
  const valueChartNo = parseInt(percentageNo.replace("%", ""), 10);
  const valueChartAbstain = 100 - valueChartYes - valueChartNo;
  const canVote = () =>
    status === "PROPOSAL_STATUS_VOTING" &&
    moment(votingEndTime).isAfter(moment());
  const canDeposit = () =>
    status === "PROPOSAL_STATUS_DEPOSIT_PERIOD" &&
    moment(depositEndTime).isAfter(moment());

  return (
    <ModalBase
      onClose={closeAll}
      label="Governance Details"
      visible={displayPopup}
      width={1300}
    >
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <View style={{ marginRight: 10 }}>
          <BrandText
            style={{
              fontSize: 28,
              color: neutral77,
            }}
          >
            {numberProposal}
          </BrandText>
        </View>
        <View style={{ marginRight: 20 }}>
          <BrandText
            style={{
              fontSize: 28,
            }}
          >
            {titleProposal}
          </BrandText>
        </View>
        {status === "PROPOSAL_STATUS_VOTING" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#171717",
              borderRadius: 100,
              height: 27,
              width: 125,
            }}
          >
            <BrandText
              style={{
                fontSize: 13,
                color: "#16BBFF",
              }}
            >
              VOTING PERIOD
            </BrandText>
          </View>
        )}
        {status === "PROPOSAL_STATUS_REJECTED" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#171717",
              borderRadius: 100,
              height: 27,
              width: 95,
            }}
          >
            <BrandText
              style={{
                fontSize: 13,
                color: "#FFAEAE",
              }}
            >
              REJECTED
            </BrandText>
          </View>
        )}

        {status === "PROPOSAL_STATUS_PASSED" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#171717",
              borderRadius: 100,
              height: 27,
              width: 90,
            }}
          >
            <BrandText
              style={{
                fontSize: 13,
                color: "#C8FFAE",
              }}
            >
              PASSED
            </BrandText>
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          display: "flex",
          width: "70%",
          paddingTop: 20,
          right: "0.5%",
          justifyContent: "space-evenly",
          alignContent: "center",
          flexWrap: "wrap",
        }}
      >
        <View>
          <BrandText
            style={{
              fontSize: 12,
              color: neutral77,
            }}
          >
            Submit Time
          </BrandText>
          <BrandText
            style={{
              fontSize: 13,
            }}
          >
            {submitTime.slice(0, 10)}
            {"\u00A0"}
            {submitTime.slice(11, 16)}
            {"\u00A0"} UTC
          </BrandText>
        </View>
        <View
          style={{
            width: 35,
            height: 0,
            borderWidth: 0.5,
            borderColor: neutral77,
            transform: [{ rotate: "90deg" }],
            marginTop: 15,
          }}
        />

        <View>
          <BrandText
            style={{
              fontSize: 12,
              color: neutral77,
            }}
          >
            Deposit End Time
          </BrandText>
          <BrandText
            style={{
              fontSize: 13,
            }}
          >
            {depositEndTime.slice(0, 10)}
            {"\u00A0"}
            {depositEndTime.slice(11, 16)}
            {"\u00A0"} UTC
          </BrandText>
        </View>
        <View
          style={{
            width: 35,
            height: 0,
            borderWidth: 0.5,
            borderColor: neutral77,
            transform: [{ rotate: "90deg" }],
            marginTop: 15,
          }}
        />

        <View>
          <BrandText
            style={{
              fontSize: 12,
              color: neutral77,
            }}
          >
            Voting Start
          </BrandText>
          <BrandText
            style={{
              fontSize: 13,
            }}
          >
            {votingStartTime.slice(0, 10)}
            {"\u00A0"}
            {votingStartTime.slice(11, 16)}
            {"\u00A0"} UTC
          </BrandText>
        </View>
        <View
          style={{
            width: 35,
            height: 0,
            borderWidth: 0.5,
            borderColor: neutral77,
            transform: [{ rotate: "90deg" }],
            marginTop: 15,
          }}
        />

        <View>
          <BrandText
            style={{
              fontSize: 12,
              color: neutral77,
            }}
          >
            Voting End
          </BrandText>
          <BrandText
            style={{
              fontSize: 13,
            }}
          >
            {votingEndTime.slice(0, 10)}
            {"\u00A0"}
            {votingEndTime.slice(11, 16)}
            {"\u00A0"} UTC
          </BrandText>
        </View>
      </View>

      <TertiaryBox
        width={1240}
        height={196}
        style={{ right: "-0.5%", marginTop: 25 }}
      >
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            width: "23%",
            paddingTop: 0,
            right: "22%",
            bottom: 35,
            justifyContent: "space-evenly",
            alignContent: "center",
            flexWrap: "wrap",
          }}
        >
          <View>
            <BrandText
              style={{
                fontSize: 20,
                color: neutral77,
              }}
            >
              Total
            </BrandText>
          </View>
          <View>
            <BrandText
              style={{
                fontSize: 20,
              }}
            >
              {totalParticipant}
            </BrandText>
          </View>
        </View>

        <View
          style={{
            width: 210,
            position: "absolute",
            left: 5,
          }}
        >
          <VictoryPie
            innerRadius={70}
            colorScale={["#16BBFF", "#EAA54B", neutral77]}
            data={[
              { x: "Pourcentage Yes", y: valueChartYes },
              { x: "Pourcentage No", y: valueChartNo },
              { x: "Pourcentage Abstain", y: valueChartAbstain },
            ]}
            labels={() => null}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor: "#171717",
            borderRadius: 100,
            height: 27,
            width: 125,
            bottom: 25,
            right: "28%",
          }}
        >
          <BrandText
            style={{
              fontSize: 13,
              color: "#777777",
            }}
          >
            Turnout:
          </BrandText>
          <BrandText
            style={{
              fontSize: 13,
            }}
          >
            {percentageTotalParticipant}
          </BrandText>
        </View>

        <View
          style={{
            flexDirection: "row",
            display: "flex",
            width: "60%",
            top: 20,
            right: "4%",
            justifyContent: "space-evenly",
            alignContent: "center",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#16BBFF",
              borderRadius: 12,
            }}
          />
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            Yes {percentageYes}
          </BrandText>

          <View
            style={{
              width: 40,
              height: 0,
              borderWidth: 0.5,
              borderColor: neutral77,
              transform: [{ rotate: "90deg" }],
              top: 10,
            }}
          />

          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#EAA54B",
              borderRadius: 12,
            }}
          />
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            Yes {percentageNo}
          </BrandText>

          <View
            style={{
              width: 40,
              height: 0,
              borderWidth: 0.5,
              borderColor: neutral77,
              transform: [{ rotate: "90deg" }],
              top: 10,
            }}
          />

          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#F46F76",
              borderRadius: 12,
            }}
          />
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            NoWithVeto {percentageNoWithVeto}
          </BrandText>

          <View
            style={{
              width: 40,
              height: 0,
              borderWidth: 0.5,
              borderColor: neutral77,
              transform: [{ rotate: "90deg" }],
              top: 10,
            }}
          />

          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#333333",
              borderRadius: 12,
            }}
          />
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            NoWithVeto {percentageNoWithVeto}
          </BrandText>
        </View>

        {canDeposit() && (
          <PrimaryButton
            width={150}
            size="XL"
            style={{ position: "absolute", left: 510, bottom: -40 }}
            text="Deposit"
            onPress={() => setDepositModalVisible(true)}
          />
        )}
        {canVote() && (
          <PrimaryButton
            width={150}
            size="XL"
            style={{ position: "absolute", left: 510, bottom: -40 }}
            text="Vote"
            onPress={() => setVoteModalVisible(true)}
          />
        )}
      </TertiaryBox>

      <VoteProposalModal
        isVisible={voteModalVisible}
        onClose={() => setVoteModalVisible(false)}
        numberProposal={numberProposal}
        onPressCancel={closeAll}
        onPressConfirm={closeAll}
      />

      <DepositProposalModal
        isVisible={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
        numberProposal={numberProposal}
      />

      <ScrollView style={{ height: 260, marginBottom: 50 }}>
        <View style={{ width: 1200, marginTop: 50 }}>
          <BrandText
            style={{
              fontSize: 16,
              color: "#777777",
            }}
          >
            {descriptionProposal}
          </BrandText>
        </View>
      </ScrollView>
    </ModalBase>
  );
};

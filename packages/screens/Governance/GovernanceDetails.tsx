import { MsgVoteEncodeObject, isDeliverTxFailure } from "@cosmjs/stargate";
import Long from "long";
import moment from "moment";
import React, { useState, useCallback } from "react";
import { ScrollView, ViewStyle, StyleProp, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { VictoryPie } from "victory";

import { ProposalStatus } from "./types";
import { BrandText } from "../../components/BrandText";
import { ConfirmationVote } from "../../components/GovernanceBox/ConfirmationVote";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getKeplrSigningStargateClient } from "../../networks";
import { neutral44, tulipTree } from "../../utils/style/colors";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

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
  votingSubmitTime: string;
  votingDepositEndTime: string;
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
  votingSubmitTime,
  votingDepositEndTime,
  percentageYes,
  percentageNo,
  percentageNoWithVeto,
  status,
}) => {
  const [displayVote, setdisplayVote] = useState(false);
  const [displayConfirmationVote, setdisplayConfirmationVote] = useState(false);
  const [checked, setChecked] = useState("nothingChecked");
  const [displayPopup] = useState(visible);
  const { setToastError } = useFeedbacks();

  function activeVotePopup() {
    onClose();
    setdisplayVote(!displayVote);
  }

  const valueChartYes = parseInt(percentageYes.replace("%", ""), 10);
  const valueChartNo = parseInt(percentageNo.replace("%", ""), 10);
  const valueChartAbstain = 100 - valueChartYes - valueChartNo;

  const selectedWallet = useSelectedWallet();
  let voteOption = 0;

  if (checked === "Yes") {
    voteOption = 1;
  }

  if (checked === "No") {
    voteOption = 3;
  }

  if (checked === "NoWithVeto") {
    voteOption = 4;
  }

  if (checked === "Abstain") {
    voteOption = 2;
  }

  const handlePress = useCallback(async () => {
    if (!selectedWallet?.connected || !selectedWallet.address) {
      setToastError({
        title: "Wallet Error",
        message: "You need to register your teritori wallet",
      });
      return;
    }

    try {
      const client = await getKeplrSigningStargateClient(
        selectedWallet.networkId,
      );

      const vote: MsgVoteEncodeObject = {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: {
          proposalId: Long.fromNumber(
            parseInt(numberProposal.substring(1), 10),
          ),
          voter: String(selectedWallet.address),
          option: voteOption,
        },
      };
      const result = await client.signAndBroadcast(
        selectedWallet.address,
        [vote],
        "auto",
      );
      if (isDeliverTxFailure(result)) {
        setToastError({
          title: "Vote failed",
          message: "Transaction failed",
        });
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Vote failed",
          message: err.message,
        });
      }
    }
  }, [
    numberProposal,
    selectedWallet?.address,
    selectedWallet?.connected,
    selectedWallet?.networkId,
    setToastError,
    voteOption,
  ]);

  function deleteConfirmationVote() {
    setdisplayConfirmationVote(false);
    setdisplayVote(!displayVote);
  }

  function activeConfirmationVotePopup() {
    if (displayConfirmationVote && checked !== "nothingChecked") {
      return (
        <ConfirmationVote
          numberProposal={numberProposal}
          vote={checked}
          visible={displayConfirmationVote}
          onClose={() => deleteConfirmationVote()}
        />
      );
    } else {
      return <></>;
    }
  }

  function activeVote() {
    setdisplayVote(!displayVote);
  }

  const canVoteDeposit = () => moment(votingDepositEndTime).isAfter(moment());

  return (
    <ModalBase
      onClose={() => {
        activeVotePopup();
      }}
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
              color: "#808080",
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
              color: "#808080",
            }}
          >
            Submit Time
          </BrandText>
          <BrandText
            style={{
              fontSize: 13,
            }}
          >
            {votingSubmitTime.slice(0, 10)}
            {"\u00A0"}
            {votingSubmitTime.slice(11, 16)}
            {"\u00A0"} UTC
          </BrandText>
        </View>
        <View
          style={{
            width: 35,
            height: 0,
            borderWidth: 0.5,
            borderColor: "#808080",
            transform: [{ rotate: "90deg" }],
            marginTop: 15,
          }}
        />

        <View>
          <BrandText
            style={{
              fontSize: 12,
              color: "#808080",
            }}
          >
            Deposit End Time
          </BrandText>
          <BrandText
            style={{
              fontSize: 13,
            }}
          >
            {votingDepositEndTime.slice(0, 10)}
            {"\u00A0"}
            {votingDepositEndTime.slice(11, 16)}
            {"\u00A0"} UTC
          </BrandText>
        </View>
        <View
          style={{
            width: 35,
            height: 0,
            borderWidth: 0.5,
            borderColor: "#808080",
            transform: [{ rotate: "90deg" }],
            marginTop: 15,
          }}
        />

        <View>
          <BrandText
            style={{
              fontSize: 12,
              color: "#808080",
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
            borderColor: "#808080",
            transform: [{ rotate: "90deg" }],
            marginTop: 15,
          }}
        />

        <View>
          <BrandText
            style={{
              fontSize: 12,
              color: "#808080",
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
        style={{
          width: 1240,
          height: 196,
          right: "-0.5%",
          marginTop: 25,
        }}
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
                color: "#808080",
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
            colorScale={["#16BBFF", tulipTree, "#808080"]}
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
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],
              top: 10,
            }}
          />

          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: tulipTree,
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
              borderColor: "#808080",
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
              borderColor: "#808080",
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

        {canVoteDeposit() && (
          <PrimaryButton
            width={150}
            size="XL"
            boxStyle={{ position: "absolute", left: 510, bottom: -40 }}
            text="Vote"
            onPress={() => activeVote()}
          />
        )}
      </TertiaryBox>

      {activeConfirmationVotePopup()}

      <ModalBase
        onClose={() => setdisplayVote(false)}
        label="Your vote"
        visible={displayVote}
        width={372}
        childrenBottom={
          <>
            <Separator />

            <View
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: 70,
                width: 480,
                right: 50,
              }}
            >
              <View>
                <SecondaryButton
                  size="M"
                  text="Cancel"
                  onPress={activeVotePopup}
                />
              </View>
              <View>
                <PrimaryButton
                  size="M"
                  text="Confirm"
                  onPress={() => {
                    if (checked !== "nothingChecked") {
                      handlePress();
                      activeVotePopup();
                      setdisplayConfirmationVote(true);
                    }
                  }}
                />
              </View>
            </View>
          </>
        }
      >
        <BrandText
          style={{
            fontSize: 14,
            color: "#777777",
          }}
        >
          {numberProposal}
        </BrandText>
        <BrandText
          style={{
            fontSize: 16,
            color: "#FFFFFF",
          }}
        >
          IncreaseMaxValidators=100 to MaxValidators=110 {"\n"}
          {"\n"}
        </BrandText>

        <View style={{ paddingBottom: 10, flexDirection: "row" }}>
          <View>
            <RadioButton
              value="Yes"
              color="#16BBFF"
              uncheckedColor="#777777"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />

            <RadioButton
              value="No"
              color={tulipTree}
              uncheckedColor="#777777"
              status={checked === "No" ? "checked" : "unchecked"}
              onPress={() => setChecked("No")}
            />
            <RadioButton
              value="NoWithVeto"
              color="#F46F76"
              uncheckedColor="#777777"
              status={checked === "NoWithVeto" ? "checked" : "unchecked"}
              onPress={() => setChecked("NoWithVeto")}
            />
            <RadioButton
              value="Abstain"
              color="#333333"
              uncheckedColor="#777777"
              status={checked === "Abstain" ? "checked" : "unchecked"}
              onPress={() => setChecked("Abstain")}
            />
          </View>
          <View
            style={{
              bottom: 8,
              height: 160,
              justifyContent: "space-evenly",
              alignItems: "flex-start",
            }}
          >
            <BrandText
              style={{
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Yes
            </BrandText>
            <BrandText
              style={{
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              No
            </BrandText>
            <BrandText
              style={{
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              NoWithVeto
            </BrandText>
            <BrandText
              style={{
                fontSize: 16,
                color: "#FFFFFF",
                marginRight: 209,
              }}
            >
              Abstain
            </BrandText>
          </View>

          <View
            style={{
              bottom: 8,
              height: 165,
              justifyContent: "space-evenly",
              alignItems: "flex-start",
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
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: tulipTree,
                borderRadius: 12,
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
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#333333",
                borderRadius: 12,
              }}
            />
          </View>
        </View>
      </ModalBase>

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

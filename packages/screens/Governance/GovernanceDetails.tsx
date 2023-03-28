import { MsgVoteEncodeObject, isDeliverTxFailure } from "@cosmjs/stargate";
import Long from "long";
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  ViewStyle,
  StyleProp,
  View,
  useWindowDimensions,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { VictoryPie } from "victory";

import { BrandText } from "../../components/BrandText/BrandText";
import { ConfirmationVote } from "../../components/GovernanceBox/ConfirmationVote";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getKeplrSigningStargateClient } from "../../networks";
import { neutral44 } from "../../utils/style/colors";
import { modalWidthRatio, smallMobileWidth } from "../../utils/style/layout";
import { getTeritoriSigningStargateClient } from "../../utils/teritori";
import { ProposalStatus } from "./types";

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
        selectedWallet.networkId
      );

      const vote: MsgVoteEncodeObject = {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: {
          proposalId: Long.fromNumber(
            parseInt(numberProposal.substring(1), 10)
          ),
          voter: String(selectedWallet.address),
          option: voteOption,
        },
      };
      const result = await client.signAndBroadcast(
        selectedWallet.address,
        [vote],
        "auto"
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
    if (displayConfirmationVote === true && checked !== "nothingChecked") {
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

  // const canVoteDeposit = () => moment(votingDepositEndTime).isAfter(moment());
  const { width } = useWindowDimensions();

  return (
    <ModalBase
      onClose={() => {
        activeVotePopup();
      }}
      label="Governance Details"
      visible={displayPopup}
      width={width < 1400 ? modalWidthRatio * width : 1300}
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

      <ScrollView horizontal>
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            width: "100%",
            paddingTop: 20,
            alignItems: "center",
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
      </ScrollView>

      <View
        style={{
          position: "relative",
          width: width < 1400 ? modalWidthRatio * width - 40 : 1240,
          marginTop: 20,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: width < 1000 ? "column" : "row",
            zIndex: 999,
          }}
        >
          <View
            style={{
              width: 210,
              margin: "auto",
            }}
          >
            <VictoryPie
              innerRadius={70}
              colorScale={["#16BBFF", "#EAA54B", "#808080"]}
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
              paddingVertical: 15,
              width:
                width < 1400
                  ? width < 1000
                    ? "90%"
                    : modalWidthRatio * width - 60 - 210
                  : 1240 - 210,
              margin: "auto",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                alignContent: "center",
              }}
            >
              <BrandText
                style={{
                  fontSize: 20,
                  color: "#808080",
                  marginRight: 30,
                }}
              >
                Total
              </BrandText>
              <BrandText
                style={{
                  fontSize: 20,
                }}
              >
                {totalParticipant}
              </BrandText>
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
                marginTop: 10,
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

            <ScrollView horizontal>
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  marginTop: 20,
                  alignItems: "center",
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
                    marginLeft: 20,
                  }}
                >
                  Yes {percentageYes}
                </BrandText>

                <View
                  style={{
                    width: 1,
                    height: "100%",
                    backgroundColor: "#808080",
                    marginHorizontal: 20,
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
                    marginLeft: 20,
                  }}
                >
                  Yes {percentageNo}
                </BrandText>

                <View
                  style={{
                    width: 1,
                    height: "100%",
                    backgroundColor: "#808080",
                    marginHorizontal: 20,
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
                    marginLeft: 20,
                  }}
                >
                  NoWithVeto {percentageNoWithVeto}
                </BrandText>

                <View
                  style={{
                    width: 1,
                    height: "100%",
                    backgroundColor: "#808080",
                    marginHorizontal: 20,
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
                    marginLeft: 20,
                  }}
                >
                  NoWithVeto {percentageNoWithVeto}
                </BrandText>
              </View>
            </ScrollView>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: width < 1000 ? "center" : "flex-end",
                width: "100%",
                paddingRight: width < 1000 ? 0 : 30,
                marginTop: 20,
              }}
            >
              {/* {canVoteDeposit() && ( */}
              {1 && (
                <PrimaryButton
                  width={150}
                  size="XS"
                  text="Vote"
                  onPress={() => activeVote()}
                />
              )}
            </View>
          </View>
        </View>

        <TertiaryBox
          // width={1240}
          width={width < 1400 ? modalWidthRatio * width - 40 : 1260}
          height={width < 1000 ? 440 : 216}
        />
      </View>

      {activeConfirmationVotePopup()}

      <ModalBase
        onClose={() => setdisplayVote(false)}
        label="Your vote"
        visible={displayVote}
        width={width < smallMobileWidth ? modalWidthRatio * width : 480}
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
                width: "100%",
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
              color="#EAA54B"
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
                backgroundColor: "#EAA54B",
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

      <ScrollView style={{ marginBottom: width < smallMobileWidth ? 20 : 50 }}>
        <View
          style={{
            width: "100%",
            marginTop: width < smallMobileWidth ? 20 : 50,
          }}
        >
          <BrandText
            style={{
              fontSize: width < smallMobileWidth ? 12 : 16,
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

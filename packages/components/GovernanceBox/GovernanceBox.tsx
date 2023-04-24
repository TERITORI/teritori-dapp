import { LinearGradient } from "expo-linear-gradient";
import React, { Suspense, useState } from "react";
import {
  ColorValue,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

import { BrandText } from "../../components/BrandText/BrandText";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { ProposalStatus } from "../../screens/Governance/types";
import { tulipTree } from "../../utils/style/colors";

// FIXME: code dedup

export const GovernanceBox: React.FC<{
  numberProposal: string;
  titleProposal: string;
  descriptionProposal: string;
  votingEndTime: string;
  votingStartTime: string;
  colorMostVoted: ColorValue | undefined;
  percentageYesValue: number;
  percentageNoValue: number;
  percentageNoWithVetoValue: number;
  percentageAbstainValue: number;
  votingSubmitTime: string;
  votingDepositEndTime: string;
  status: ProposalStatus;
}> = ({
  numberProposal,
  titleProposal,
  descriptionProposal,
  votingEndTime,
  colorMostVoted,
  percentageYesValue,
  percentageNoValue,
  percentageNoWithVetoValue,
  percentageAbstainValue,
  votingStartTime,
  votingSubmitTime,
  votingDepositEndTime,
  status,
}) => {
  const totalUsers =
    percentageYesValue +
    percentageNoValue +
    percentageNoWithVetoValue +
    percentageAbstainValue;
  const totalParticipant = totalUsers - percentageAbstainValue;
  const percentageTotalParticipant =
    ((totalParticipant / totalUsers) * 100).toFixed(2).toString() + "%";
  const [displayGovernanceDetails, setDisplayGovernanceDetails] =
    useState(false);

  const test = "%";
  let percentageYes = ((percentageYesValue / totalUsers) * 100)
    .toFixed(2)
    .toString();
  percentageYes = percentageYes.substring(0, 5) + test;
  let percentageNo = ((percentageNoValue / totalUsers) * 100)
    .toFixed(2)
    .toString();
  percentageNo = percentageNo.substring(0, 5) + test;

  const percentageNoWithVeto = ((percentageNoWithVetoValue / totalUsers) * 100)
    .toFixed(2)
    .toString();

  let topPercentage;
  if (percentageYesValue > percentageNoValue) {
    topPercentage = percentageYes;
    colorMostVoted = "#16BBFF";
  } else {
    topPercentage = percentageNo;
    colorMostVoted = tulipTree;
  }

  const numberProposalHashtag = "#" + numberProposal;

  function activePopup() {
    setDisplayGovernanceDetails(!displayGovernanceDetails);
  }

  function activeGovernanceDetailsPopup() {
    if (displayGovernanceDetails) {
      const GovernanceDetails = React.lazy(() =>
        import("../../screens/Governance/GovernanceDetails").then((module) => ({
          default: module.GovernanceDetails,
        }))
      );

      return (
        <Suspense fallback={<></>}>
          <GovernanceDetails
            visible={displayGovernanceDetails}
            onClose={() => activePopup()}
            numberProposal={numberProposalHashtag}
            titleProposal={titleProposal}
            descriptionProposal={descriptionProposal}
            totalParticipant={totalParticipant}
            percentageTotalParticipant={percentageTotalParticipant}
            votingEndTime={votingEndTime}
            votingStartTime={votingStartTime}
            votingSubmitTime={votingSubmitTime}
            votingDepositEndTime={votingDepositEndTime}
            percentageYes={percentageYes}
            percentageNo={percentageNo}
            percentageNoWithVeto={percentageNoWithVeto}
            status={status}
          />
        </Suspense>
      );
    } else {
      return <></>;
    }
  }

  return (
    <View style={{ width: "50%", marginBottom: 20 }}>
      <TouchableOpacity
        onPress={() => {
          activePopup();
        }}
      >
        {activeGovernanceDetailsPopup()}

        <TertiaryBox width={600} height={300}>
          <View
            style={{
              flexDirection: "column",
              top: 20,
              width: "96%",
              height: "100%",
            }}
          >
            {status === "PROPOSAL_STATUS_VOTING" && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#171717",
                  borderRadius: 100,
                  height: Platform.OS === "web" ? "fit-content" : "100%",
                  width: Platform.OS === "web" ? "fit-content" : "100%",
                }}
              >
                <BrandText
                  style={{
                    padding: 5,
                    paddingRight: 15,
                    paddingLeft: 15,
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
                  height: Platform.OS === "web" ? "fit-content" : "100%",
                  width: Platform.OS === "web" ? "fit-content" : "100%",
                }}
              >
                <BrandText
                  style={{
                    padding: 5,
                    paddingRight: 15,
                    paddingLeft: 15,
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
                  height: Platform.OS === "web" ? "fit-content" : "100%",
                  width: Platform.OS === "web" ? "fit-content" : "100%",
                }}
              >
                <BrandText
                  style={{
                    padding: 5,
                    paddingRight: 15,
                    paddingLeft: 15,
                    fontSize: 13,
                    color: "#C8FFAE",
                  }}
                >
                  PASSED
                </BrandText>
              </View>
            )}

            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingTop: 15,
                  height: 54,
                  paddingBottom: 15,
                  alignItems: "center",
                }}
              >
                <BrandText
                  style={{
                    fontSize: 18,
                    color: "#808080",
                  }}
                >
                  {numberProposalHashtag}
                </BrandText>

                <BrandText
                  style={{
                    fontSize: 17,
                    paddingLeft: 10,
                  }}
                >
                  {titleProposal}
                </BrandText>
              </View>
            </View>
            <View
              style={{
                width: 550,
                height: 100,
              }}
            >
              <ScrollView>
                <BrandText
                  style={{
                    fontSize: 18,
                    color: "#808080",
                  }}
                >
                  {descriptionProposal}
                </BrandText>
              </ScrollView>
            </View>

            <View style={{ paddingTop: 10 }}>
              <View
                style={{
                  width: "94%",
                  height: 3,
                  alignItems: "center",
                  backgroundColor: "#333333",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: percentageYes,
                    height: 3,
                    borderRadius: 10,
                    position: "absolute",
                    left: 0,
                    zIndex: 2,
                  }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: "100%", width: "100%", borderRadius: 24 }}
                    colors={["#5433FF", "#20BDFF", "#A5FECB"]}
                  />
                </View>

                <View
                  style={{
                    width: percentageNo,
                    height: 3,
                    backgroundColor: tulipTree,
                    borderRadius: 10,
                    position: "absolute",
                    left: percentageYes, //percentage of the width of the first view
                    zIndex: 2,
                  }}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 20 }}>
              <View style={{ flexDirection: "column" }}>
                <BrandText
                  style={{
                    fontSize: 12,
                    color: "#808080",
                  }}
                >
                  Voting End Time
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

              <View
                style={{
                  width: 45,
                  height: 0,
                  borderWidth: 0.5,
                  borderColor: "#808080",
                  transform: [{ rotate: "90deg" }],
                  top: 13,
                }}
              />

              <View style={{ flexDirection: "column" }}>
                <BrandText
                  style={{
                    fontSize: 12,
                    color: "#808080",
                  }}
                >
                  Turnout
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
                  width: 45,
                  height: 0,
                  borderWidth: 0.5,
                  borderColor: "#808080",
                  transform: [{ rotate: "90deg" }],
                  top: 13,
                }}
              />

              <View style={{ flexDirection: "column" }}>
                <BrandText
                  style={{
                    fontSize: 12,
                    color: "#808080",
                  }}
                >
                  Most voted on
                </BrandText>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: colorMostVoted,
                      borderRadius: 4,
                    }}
                  />

                  <BrandText
                    style={{
                      fontSize: 13,
                      paddingLeft: 5,
                    }}
                  >
                    {topPercentage}
                  </BrandText>
                </View>
              </View>
            </View>
          </View>
        </TertiaryBox>
      </TouchableOpacity>
    </View>
  );
};

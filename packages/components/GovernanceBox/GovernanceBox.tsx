import React from "react";
import { View } from "react-native";

import { GovernanceExpire } from "./GovernanceExpire";
import expireSVG from "../../../assets/icons/expires.svg";
import PassedSVG from "../../../assets/icons/passed.svg";
import RejectSVG from "../../../assets/icons/reject.svg";
import VotingSVG from "../../../assets/icons/voting.svg";
import { OmniLink } from "../OmniLink";

import { BrandText } from "@/components/BrandText";
import { GovernanceProgressBar } from "@/components/GovernanceBox/GovernanceProgressBar";
import { GovernanceTitle } from "@/components/GovernanceBox/GovernanceTitle";
import {
  additionalSuccess,
  errorColor,
  neutral17,
  neutral22,
  neutralA3,
  primaryColor,
  secondaryColor,
  withAlpha,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Proposal } from "@/utils/types/gov";

export const GovernanceBox: React.FC<{
  proposal: Proposal;
  isMobile: boolean;
}> = ({ proposal, isMobile }) => {
  return (
    <OmniLink
      to={{
        screen: "GovernanceProposal",
        params: { id: proposal.proposal_id },
      }}
      style={{
        width: isMobile ? "auto" : "50%",
        marginBottom: layout.spacing_x2_5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginRight: layout.spacing_x2_5,
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
          borderRadius: layout.spacing_x1_5,
        }}
      >
        <View
          style={{
            width: "82%",
            borderRightWidth: 2,
            borderColor: neutral22,
          }}
        >
          <View
            style={{
              paddingRight: layout.spacing_x2,
            }}
          >
            {proposal.status === "PROPOSAL_STATUS_DEPOSIT_PERIOD" && (
              <View style={{ flexDirection: "row" }}>
                <GovernanceTitle
                  title="Voting Period"
                  titleColor={primaryColor}
                  iconSVG={VotingSVG}
                />
                <GovernanceExpire
                  style={{ marginLeft: layout.spacing_x1 }}
                  votingEndTime={proposal.deposit_end_time}
                  iconSVG={expireSVG}
                />
              </View>
            )}

            {proposal.status === "PROPOSAL_STATUS_REJECTED" && (
              <GovernanceTitle
                title="Rejected"
                titleColor={errorColor}
                iconSVG={RejectSVG}
                hasBorder
                borderColor={withAlpha(errorColor, 0.1)}
              />
            )}

            {proposal.status === "PROPOSAL_STATUS_PASSED" && (
              <GovernanceTitle
                title="Passed"
                titleColor={additionalSuccess}
                iconSVG={PassedSVG}
                hasBorder
                borderColor={withAlpha(additionalSuccess, 0.1)}
              />
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                height: 54,
                paddingBottom: layout.spacing_x1,
                alignItems: "center",
              }}
            >
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    color: secondaryColor,
                  },
                ]}
              >
                {"#" + proposal.proposal_id + " " + proposal.content.title}
              </BrandText>
            </View>

            <GovernanceProgressBar result={proposal.final_tally_result} />
          </View>
        </View>

        <View
          style={{
            width: "18%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
            Reviews
          </BrandText>
          <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
            35
          </BrandText>
        </View>
      </View>
    </OmniLink>
  );
};

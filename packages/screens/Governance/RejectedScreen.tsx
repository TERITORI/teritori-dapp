import React, { useEffect, useState } from "react";
import { View } from "react-native";

import logoSVG from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText/BrandText";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";
import { SVG } from "../../components/SVG/svg";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NavBarGovernance } from "./NavBarGovernance";

export const GovernanceRejectedScreen: React.FC = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://rest.testnet.teritori.com/cosmos/gov/v1beta1/proposals?proposal_status=4"
      );
      const data = await res.json();

      setCards(data.proposals);
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <ScreenContainer>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          width: 1240,
          right: 75,
          justifyContent: "space-between",
          top: 55,
        }}
      >
        <BrandText style={{ fontSize: 28 }}>Decentralized Governance</BrandText>

        <View style={{ bottom: 10, right: 100 }}>
          <NavBarGovernance visible onClose={() => {}} />
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 110,
          marginLeft: -70,
          marginRight: -60,
        }}
      >
        {cards.map((proposals: any, item) => (
          <GovernanceBox
            key={item}
            numberProposal={proposals.proposal_id}
            titleProposal={proposals.content.title}
            descriptionProposal={proposals.content.description}
            votingEndTime={proposals.voting_end_time}
            votingStartTime={proposals.voting_start_time}
            votingSubmitTime={proposals.submit_time}
            votingDepositEndTime={proposals.deposit_end_time}
            colorMostVoted="#16BBFF"
            percentageNoValue={parseFloat(proposals.final_tally_result.no)}
            percentageYesValue={parseFloat(proposals.final_tally_result.yes)}
            percentageNoWithVetoValue={parseFloat(
              proposals.final_tally_result.no_with_veto
            )}
            percentageAbstainValue={parseFloat(
              proposals.final_tally_result.abstain
            )}
          />
        ))}
      </View>
      <SVG
        width={200}
        height={200}
        style={{ marginTop: 190, marginLeft: "40%" }}
        source={logoSVG}
      />
    </ScreenContainer>
  );
};

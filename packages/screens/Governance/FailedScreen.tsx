import React, { useEffect, useState} from "react";

import { ScreenContainer } from "../../components/ScreenContainer"
import { View } from "react-native";

import { BrandText } from "../../components/BrandText/BrandText";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";

import logoSVG from "../../../assets/logos/logo.svg";
import { SVG } from "../../components/SVG/svg";

import { useAppNavigation } from "../../utils/navigation";

export const FailedScreen: React.FC = () => {
  const [cards, setCards] = useState([])
  const navigation = useAppNavigation();

  function handleFailedClick() {
    navigation.navigate("Failed");
  }

  useEffect(() => {
    fetch('https://rest.testnet.teritori.com/cosmos/gov/v1beta1/proposals?proposal_status=5')
      .then(res => res.json())
      .then(kl => setCards(kl.proposals))
  }, [])

  return (
    <ScreenContainer>
      <BrandText style={{
          fontSize: 28,
          position: "absolute",
          left: -70,
          right: 0,
          top: 55,
      }}
      >
        Decentralized Governance
      </BrandText>

      <View style={{
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        height: 10,
        position: "absolute",
        left: 900,
        top: 65,
      }}>
        <a onClick={() => navigation.navigate("AllPeriods")} style={{cursor: "pointer", margin: 10}}>
          <BrandText style={{
              fontSize: 14,
              color: "grey",
          }}
          >
            All period
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: "grey",
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={() => navigation.navigate("Pending")} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: "grey",
          }}
          >
            Pending
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: "grey",
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={() => {navigation.navigate("Voting")}} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: "grey",
          }}
          >
            Voting
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: "grey",
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={() => navigation.navigate("Passed")} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: "grey",
          }}
          >
            Passed
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: "grey",
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={() => navigation.navigate("Rejected")} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: "grey",
          }}
          >
            Rejected
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: "grey",
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={() => navigation.navigate("Failed")} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: "white",
          }}
          >
            Failed
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: "white",
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>
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
        {
          // console.log(cards)
          cards.map((proposals: any, item) => (
            <GovernanceBox
              key={item}
              numberProposal={proposals.proposal_id}
              titleProposal={proposals.content.title}
              descriptionProposal={proposals.content.description}
              votingEndTime={proposals.voting_end_time}
              votingStartTime={proposals.voting_start_time}
              votingSubmitTime={proposals.submit_time}
              votingDepositEndTime={proposals.deposit_end_time}
              turnoutValue="80.69%"
              mostVotedValue={parseFloat(proposals.final_tally_result.yes)}
              colorMostVoted="#16BBFF"
              pourcentageNoValue={parseFloat(proposals.final_tally_result.no)}
              pourcentageYesValue={parseFloat(proposals.final_tally_result.yes)}
              pourcentageNoWithVetoValue={parseFloat(proposals.final_tally_result.no_with_veto)}
              pourcentageAbstainValue={parseFloat(proposals.final_tally_result.abstain)}
            />
        ))}

      </View>
      <SVG width={200} height={200} style={{marginTop: 190, marginLeft:"40%"}} source={logoSVG} />
    </ScreenContainer>
  );
};

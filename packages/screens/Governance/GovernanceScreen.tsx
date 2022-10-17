import React, { useEffect, useState} from "react";

import { LinearGradient } from "expo-linear-gradient";

import logoSVG from "../../../assets/logos/logo.svg";
import { ScreenContainer } from "../../components/ScreenContainer"
import { View } from "react-native";

import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { BrandText } from "../../components/BrandText/BrandText";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";
import { GovernanceNavBar } from "../../components/GovernanceBox/GovernanceNavBar";

import { SVG } from "../../components/SVG/svg";

// import data from './test.json'

import { Decimal } from "@cosmjs/math";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  MsgVoteEncodeObject,
  QueryClient,
  setupGovExtension,
  SigningStargateClient,
  GasPrice,
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import {
  ProposalStatus,
  VoteOption,
} from "cosmjs-types/cosmos/gov/v1beta1/gov";

export const GovernanceScreen: React.FC = () => {
  const [colorAllperiod, setcolorAllperiod] = useState("white");
  const [colorPending, setcolorPending] = useState("grey");
  const [colorVoting, setcolorVoting] = useState("grey");
  const [colorPassed, setcolorPassed] = useState("grey");
  const [colorRejected, setcolorRejected] = useState("grey");
  const [colorFailed, setcolorFailed] = useState("grey");
  // const [data, setData] = useState({});

  function handleAllPeriodClick() {
    setcolorAllperiod("white");
    setcolorPending("grey");
    setcolorPassed("grey");
    setcolorRejected("grey");
    setcolorFailed("grey");
    setcolorVoting("grey");
  }

  function handleVotingClick() {
    setcolorVoting("white");
    setcolorAllperiod("grey");
    setcolorPending("grey");
    setcolorPassed("grey");
    setcolorRejected("grey");
    setcolorFailed("grey");
  }

  function handlePendingClick() {
    setcolorPending("white");
    setcolorAllperiod("grey");
    setcolorPassed("grey");
    setcolorRejected("grey");
    setcolorFailed("grey");
    setcolorVoting("grey");
  }

  function rejectedAPIcall() {
    useEffect(() => {
        console.log("Color Rejected Function")
        const rejectedAPI = async () =>{
          if (colorRejected == "white") {
          // setcolorRejected("white");
          // if (colorRejected == "white") {
            const tmClient = await Tendermint34Client.connect(
              "https://rpc.testnet.teritori.com"
            );
            const client = QueryClient.withExtensions(tmClient, setupGovExtension);
            const proposals = await client.gov.proposals(
              ProposalStatus.PROPOSAL_STATUS_REJECTED,
              "",
              ""
            );
            console.log("IT GOES IN REJECTED PROPOSALS")
            console.log(proposals);
            // setData(proposals);
          }
        }
        rejectedAPI();
        // else {
        //   return data
        // }
      }, []);
  }

  // function passedAPIcall() {
  //   // const [data, setData] = useState({});

  //   useEffect(() => {
  //     if (colorPassed === "white") {
  //     // const controller = new AbortController();
  //     // const signal = controller.signal;

  //     async function passedAPI() {
  //       // if (colorRejected == "white") {
  //         const tmClient = await Tendermint34Client.connect(
  //           "https://rpc.testnet.teritori.com"
  //         );
  //         const client = QueryClient.withExtensions(tmClient, setupGovExtension);
  //         const proposals = await client.gov.proposals(
  //           ProposalStatus.PROPOSAL_STATUS_PASSED,
  //           "",
  //           ""
  //         );
  //         console.log(proposals);
  //         // setData(proposals);
  //     }
  //       passedAPI();
  //     }
  //     // else {
  //     //   return data
  //     // }
  //   }, []);
  // }

  function handlePassedClick() {
    setcolorPassed("white");
    setcolorAllperiod("grey");
    setcolorRejected("grey");
    setcolorFailed("grey");
    setcolorPending("grey");
    setcolorVoting("grey");
  }

  function handleRejectedClick() {
    setcolorRejected("white");
    setcolorAllperiod("grey");
    setcolorFailed("grey");
    setcolorPending("grey");
    setcolorPassed("grey");
    setcolorVoting("grey");

    console.log("Color Rejected white")


    // rejectedAPIcall();
  }

  // function displayAllperiod() {
  //   if (colorAllperiod == "white") {
  //     return (
  //       data.proposals.map(({proposal_id, content, voting_end_time, final_tally_result}, index) => {
  //         const zae = final_tally_result.yes;
  //         const zan = final_tally_result.no;
  //         const zav = zae + zan;
          
  //         return (
  //           <GovernanceBox
  //             key={index}
  //             numberProposal={proposal_id}
  //             titleProposal={content.title}
  //             descriptionProposal={content.description}
  //             votingEndTime={voting_end_time}
  //             turnoutValue="80.69%"
  //             mostVotedValue={final_tally_result.yes}
  //             colorMostVoted="#16BBFF"
  //             pourcentageNo={final_tally_result.no}
  //             pourcentageYes={final_tally_result.yes}
  //           />
  //         )
  //       })
  //     )

  //   }
  //   else {
  //     return null;
  //   }
  // }

  function handleFailedClick() {
    setcolorFailed("white");
    setcolorAllperiod("grey");
    setcolorPending("grey");
    setcolorPassed("grey");
    setcolorRejected("grey");
    setcolorVoting("grey");
  }

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

      {/* <GovernanceNavBar></GovernanceNavBar> */}
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
        <a onClick={handleAllPeriodClick} style={{cursor: "pointer", margin: 10}}>
          <BrandText style={{
              fontSize: 14,
              color: colorAllperiod,
          }}
          >
            All period
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorAllperiod,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handlePendingClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorPending,
          }}
          >
            Pending
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorPending,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handleVotingClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorVoting,
          }}
          >
            Voting
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorVoting,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handlePassedClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorPassed,
          }}
          >
            Passed
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorPassed,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handleRejectedClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorRejected,
          }}
          >
            Rejected
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorRejected,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>

        <a onClick={handleFailedClick} style={{cursor: "pointer", margin: 10,}}>
          <BrandText style={{
              fontSize: 14,
              color: colorFailed,
          }}
          >
            Failed
          </BrandText>

          <View style={{
              width: 8,
              height: 8,
              backgroundColor: colorFailed,
              borderRadius: 4,
              position: "relative",
                left: "50%",
                top: 10,
            }}/>
        </a>
        </View>
        
        {/* {data} */}

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
        {/* {passedAPIcall()} */}
        {rejectedAPIcall()}

        {
          // data.proposals.map(({proposal_id, content, voting_end_time, final_tally_result}) => {
          //   const zae = final_tally_result.yes;
          //   const zan = final_tally_result.no;
          //   const zav = zae + zan;
            
          //   return (
          //     <GovernanceBox
          //       numberProposal={proposal_id}
          //       titleProposal={content.title}
          //       descriptionProposal={content.description}
          //       votingEndTime={voting_end_time}
          //       turnoutValue="80.69%"
          //       mostVotedValue={final_tally_result.yes}
          //       colorMostVoted="#16BBFF"
          //       pourcentageNo={final_tally_result.no}
          //       pourcentageYes={final_tally_result.yes}
          //     />
          //   )
          // })

        }

        

        {/* <View style={{width: '50%', marginBottom: 20}}>
            <TertiaryBox width={600} height={300}>
            <BrandText style={{
              fontSize: 18,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 70,
              }}>
              #251
            </BrandText>

            <BrandText style={{
                fontSize: 18,
                position: "absolute",
                left: 70,
                right: 0,
                top: 70,
            }}
            >
              Title of the proposal
            </BrandText>

            <BrandText style={{
              fontSize: 18,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 110,
              }}>
              The airdrop original time to decay is to start after 4 months of the Marketplace being live.
This proposal updates the DurationUntilDecay  value to match the airdrop specification.
            </BrandText>

            <View style={{
                width: "94%",
                height: 3,
                alignItems: "center",
                backgroundColor: "#333333",
                borderRadius: 10,
                position: "absolute",
                  top: 210,
            }}>
              <View style={{
                width: "70%",
                height: 3,
                borderRadius: 10,
                position: "absolute",
                  left: 0,
                zIndex: 2,
              }}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: "100%", width: "100%", borderRadius: 24, }}
                  colors={["#5433FF", "#20BDFF", "#A5FECB"]}
                />
              </View>

              <View style={{
                width: "10%",
                height: 3,
                backgroundColor: "#EAA54B",
                borderRadius: 10,
                position: "absolute",
                  left: "70%", //Pourcentage of the width of the first view
                zIndex: 2,
              }}/>

            </View>
            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 230,
              }}>
              Voting End Time
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 20,
                right: 0,
                top: 250,
            }}
            >
              2022-06-06 21:00 UTC
            </BrandText>

            <View style={{
              width: 45,
              height: 0,
              borderWidth: 0.5,
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],
              position: "absolute",
                left: 160,
                top: 250,
              }}/>

            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 205,
                right: 20,
                top: 230,
              }}>
              Turnout
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 205,
                right: 0,
                top: 250,
            }}
            >
              40.24%
            </BrandText>


            <View style={{
              width: 45,
              height: 0,
              borderWidth: 0.5,
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],
              position: "absolute",
                left: 255,
                top: 250,
              }}/>

            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 300,
                right: 20,
                top: 230,
              }}>
              Most voted on
            </BrandText>

            <View style={{
              width: 8,
              height: 8,
              backgroundColor: "#16BBFF",
              borderRadius: 4,
              position: "absolute",
                left: 300,
                top: 255,
            }}/>
          
            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 315,
                right: 0,
                top: 250,
            }}
            >
              Yes
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 345,
                right: 0,
                top: 250,
            }}
            >
              99.77%
            </BrandText>

            </TertiaryBox>
        </View>

        <View style={{width: '50%', marginBottom: 20}}>
            <TertiaryBox width={600} height={300}>
            <BrandText style={{
              fontSize: 18,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 70,
              }}>
              #251
            </BrandText>

            <BrandText style={{
                fontSize: 18,
                position: "absolute",
                left: 70,
                right: 0,
                top: 70,
            }}
            >
              Title of the proposal
            </BrandText>

            <BrandText style={{
              fontSize: 18,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 110,
              }}>
              The airdrop original time to decay is to start after 4 months of the Marketplace being live.
This proposal updates the DurationUntilDecay  value to match the airdrop specification.
            </BrandText>

            <View style={{
                width: "94%",
                height: 3,
                alignItems: "center",
                backgroundColor: "#333333",
                borderRadius: 10,
                position: "absolute",
                  top: 210,
            }}>
              <View style={{
                width: "70%",
                height: 3,
                borderRadius: 10,
                position: "absolute",
                  left: 0,
                zIndex: 2,
              }}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: "100%", width: "100%", borderRadius: 24, }}
                  colors={["#5433FF", "#20BDFF", "#A5FECB"]}
                />
              </View>

              <View style={{
                width: "10%",
                height: 3,
                backgroundColor: "#EAA54B",
                borderRadius: 10,
                position: "absolute",
                  left: "70%", //Pourcentage of the width of the first view
                zIndex: 2,
              }}/>

            </View>
            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 230,
              }}>
              Voting End Time
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 20,
                right: 0,
                top: 250,
            }}
            >
              2022-06-06 21:00 UTC
            </BrandText>

            <View style={{
              width: 45,
              height: 0,
              borderWidth: 0.5,
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],
              position: "absolute",
                left: 160,
                top: 250,
              }}/>

            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 205,
                right: 20,
                top: 230,
              }}>
              Turnout
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 205,
                right: 0,
                top: 250,
            }}
            >
              40.24%
            </BrandText>

            <View style={{
              width: 45,
              height: 0,
              borderWidth: 0.5,
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],
              position: "absolute",
                left: 255,
                top: 250,
              }}/>

            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 300,
                right: 20,
                top: 230,
              }}>
              Most voted on
            </BrandText>

            <View style={{
              width: 8,
              height: 8,
              backgroundColor: "#16BBFF",
              borderRadius: 4,
              position: "absolute",
                left: 300,
                top: 255,
            }}/>
          
            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 315,
                right: 0,
                top: 250,
            }}
            >
              Yes
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 345,
                right: 0,
                top: 250,
            }}
            >
              99.77%
            </BrandText>

          </TertiaryBox>
        </View>

        <View style={{width: '50%', marginBottom: 20}}>
            <TertiaryBox width={600} height={300}>
            <BrandText style={{
              fontSize: 18,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 70,
              }}>
              #251
            </BrandText>

            <BrandText style={{
                fontSize: 18,
                position: "absolute",
                left: 70,
                right: 0,
                top: 70,
            }}
            >
              Title of the proposal
            </BrandText>

            <BrandText style={{
              fontSize: 18,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 110,
              }}>
              The airdrop original time to decay is to start after 4 months of the Marketplace being live.
This proposal updates the DurationUntilDecay  value to match the airdrop specification.
            </BrandText>

            <View style={{
                width: "94%",
                height: 3,
                alignItems: "center",
                backgroundColor: "#333333",
                borderRadius: 10,
                position: "absolute",
                  top: 210,
            }}>
              <View style={{
                width: "70%",
                height: 3,
                borderRadius: 10,
                position: "absolute",
                  left: 0,
                zIndex: 2,
              }}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: "100%", width: "100%", borderRadius: 24, }}
                  colors={["#5433FF", "#20BDFF", "#A5FECB"]}
                />
              </View>

              <View style={{
                width: "10%",
                height: 3,
                backgroundColor: "#EAA54B",
                borderRadius: 10,
                position: "absolute",
                  left: "70%", //Pourcentage of the width of the first view
                zIndex: 2,
              }}/>

            </View>
            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 20,
                right: 20,
                top: 230,
              }}>
              Voting End Time
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 20,
                right: 0,
                top: 250,
            }}
            >
              2022-06-06 21:00 UTC
            </BrandText>

            <View style={{
              width: 45,
              height: 0,
              borderWidth: 0.5,
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],

              position: "absolute",
                left: 160,
                top: 250,
              }}/>

            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 205,
                right: 20,
                top: 230,
              }}>
              Turnout
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 205,
                right: 0,
                top: 250,
            }}
            >
              40.24%
            </BrandText>

            <View style={{
              width: 45,
              height: 0,

              borderWidth: 0.5,
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],

              position: "absolute",
                left: 255,
                top: 250,
              }}/>

            <BrandText style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
                left: 300,
                right: 20,
                top: 230,
              }}>
              Most voted on
            </BrandText>

            <View style={{
              width: 8,
              height: 8,
              backgroundColor: "#16BBFF",
              borderRadius: 4,
              
              position: "absolute",
                left: 300,
                top: 255,
            }}/>
          
            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 315,
                right: 0,
                top: 250,
            }}
            >
              Yes
            </BrandText>

            <BrandText style={{
                fontSize: 13,
                position: "absolute",
                left: 345,
                right: 0,
                top: 250,
            }}
            >
              99.77%
            </BrandText>

            </TertiaryBox>
        </View> */}

      </View>
      <SVG width={200} height={200} style={{marginTop: 190, marginLeft:"40%"}} source={logoSVG} />
    </ScreenContainer>
  );
};

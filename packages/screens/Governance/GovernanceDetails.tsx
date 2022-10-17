import React, { useState, useCallback } from "react";

import { ScrollView, ViewStyle, StyleProp, View } from "react-native";

import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { BrandText } from "../../components/BrandText/BrandText";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { neutral44 } from "../../utils/style/colors";
import ModalBase from "../../components/modals/ModalBase";

import { RadioButton } from 'react-native-paper';
import {ConfirmationVote} from "../../components/GovernanceBox/ConfirmationVote";
import * as Victory from 'victory'
import {
  MsgVoteEncodeObject,
  isDeliverTxFailure,
} from "@cosmjs/stargate";
import { getKeplrOfflineSigner } from "../../utils/keplr";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import Long from "long";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getTeritoriSigningStargateClient } from "../../utils/teritori";
import { Network } from "../../utils/network";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

export const GovernanceDetails: React.FC < {
  visible?: boolean;
  onClose: () => void;
  numberProposal: string;
  titleProposal: string;
  descriptionProposal: string;
  totalParticipant: number;
  pourcentageTotalParticipant: string;
  votingEndTime: string;
  votingStartTime: string;
  votingSubmitTime: string;
  votingDepositEndTime: string;
  isVotingPeriod: boolean;
  pourcentageYes: string;
  pourcentageNo: string;
}> = ({ visible, onClose, numberProposal, titleProposal, descriptionProposal, totalParticipant,
  pourcentageTotalParticipant, votingStartTime, votingEndTime, votingSubmitTime, votingDepositEndTime,
  isVotingPeriod, pourcentageYes, pourcentageNo }) => {
  const [displayVote, setdisplayVote] = useState(false);
  const [displayConfirmationVote, setdisplayConfirmationVote] = useState(false);
  const [checked, setChecked] = useState('nothingChecked');
  const [displayPopup] = useState(visible);

  const VictoryBar = Victory.VictoryPie;

  function activeVotePopup() {
    console.log("activeVotePopup")
    onClose();
    setdisplayVote(!displayVote);
  }

  var valueChartYes = parseInt(pourcentageYes.replace("%", ""));
  var valueChartNo = parseInt(pourcentageNo.replace("%", ""));
  var valueChartAbstain = 100 - valueChartYes - valueChartNo;

  const selectedWallet = useSelectedWallet();

    const handlePress = useCallback(async () => {
      

      if (
        selectedWallet?.network !== Network.Teritori ||
        !selectedWallet.connected ||
        !selectedWallet.publicKey
      ) {
        // do something about the fact that the currently selected wallet
        // is not suited for a teritori action
        console.error("invalid selected wallet", selectedWallet);
        return;
      }

      try {
        const keplrSigner = getKeplrOfflineSigner();
        const client = await getTeritoriSigningStargateClient(keplrSigner);

        const vote: MsgVoteEncodeObject = {
          typeUrl: "/cosmos.gov.v1beta1.MsgVote",
          value: {
            proposalId: Long.fromNumber(3),
            voter: String(selectedWallet.publicKey),
            option: VoteOption.VOTE_OPTION_YES,
          },
        };
        const result = await client.signAndBroadcast(
          selectedWallet.publicKey,
          [vote],
          "auto"
        );
        if (isDeliverTxFailure(result)) {
          // do something about the fact that the tx was a failure
          console.error("tx failed", result);
        }
    } catch (err) {
      console.error("something unexpected went wrong", err);
    }
  }, [selectedWallet]);


  function deleteee() {
    setdisplayConfirmationVote(false)
    setdisplayVote(!displayVote)
  }

  function activeConfirmationVotePopup() {
    if (displayConfirmationVote == true && checked != 'nothingChecked') {
      return (
        <ConfirmationVote visible={displayConfirmationVote} onClose={() => deleteee() }></ConfirmationVote>
      );
    }
    else {
      return (
        <></>
      );
    }
  }

  function activeVote() {
    setdisplayVote(!displayVote);
  }

  return (
    <ModalBase 
        onClose={() => {activeVotePopup()}}
        label="Governance Details"
        visible={displayPopup}
        width={1300}>
          <View style={{
              flexDirection: "row",
              display: "flex",
              // width: '70%',
              // paddingTop: 60,
              // right: '10%',
              // justifyContent: "space-evenly",
              alignContent: "center",
              flexWrap: "wrap",
            }}>
                <View style={{marginRight: 10}}>
                  <BrandText style={{
                      fontSize: 28,
                      color: "#808080",
                    }}>
                    {numberProposal}
                  </BrandText>
                </View>
                <View style={{marginRight: 20}}>
                  <BrandText style={{
                      fontSize: 28,
                    }}>
                    {titleProposal}
                  </BrandText>
                </View>
                {
                  isVotingPeriod ? <View style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    backgroundColor: "#171717",
                                    borderRadius: 100,
                                    height: 27,
                                    width: 125,
                                    position: "absolute",
                                    left: 20,
                                    top: 20,
                                  }}>
                                    <BrandText style={{
                                      fontSize: 13,
                                      color: "#16BBFF",}}>
                                        VOTING PERIOD 
                                    </BrandText>
                                  </View> : ""
                }
          </View>

          <View style={{
            flexDirection: "row",
            display: "flex",
            width: '70%',
            paddingTop: 20,
            right: '0.5%',
            justifyContent: "space-evenly",
            alignContent: "center",
            flexWrap: "wrap",
            }}>

              <View>
                <BrandText style={{
                    fontSize: 12,
                    color: "#808080",
                  }}>
                  Submit Time
                </BrandText>
                <BrandText style={{
                    fontSize: 13,
                  }}>
                  {votingSubmitTime.slice(0, 10)}
                  &nbsp;
                  {votingSubmitTime.slice(11, 16)}
                  &nbsp;
                  UTC
                </BrandText>
              </View>
              <View style={{
                  width: 35,
                  height: 0,
                  borderWidth: 0.5,
                  borderColor: "#808080",
                  transform: [{ rotate: "90deg" }],
                  marginTop: 15,
              }}/>

              <View>
                <BrandText style={{
                    fontSize: 12,
                    color: "#808080",
                  }}>
                  Deposit End Time
                </BrandText>
                <BrandText style={{
                    fontSize: 13,
                  }}>
                  {votingDepositEndTime.slice(0, 10)}
                  &nbsp;
                  {votingDepositEndTime.slice(11, 16)}
                  &nbsp;
                  UTC
                </BrandText>
              </View>
              <View style={{
                  width: 35,
                  height: 0,
                  borderWidth: 0.5,
                  borderColor: "#808080",
                  transform: [{ rotate: "90deg" }],
                  marginTop: 15,
              }}/>

              <View>
                <BrandText style={{
                    fontSize: 12,
                    color: "#808080",
                  }}>
                  Voting Start
                </BrandText>
                <BrandText style={{
                    fontSize: 13,
                  }}>
                  {votingStartTime.slice(0, 10)}
                  &nbsp;
                  {votingStartTime.slice(11, 16)}
                  &nbsp;
                  UTC
                </BrandText>
              </View>
              <View style={{
                  width: 35,
                  height: 0,
                  borderWidth: 0.5,
                  borderColor: "#808080",
                  transform: [{ rotate: "90deg" }],
                  marginTop: 15,
              }}/>

              <View>
                <BrandText style={{
                    fontSize: 12,
                    color: "#808080",
                  }}>
                  Voting End
                </BrandText>
                <BrandText style={{
                    fontSize: 13,
                  }}>
                  {votingEndTime.slice(0, 10)}
                  &nbsp;
                  {votingEndTime.slice(11, 16)}
                  &nbsp;
                  UTC
                </BrandText>
              </View>
          </View>

          <TertiaryBox width={1240} height={196} style={{right: "-0.5%", marginTop: 25}}>
            <View style={{
              flexDirection: "row",
              display: "flex",
              width: '23%',
              paddingTop: 0,
              right: '22%',
              bottom: 35,
              justifyContent: "space-evenly",
              alignContent: "center",
              flexWrap: "wrap",
            }}>
              <View>
                <BrandText style={{
                    fontSize: 20,
                    color: "#808080",
                  }}>
                  Total
                </BrandText>
              </View>
              <View>
                <BrandText style={{
                      fontSize: 20,
                  }}>
                  {totalParticipant}
                </BrandText>
              </View>
            </View>

            <View style={{
                width: 210,
                position: "absolute",
                left: 5,
                // top: 5,
              }}>
                {/* <PieChart
                    style={{ height: 148, width: 148}}
                    data={WALLET_TOKEN_PIE.map((data) => ({
                      ...data,
                      key: data.title,
                      value: data.percent,
                      svg: {
                        fill: getWalletPieColor(data.title),
                      },
                    }))}
                    innerRadius="50%"
                    padAngle={0.02}
                /> */}
                <VictoryBar
                  innerRadius={70}
                  colorScale={["#16BBFF", "#EAA54B", "#808080"]}
                  data={[
                    { x: "Pourcentage Yes", y: valueChartYes },
                    { x: "Pourcentage No", y: valueChartNo },
                    { x: "Pourcentage Abstain", y: valueChartAbstain }

                  ]}
                />
            </View>

            <View style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems:'center',
                backgroundColor: "#171717",
                borderRadius: 100,
                height: 27,
                width: 125,
                bottom: 25,
                right: '28%',
              }}>

              <BrandText style={{
                fontSize: 13,
                color: "#777777",}}>
                  Turnout:
              </BrandText>
              <BrandText style={{
                fontSize: 13,
                }}>
                  {pourcentageTotalParticipant}
              </BrandText>
        
            </View>

            <View style={{
                flexDirection: "row",
                display: "flex",
                width: '60%',
                // paddingTop: 50,
                top: 20,
                right: '4%',
                justifyContent: "space-evenly",
                alignContent: "center",
                flexWrap: "wrap",
              }}>

                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#16BBFF",
                  borderRadius: 12,
                  // position: "absolute",
                  //   left: 300,
                  //   top: 255,
                }}/>
                  <BrandText style={{
                      fontSize: 14,
                    }}>
                    Yes  99.77%
                  </BrandText>

                <View style={{
                    width: 40,
                    height: 0,
                    borderWidth: 0.5,
                    borderColor: "#808080",
                    transform: [{ rotate: "90deg" }],
                    top: 10,
                }}/>

                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#EAA54B",
                  borderRadius: 12,
                  // position: "absolute",
                  //   left: 300,
                  //   top: 255,
                }}/>
                  <BrandText style={{
                      fontSize: 14,
                    }}>
                    Yes  0.11%
                  </BrandText>

                <View style={{
                    width: 40,
                    height: 0,
                    borderWidth: 0.5,
                    borderColor: "#808080",
                    transform: [{ rotate: "90deg" }],
                    top: 10,
                }}/>

                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#F46F76",
                  borderRadius: 12,
                  // position: "absolute",
                  //   left: 300,
                  //   top: 255,
                }}/>
                  <BrandText style={{
                      fontSize: 14,
                    }}>
                    NoWithVeto  0.01%
                  </BrandText>

                <View style={{
                    width: 40,
                    height: 0,
                    borderWidth: 0.5,
                    borderColor: "#808080",
                    transform: [{ rotate: "90deg" }],
                    top: 10,
                }}/>

                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#333333",
                  borderRadius: 12,
                  // position: "absolute",
                  //   left: 300,
                  //   top: 255,
                }}/>
                <BrandText style={{
                    fontSize: 14,
                  }}>
                  NoWithVeto  0.01%
                </BrandText>
            </View>

            {/* {
              isClicked ? <PrimaryButton
              size="XL"
              style={{ position: "absolute", left: 450, bottom: -40 }}
              text="       Vote       "
              onPress={() => activeVote() }
              /> : ""
            } */}

            <PrimaryButton
              size="XL"
              style={{ position: "absolute", left: 450, bottom: -40 }}
              text="       Vote       "
              onPress={() => activeVote() }
            />
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

              <View style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems:'center',
                height: 70,
                width: 480,
                right: 50,
              }}>

                <View>
                  <SecondaryButton
                    size="M"
                    text="Cancel"
                    style={{}}
                    onPress={activeVotePopup}
                  />
                </View>
                <View>
                  <PrimaryButton
                    size="M"
                    text="Confirm"
                    style={{}}
                    onPress={() => {
                      if (checked != 'nothingChecked') {
                        handlePress()
                        activeVotePopup;
                        setdisplayConfirmationVote(true);
                      }
                    }}
                    />
                </View>
              </View>
            </>
          }>
          <BrandText
            style={{
              fontSize: 14,
              color: "#777777",
            }}>
            #251
          </BrandText>
          <BrandText
            style={{
              fontSize: 16,
              color: "#FFFFFF",
            }}
            >
            IncreaseMaxValidators=100 to MaxValidators=110 <br /><br />
          </BrandText>

          <View style={{paddingBottom: 10, flexDirection: "row"}}>
            <View>
              <RadioButton
                value="Yes"
                color="#16BBFF"
                uncheckedColor="#777777"
                status={ checked === 'Yes' ? 'checked' : 'unchecked' }
                onPress={() => setChecked('Yes')}
              />

            <RadioButton
              value="No"
              color="#EAA54B"
              uncheckedColor="#777777"
              status={ checked === 'No' ? 'checked' : 'unchecked' }
              onPress={() => setChecked('No')}
            />
            <RadioButton
              value="NoWithVeto"
              color="#F46F76"
              uncheckedColor="#777777"
              status={ checked === 'NoWithVeto' ? 'checked' : 'unchecked' }
              onPress={() => setChecked('NoWithVeto')}
            />
            <RadioButton
              value="Abstain"
              color="#333333"
              uncheckedColor="#777777"
              status={ checked === 'Abstain' ? 'checked' : 'unchecked' }
              onPress={() => setChecked('Abstain')}
            />
          </View>
            <View style={{
                bottom: 8,
                height: 160,
                justifyContent: "space-evenly",
                alignItems:"flex-start",
                }}>
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

            <View style={{
                bottom: 8,
                height: 165,
                justifyContent: "space-evenly",
                alignItems:"flex-start",
                }}>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: "#16BBFF",
                borderRadius: 12,
              }}/>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: "#EAA54B",
                borderRadius: 12,
              }}/>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: "#F46F76",
                borderRadius: 12,
              }}/>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: "#333333",
                borderRadius: 12,
              }}/>
            </View>
          </View>
        </ModalBase>

        <ScrollView style={{ height: 260, marginBottom: 50 }}>
          <View style={{width: 1200, marginTop: 50}}>
           <BrandText style={{
              fontSize: 16,
              color: "#777777",}}>
                {descriptionProposal}
            </BrandText>
        </View>
        </ScrollView>

      </ModalBase>
  );
};

import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useQueryClient } from "@tanstack/react-query";
import { range } from "lodash";
import Long from "long";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleProp, TextInput, TextStyle, View, ViewStyle } from "react-native";

import rakkiTicketSVG from "../../../assets/logos/rakki-ticket.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Box, BoxStyle } from "../../components/boxes/Box";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { GradientText } from "../../components/gradientText";
import { UserAvatarWithFrame } from "../../components/images/AvatarWithFrame";
import { GridList } from "../../components/layout/GridList";
import { LoaderFullSize } from "../../components/loaders/LoaderFullScreen";
import ModalBase from "../../components/modals/ModalBase";
import { Username } from "../../components/user/Username";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { ExecMsg, Info } from "../../contracts-clients/rakki/Rakki.types";
import { useRakkiHistory } from "../../hooks/rakki/useRakkiHistory";
import { useRakkiInfo } from "../../hooks/rakki/useRakkiInfo";
import { useBalances } from "../../hooks/useBalances";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  NetworkFeature,
  getKeplrSigningCosmWasmClient,
  getNetwork,
} from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { ScreenFC } from "../../utils/navigation";
import { errorColor } from "../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../utils/style/fonts";
import { modalMarginPadding } from "../../utils/style/modals";
import { joinElements } from "../Multisig/components/MultisigRightSection";

// TODO: replace all placeholders text with real values
// TODO: remove fake history data
// TODO: jap gradient
// TODO: buy button
// TODO: buy button in modal font weight

export const RakkiScreen: ScreenFC<"Rakki"> = () => {
  const networkId = useSelectedNetworkId();
  const { height } = useMaxResolution();
  const { rakkiInfo } = useRakkiInfo(networkId);
  let content;
  if (rakkiInfo === undefined) {
    content = (
      <View style={{ height }}>
        <LoaderFullSize />
      </View>
    );
  } else if (rakkiInfo === null) {
    content = (
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandText style={sectionLabelCStyle}>
          RAKKi is not deployed on this network
        </BrandText>
      </View>
    );
  } else {
    content = (
      <>
        <RakkiLogo style={{ marginTop: 100 }} />
        <PrizeInfo
          info={rakkiInfo}
          networkId={networkId}
          style={{ marginTop: 50 }}
        />
        <GetTicketCTA info={rakkiInfo} style={{ marginTop: 32 }} />
        <GameBox
          info={rakkiInfo}
          networkId={networkId}
          style={{ marginTop: 32 }}
        />
        <Help style={{ marginTop: 50 }} />
        <History
          info={rakkiInfo}
          networkId={networkId}
          style={{ marginTop: 50 }}
        />
      </>
    );
  }
  return (
    <ScreenContainer
      footerChildren={rakkiInfo === undefined ? <></> : undefined}
    >
      {content}
    </ScreenContainer>
  );
};

const BuyTicketsButton: React.FC<{ networkId: string; info: Info }> = ({
  networkId,
  info,
}) => {
  const selectedWallet = useSelectedWallet();
  const [modalVisible, setModalVisible] = useState(false);
  const remainingTickets = info.config.max_tickets - info.current_tickets_count;
  const [ticketAmount, setTicketAmount] = useState("1");
  const queryClient = useQueryClient();
  const ticketAmountNumber = Long.fromString(ticketAmount || "0");
  useEffect(() => {
    if (remainingTickets > 0 && ticketAmountNumber.gt(remainingTickets)) {
      setTicketAmount(remainingTickets.toString());
    }
  }, [ticketAmountNumber, remainingTickets]);
  const totalPrice = ticketAmountNumber.mul(
    Long.fromString(info.config.ticket_price.amount),
  );
  const balances = useBalances(networkId, selectedWallet?.address);
  const ticketDenomBalance =
    balances.find((b) => b.denom === info.config.ticket_price.denom)?.amount ||
    "0";
  const canPay = Long.fromString(ticketDenomBalance).gte(totalPrice);
  const canBuy = ticketAmountNumber.gt(0) && canPay;
  const { wrapWithFeedback } = useFeedbacks();
  return (
    <View style={{ flexDirection: "row" }}>
      <SecondaryButton
        onPress={() => setModalVisible(true)}
        textStyle={{ fontWeight: "400" }}
        text="Buy tickets"
        size="XS"
      />
      <ModalBase
        scrollable
        label="Buy RAKKi tickets!"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <Box
          notched
          style={{
            backgroundColor: "#171717",
            borderWidth: 1,
            borderColor: "#333",
            padding: 12,
            marginBottom: modalMarginPadding,
          }}
        >
          <SVG source={rakkiTicketSVG} height={215.826} />
          <View style={{ gap: 20 }}>
            <Box
              notched
              style={{
                backgroundColor: "#222",
                height: 44,
                paddingHorizontal: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrandText
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontWeight: "400",
                  color: "#A3A3A3",
                }}
              >
                1 ticket price{" "}
                <GradientText
                  style={{ fontSize: 14, lineHeight: 18, fontWeight: "400" }}
                  gradientType="yellow"
                >
                  {prettyPrice(
                    networkId,
                    info.config.ticket_price.amount,
                    info.config.ticket_price.denom,
                  )}
                </GradientText>
              </BrandText>
            </Box>
            <View style={{ gap: 8, alignItems: "center" }}>
              <BrandText
                style={[fontSemibold13, { color: "#777", fontWeight: "400" }]}
              >
                Number of Lottery Tickets
              </BrandText>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#333",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "black",
                  justifyContent: "space-between",
                  width: "100%",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <TextInput
                  value={ticketAmount}
                  onChangeText={(newAmount) => {
                    if (!newAmount) {
                      setTicketAmount(newAmount);
                      return;
                    }
                    const newAmountNumber = +newAmount;
                    if (isNaN(newAmountNumber)) {
                      return;
                    }
                    if (newAmountNumber > remainingTickets) {
                      return;
                    }
                    setTicketAmount(newAmountNumber.toString());
                  }}
                  style={[
                    fontSemibold16,
                    {
                      paddingLeft: 16,
                      paddingRight: 10,
                      fontWeight: "400",
                      color: "white",
                    },
                    { outlineStyle: "none" } as TextStyle,
                  ]}
                />
                <View
                  style={{
                    backgroundColor: "#222",
                    gap: 2,
                    paddingRight: 16,
                    borderLeftWidth: 1,
                    paddingLeft: 10,
                    paddingVertical: 6,
                    borderColor: "#333",
                    width: 140,
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold13,
                      { fontWeight: "400", color: "#777" },
                    ]}
                    numberOfLines={1}
                  >
                    Total price
                  </BrandText>
                  <GradientText
                    gradientType="yellow"
                    style={{
                      fontSize: 14,
                      lineHeight: 18,
                      fontWeight: "400",
                    }}
                  >
                    {prettyPrice(
                      networkId,
                      totalPrice.toString(),
                      info.config.ticket_price.denom,
                    )}
                  </GradientText>
                </View>
              </View>
            </View>
            <Box
              notched
              style={{
                backgroundColor: "#222",
                height: 34,
                paddingHorizontal: 12,
                marginHorizontal: "auto",
                justifyContent: "center",
              }}
            >
              <BrandText
                style={[
                  fontSemibold13,
                  {
                    fontWeight: "400",
                    color: "#777",
                    justifyContent: "center",
                  },
                ]}
              >
                Available Balance{" "}
                <BrandText
                  style={[
                    fontSemibold14,
                    {
                      fontWeight: "400",
                      color: canPay ? "#A3A3A3" : errorColor,
                    },
                  ]}
                >
                  {prettyPrice(
                    networkId,
                    ticketDenomBalance,
                    info.config.ticket_price.denom,
                  )}
                </BrandText>
              </BrandText>
            </Box>
            <View style={{ height: 1, backgroundColor: "#333" }} />
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                marginHorizontal: "auto",
              }}
            >
              <SecondaryButton
                textStyle={{ fontWeight: "400" }}
                text="Cancel"
                size="M"
                onPress={() => setModalVisible(false)}
              />
              <PrimaryButton
                disabled={!canBuy}
                loader
                onPress={wrapWithFeedback(async () => {
                  if (!selectedWallet?.address) {
                    throw new Error("No wallet with valid address selected");
                  }
                  const cosmWasmClient =
                    await getKeplrSigningCosmWasmClient(networkId);
                  const network = getNetwork(networkId);
                  const feature = network?.featureObjects?.find(
                    (o) => o.kind === NetworkFeature.CosmWasmRakki,
                  );
                  if (feature?.kind !== NetworkFeature.CosmWasmRakki) {
                    throw new Error("Rakki not supported on this network");
                  }
                  const msgs: MsgExecuteContractEncodeObject[] = [];
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  for (const _ of range(ticketAmountNumber.toNumber())) {
                    const payload: ExecMsg = {
                      buy_ticket: {
                        entropy: !!Math.round(Math.random()), // FIXME: secure entropy
                      },
                    };
                    msgs.push({
                      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                      value: {
                        sender: selectedWallet.address,
                        contract: feature.contractAddress,
                        msg: toUtf8(JSON.stringify(payload)),
                        funds: [info.config.ticket_price],
                      },
                    });
                  }
                  await cosmWasmClient.signAndBroadcast(
                    selectedWallet.address,
                    msgs,
                    "auto",
                  );
                  await Promise.all([
                    queryClient.invalidateQueries(["rakkiInfo", networkId]),
                    queryClient.invalidateQueries([
                      "balances",
                      networkId,
                      selectedWallet.address,
                    ]),
                    queryClient.invalidateQueries(["rakkiHistory", networkId]),
                  ]);
                  setModalVisible(false);
                })}
                text="Buy Tickets"
                size="M"
              />
            </View>
          </View>
        </Box>
      </ModalBase>
    </View>
  );
};

const History: React.FC<{
  style?: StyleProp<ViewStyle>;
  networkId: string;
  info: Info;
}> = ({ style, networkId, info }) => {
  const { width } = useMaxResolution();
  const isSmallScreen = width < 400;
  const { rakkiHistory } = useRakkiHistory(networkId);
  if (!rakkiHistory?.length) {
    return null;
  }
  return (
    <View style={style}>
      <BrandText style={sectionLabelCStyle}>RAKKi Finished Rounds</BrandText>
      <Box notched style={{ backgroundColor: "#222", marginTop: 32 }}>
        <Box
          notched
          style={{
            backgroundColor: "#333",
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText
            style={[gameBoxLabelCStyle, { textAlign: "left", marginRight: 10 }]}
          >
            Rounds
          </BrandText>
          <BrandText
            style={{
              textAlign: "right",
              fontSize: 12,
              lineHeight: 16,
              letterSpacing: -0.48,
              fontWeight: "400",
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: "#222",
              borderRadius: 16,
            }}
          >
            {rakkiHistory.length}
          </BrandText>
        </Box>
        {joinElements(
          rakkiHistory.map((historyItem) => {
            return (
              <View
                key={historyItem.date.toISOString()}
                style={{
                  padding: 12,
                  flexDirection: isSmallScreen ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isSmallScreen ? "flex-start" : "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: isSmallScreen ? "100%" : undefined,
                    justifyContent: isSmallScreen ? "space-between" : undefined,
                  }}
                >
                  <UserAvatarWithFrame
                    style={{ marginRight: 17 }}
                    userId={historyItem.winnerUserId}
                    size="XS"
                  />
                  <Username
                    textStyle={gameBoxLabelCStyle}
                    userId={historyItem.winnerUserId}
                  />
                </View>
                <BrandText
                  style={[
                    fontMedium10,
                    {
                      color: "#777",
                      fontWeight: "400",
                      marginTop: isSmallScreen ? 12 : 0,
                    },
                  ]}
                >
                  Drawn{" "}
                  {moment(historyItem.date.getTime()).format(
                    "MMM D, YYYY, h:mm A",
                  )}
                </BrandText>
              </View>
            );
          }),
          <View style={{ height: 1, backgroundColor: "#333" }} />,
        )}
        <View style={{ height: 1, backgroundColor: "#333" }} />
        <View
          style={{
            height: 173,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BuyTicketsButton networkId={networkId} info={info} />
        </View>
      </Box>
    </View>
  );
};

interface HelpBoxDefinition {
  title: string;
  description: string;
}

const Help: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  const helpBoxes: HelpBoxDefinition[] = [
    {
      title: "Buy Tickets",
      description:
        "Prices are $10 USDC per ticket.\nGamblers can buy multiple tickets.",
    },
    {
      title: "Wait for the Draw",
      description:
        "Players just have to wait until the cash prize pool is reached.",
    },
    {
      title: "Check for Prizes",
      description:
        "Once the cashprize pool is reached, the winner receive the $10,000 transaction directly!",
    },
  ];
  return (
    <View style={[{ alignItems: "center", gap: 20 }, style]}>
      <BrandText style={sectionLabelCStyle}>How to Play RAKKi</BrandText>
      <BrandText style={[{ maxWidth: 302 }, gameBoxLabelCStyle]}>
        {`When the community lottery pool reaches the 10k USDC amount, only one will be the winner!\nSimple!`}
      </BrandText>
      <View style={{ width: "100%" }}>
        <GridList<HelpBoxDefinition>
          minElemWidth={280}
          gap={14}
          keyExtractor={(item) => item.title}
          noFixedHeight
          data={helpBoxes}
          renderItem={({ item, index }, width) => {
            return (
              <TertiaryBox style={{ width }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#333",
                  }}
                >
                  <BrandText style={[fontSemibold12, { fontWeight: "400" }]}>
                    {item.title}
                  </BrandText>
                  <BrandText
                    style={[fontMedium10, { fontWeight: "400", color: "#777" }]}
                  >
                    Step {index + 1}
                  </BrandText>
                </View>
                <BrandText
                  style={[
                    gameBoxLabelCStyle,
                    {
                      textAlign: "left",
                      padding: 12,
                      height: 56,
                    },
                  ]}
                >
                  {item.description}
                </BrandText>
              </TertiaryBox>
            );
          }}
        />
      </View>
    </View>
  );
};

const GameBox: React.FC<{
  networkId: string;
  info: Info;
  style?: StyleProp<BoxStyle>;
}> = ({ networkId, info, style }) => {
  const totalPrizeAmount = Long.fromString(info.config.ticket_price.amount).mul(
    info.current_tickets_count,
  );
  const feePrizeAmount = totalPrizeAmount
    .mul(info.config.fee_per10k)
    .div(10000);
  const winnerPrizeAmount = totalPrizeAmount.sub(feePrizeAmount);
  return (
    <Box notched style={[{ backgroundColor: "#222" }, style]}>
      <Box
        notched
        style={{
          backgroundColor: "#333",
          padding: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BrandText style={[gameBoxLabelCStyle, { textAlign: "left" }]}>
          Next Draw
        </BrandText>
        <BrandText
          style={{
            textAlign: "right",
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: -0.48,
            fontWeight: "400",
          }}
        >
          When the {info.config.max_tickets - info.current_tickets_count}{" "}
          remaining tickets will be sold out.
        </BrandText>
      </Box>
      <View
        style={{
          padding: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BrandText style={gameBoxLabelCStyle}>Prize Pot</BrandText>
        <View
          style={{
            flexDirection: "row",
            gap: 18,
            alignItems: "center",
          }}
        >
          <GradientText
            style={{
              fontSize: 12,
              lineHeight: 16,
              letterSpacing: -0.48,
              fontWeight: "400",
            }}
            gradientType="yellow"
          >
            ~
            {prettyPrice(
              networkId,
              winnerPrizeAmount.toString(),
              info.config.ticket_price.denom,
            )}
          </GradientText>
          <BrandText
            style={{
              color: "#8C8D8E",
              fontSize: 10,
              lineHeight: 12,
              letterSpacing: -0.04,
              fontWeight: "400",
            }}
          >
            ({info.current_tickets_count} TICKETS)
          </BrandText>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 12,
          alignItems: "center",
        }}
      >
        <BrandText style={gameBoxLabelCStyle}>Your tickets</BrandText>
        <BuyTicketsButton networkId={networkId} info={info} />
      </View>
    </Box>
  );
};

const GetTicketCTA: React.FC<{ info: Info; style?: StyleProp<ViewStyle> }> = ({
  info,
  style,
}) => {
  return (
    <View style={style}>
      <BrandText style={sectionLabelCStyle}>Get your tickets now!</BrandText>
      <View
        style={{
          gap: 12,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          height: 32,
        }}
      >
        <BrandText
          style={{
            textAlign: "center",
            fontSize: 28,
            letterSpacing: -1.12,
            color: "#16BBFF",
            fontWeight: "600",
          }}
        >
          {info.config.max_tickets - info.current_tickets_count}
        </BrandText>
        <BrandText
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "#16BBFF",
            marginBottom: 5.4,
            fontWeight: "600",
          }}
        >
          tickets
        </BrandText>
        <BrandText
          style={{
            textAlign: "center",
            fontSize: 14,
            marginBottom: 5.4,
            fontWeight: "600",
          }}
        >
          remaining
        </BrandText>
      </View>
    </View>
  );
};

const PrizeInfo: React.FC<{
  info: Info;
  networkId: string;
  style?: StyleProp<ViewStyle>;
}> = ({ info, networkId, style }) => {
  const totalPrizeAmount = Long.fromString(info.config.ticket_price.amount).mul(
    info.config.max_tickets,
  );
  const feePrizeAmount = totalPrizeAmount
    .mul(info.config.fee_per10k)
    .div(10000);
  const winnerPrizeAmount = totalPrizeAmount.sub(feePrizeAmount);
  return (
    <View style={[{ alignItems: "center" }, style]}>
      <BrandText
        style={{
          textAlign: "center",
          fontSize: 20,
          lineHeight: 24,
          letterSpacing: -0.8,
          marginBottom: 12,
          fontWeight: "600",
        }}
      >
        Automated Lottery
      </BrandText>
      <GradientText
        style={{
          fontSize: 28,
          lineHeight: 32,
          letterSpacing: -1.12,
          fontWeight: "600",
        }}
        gradientType="yellow"
      >
        {prettyPrice(
          networkId,
          winnerPrizeAmount.toString(),
          info.config.ticket_price.denom,
        )}
      </GradientText>
      <BrandText
        style={{
          textAlign: "center",
          fontSize: 14,
          lineHeight: 16,
          marginTop: 12,
          fontWeight: "600",
        }}
      >
        in prizes!
      </BrandText>
      <SVG style={{ marginTop: 50 }} source={rakkiTicketSVG} height={215.826} />
    </View>
  );
};

const RakkiLogo: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <View style={style}>
      <RakkiJap />
      <BrandText
        style={{
          textAlign: "center",
          fontSize: 96.667,
          lineHeight: 116 /* 120% */,
          letterSpacing: -3.867,
          fontWeight: "600",
        }}
      >
        RAKKi
      </BrandText>
      <RakkiJap />
    </View>
  );
};

const RakkiJap: React.FC = () => {
  return (
    <View>
      <BrandText
        style={[
          rakkiJapTextCStyle,
          {
            color: "#676767",
          },
        ]}
      >
        ラ
        <BrandText style={[rakkiJapTextCStyle, { color: "white" }]}>
          ッ
        </BrandText>
        キー
      </BrandText>
    </View>
  );
};

const rakkiJapTextCStyle: TextStyle = {
  textAlign: "center",
  fontSize: 51.933,
  lineHeight: 62.319 /* 120% */,
  letterSpacing: -2.077,
  fontWeight: "600",
};

const gameBoxLabelCStyle: TextStyle = {
  color: "#777",
  textAlign: "center",
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: -0.48,
  fontWeight: "400",
};

const sectionLabelCStyle: TextStyle = {
  textAlign: "center",
  fontSize: 28,
  lineHeight: 32,
  letterSpacing: -1.12,
  marginBottom: 12,
  fontWeight: "600",
};

import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useQueryClient } from "@tanstack/react-query";
import Long from "long";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleProp, TextInput, TextStyle, View, ViewStyle } from "react-native";

import ticketIconSVG from "../../../assets/icons/ticket.svg";
import rakkiTicketImage from "../../../assets/logos/rakki-ticket.png";
import { BrandText } from "../../components/BrandText";
import { OptimizedImage } from "../../components/OptimizedImage";
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
import { useRakkiTicketsCountByUser } from "../../hooks/rakki/useRakkiTicketsByUser";
import { useBalances } from "../../hooks/useBalances";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkFeature, getNetworkFeature } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { ScreenFC } from "../../utils/navigation";
import {
  errorColor,
  neutral00,
  neutral17,
  neutral22,
  neutral33,
  neutral67,
  neutral77,
  neutralA3,
  neutralFF,
  primaryColor,
} from "../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";
import { joinElements } from "../Multisig/components/MultisigRightSection";

import { MainConnectWalletButton } from "@/components/connectWallet/MainConnectWalletButton";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";

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
        <GetTicketCTA
          info={rakkiInfo}
          style={{ marginTop: layout.spacing_x4 }}
          networkId={networkId}
        />
        <GameBox
          info={rakkiInfo}
          networkId={networkId}
          style={{ marginTop: layout.spacing_x4 }}
        />
        <Help style={{ marginTop: 60 }} />
        <History
          info={rakkiInfo}
          networkId={networkId}
          style={{ marginTop: 60 }}
        />
      </>
    );
  }
  return (
    <ScreenContainer
      footerChildren={rakkiInfo === undefined ? <></> : undefined}
    >
      <View style={{ width: "100%", maxWidth: 664, alignSelf: "center" }}>
        {content}
      </View>
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
  const { balances } = useBalances(networkId, selectedWallet?.address);
  const ticketDenomBalance =
    balances.find((b) => b.denom === info.config.ticket_price.denom)?.amount ||
    "0";
  const canPay = Long.fromString(ticketDenomBalance).gte(totalPrice);
  const canBuy = ticketAmountNumber.gt(0) && canPay;
  const { wrapWithFeedback } = useFeedbacks();

  // FIXME "From Uknown" in DepositWithdrawModal. Same in TopMenyMyWallet.tsx
  // const [isDepositVisible, setDepositVisible] = useState(false);
  // const network = getCosmosNetwork(networkId);
  // const atomIbcCurrency = useMemo(() => {
  //   return network?.currencies.find(
  //     (currencyInfo: CurrencyInfo) =>
  //       currencyInfo.kind === "ibc" && currencyInfo.sourceDenom === "uatom",
  //   );
  // }, [network]);

  const onPressBuyTickets = wrapWithFeedback(async () => {
    if (!selectedWallet?.address) {
      throw new Error("No wallet with valid address selected");
    }
    const cosmWasmClient = await getKeplrSigningCosmWasmClient(networkId);
    const feature = getNetworkFeature(networkId, NetworkFeature.CosmWasmRakki);
    if (feature?.type !== NetworkFeature.CosmWasmRakki) {
      throw new Error("Rakki not supported on this network");
    }
    const msgs: MsgExecuteContractEncodeObject[] = [];
    const len = ticketAmountNumber.toNumber();
    for (let i = 0; i < len; i++) {
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
    await cosmWasmClient.signAndBroadcast(selectedWallet.address, msgs, "auto");
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
  });

  return (
    <View style={{ flexDirection: "row" }}>
      <PrimaryButton
        onPress={() => setModalVisible(true)}
        boxStyle={{ width: 200 }}
        text="Buy Tickets"
        size="M"
      />
      <ModalBase
        scrollable
        label="Buy RAKKi Tickets!"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <Box
          notched
          style={{
            backgroundColor: neutral17,
            borderWidth: 1,
            borderColor: neutral33,
            padding: layout.spacing_x1_5,
            marginBottom: modalMarginPadding,
          }}
        >
          <OptimizedImage
            sourceURI={rakkiTicketImage}
            style={{ width: 457, height: 260 }}
            width={457}
            height={260}
          />

          <View style={{ gap: layout.spacing_x2_5 }}>
            <Box
              notched
              style={{
                backgroundColor: neutral22,
                height: 44,
                paddingHorizontal: layout.spacing_x1_5,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  backgroundColor: neutral33,
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SVG source={ticketIconSVG} width={16} height={16} />
              </View>
              <BrandText
                style={[
                  {
                    color: neutralA3,
                    marginLeft: layout.spacing_x1,
                  },
                  fontSemibold14,
                ]}
              >
                1 ticket price{" "}
                <GradientText
                  style={[
                    fontSemibold14,
                    { marginLeft: layout.spacing_x0_75 } as TextStyle,
                  ]}
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
            <View style={{ gap: layout.spacing_x1, alignItems: "center" }}>
              <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                Number of Lottery Tickets
              </BrandText>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: neutral33,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: neutral00,
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
                      paddingLeft: layout.spacing_x2,
                      paddingRight: layout.spacing_x1_25,
                      color: neutralFF,
                    },
                    { outlineStyle: "none" } as TextStyle,
                  ]}
                />
                <View
                  style={{
                    backgroundColor: neutral22,
                    gap: 2,
                    paddingRight: layout.spacing_x2,
                    borderLeftWidth: 1,
                    paddingLeft: 10,
                    paddingVertical: 6,
                    borderColor: neutral33,
                    width: 140,
                  }}
                >
                  <BrandText
                    style={[fontSemibold13, { color: neutral77 }]}
                    numberOfLines={1}
                  >
                    Total price
                  </BrandText>
                  <GradientText gradientType="yellow" style={fontSemibold14}>
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
                backgroundColor: neutral22,
                height: 34,
                paddingHorizontal: layout.spacing_x1_5,
                marginHorizontal: "auto",
                justifyContent: "center",
              }}
            >
              {!selectedWallet?.address ? (
                <BrandText
                  style={[
                    fontSemibold13,
                    {
                      color: errorColor,
                    },
                  ]}
                >
                  Not connected
                </BrandText>
              ) : (
                <BrandText
                  style={[
                    fontSemibold13,
                    {
                      color: neutral77,
                      justifyContent: "center",
                    },
                  ]}
                >
                  Available Balance{" "}
                  <BrandText
                    style={[
                      fontSemibold14,
                      {
                        marginLeft: layout.spacing_x0_5,
                        color: canPay ? neutralA3 : errorColor,
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
              )}
            </Box>
            <View style={{ height: 1, backgroundColor: neutral33 }} />
            <View
              style={{
                flexDirection: "row",
                gap: layout.spacing_x3,
                marginHorizontal: "auto",
              }}
            >
              <SecondaryButton
                text="Cancel"
                size="M"
                onPress={() => setModalVisible(false)}
              />

              {!selectedWallet?.address ? (
                <MainConnectWalletButton
                  style={{ alignSelf: "center" }}
                  size="M"
                />
              ) : (
                // FIXME "From Uknown" in DepositWithdrawModal. Same in TopMenyMyWallet.tsx
                // Uncomment this when it works
                // : !canPay ?
                // <PrimaryButton
                //   disabled={!canPay}
                //   loader
                //   onPress={() => setDepositVisible(true)}
                //   text="Deposit funds"
                //   size="M"
                // />
                // :
                <PrimaryButton
                  disabled={!canBuy}
                  loader
                  onPress={onPressBuyTickets}
                  text="Buy Tickets"
                  size="M"
                />
              )}
            </View>
          </View>
        </Box>

        {/* // FIXME "From Uknown" in DepositWithdrawModal. Same in TopMenyMyWallet.tsx
        Uncomment this when it works */}
        {/* <DepositWithdrawModal
          variation="deposit"
          networkId={networkId}
          targetCurrency={atomIbcCurrency?.denom}
          onClose={() => setDepositVisible(false)}
          isVisible={isDepositVisible}
        /> */}
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
      <Box
        notched
        style={{ backgroundColor: neutral22, marginTop: layout.spacing_x2 }}
      >
        <Box
          notched
          style={{
            backgroundColor: neutral33,
            paddingHorizontal: layout.spacing_x1_5,
            paddingVertical: layout.spacing_x1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BrandText
            style={[gameBoxLabelCStyle, { textAlign: "left", marginRight: 10 }]}
          >
            Rounds
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: layout.spacing_x1,
              height: 24,
              minWidth: 24,
              backgroundColor: neutral22,
              borderRadius: 16,
            }}
          >
            <BrandText style={fontSemibold12}>{rakkiHistory.length}</BrandText>
          </View>
        </Box>
        {joinElements(
          rakkiHistory.map((historyItem) => {
            return (
              <View
                key={historyItem.date.toISOString()}
                style={{
                  padding: layout.spacing_x1_5,
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
                    style={{ marginRight: layout.spacing_x1_5 }}
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
                      color: neutral77,
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
          <View style={{ height: 1, backgroundColor: neutral33 }} />,
        )}
        <View style={{ height: 1, backgroundColor: neutral33 }} />
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
    <View style={[{ alignItems: "center", gap: layout.spacing_x3 }, style]}>
      <BrandText style={fontSemibold28}>How to Play RAKKi</BrandText>
      <BrandText style={[{ maxWidth: 302 }, gameBoxLabelCStyle]}>
        {`When the community lottery pool reaches the 10k USDC amount, only one will be the winner!\nSimple!`}
      </BrandText>
      <View style={{ width: "100%" }}>
        <GridList<HelpBoxDefinition>
          minElemWidth={212}
          gap={layout.spacing_x1_75}
          keyExtractor={(item) => item.title}
          noFixedHeight
          data={helpBoxes}
          renderItem={({ item, index }, width) => {
            return (
              <TertiaryBox style={{ width, minHeight: 116 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: layout.spacing_x1_5,
                    borderBottomWidth: 1,
                    borderBottomColor: neutral33,
                  }}
                >
                  <BrandText style={fontSemibold12}>{item.title}</BrandText>
                  <BrandText style={[fontMedium10, { color: neutral77 }]}>
                    Step {index + 1}
                  </BrandText>
                </View>
                <BrandText
                  style={[
                    gameBoxLabelCStyle,
                    {
                      letterSpacing: -(12 * 0.01),
                      textAlign: "left",
                      padding: layout.spacing_x1_5,
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
        <BrandText
          style={[
            {
              marginTop: layout.spacing_x1_5,
              color: neutral77,
              alignSelf: "center",
            },
            fontSemibold12,
          ]}
        >
          *On the total amount, 10% are sent to a multisig wallet to buyback and
          burn $TORI token.
        </BrandText>
      </View>
    </View>
  );
};

const GameBox: React.FC<{
  networkId: string;
  info: Info;
  style?: StyleProp<BoxStyle>;
}> = ({ networkId, info, style }) => {
  const selectedWallet = useSelectedWallet();
  const { ticketsCount: userTicketsCount } = useRakkiTicketsCountByUser(
    networkId,
    selectedWallet?.address,
  );
  const totalPrizeAmount = Long.fromString(info.config.ticket_price.amount).mul(
    info.current_tickets_count,
  );
  const userAmount = userTicketsCount
    ? Long.fromString(info.config.ticket_price.amount).mul(userTicketsCount)
    : 0;
  const feePrizeAmount = totalPrizeAmount
    .mul(info.config.fee_per10k)
    .div(10000);
  const winnerPrizeAmount = totalPrizeAmount.sub(feePrizeAmount);
  return (
    <Box notched style={[{ backgroundColor: neutral22 }, style]}>
      <Box
        notched
        style={{
          backgroundColor: neutral33,
          padding: layout.spacing_x1_5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BrandText style={[gameBoxLabelCStyle, { textAlign: "left" }]}>
          Next Draw
        </BrandText>
        <BrandText
          style={[
            {
              textAlign: "right",
            },
            fontSemibold12,
          ]}
        >
          When the {info.config.max_tickets - info.current_tickets_count}{" "}
          remaining tickets will be sold out.
        </BrandText>
      </Box>
      <View
        style={{
          padding: layout.spacing_x1_5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BrandText style={gameBoxLabelCStyle}>Prize Pot</BrandText>
        <TicketsAndPrice
          price={prettyPrice(
            networkId,
            winnerPrizeAmount.toString(),
            info.config.ticket_price.denom,
          )}
          ticketsCount={info.current_tickets_count}
        />
      </View>
      <View
        style={{
          paddingHorizontal: layout.spacing_x1_5,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: layout.spacing_x1_5,
          alignItems: "center",
        }}
      >
        <BrandText style={gameBoxLabelCStyle}>Your tickets</BrandText>
        {userTicketsCount !== null ? (
          <TicketsAndPrice
            price={prettyPrice(
              networkId,
              userAmount.toString(),
              info.config.ticket_price.denom,
            )}
            ticketsCount={userTicketsCount}
          />
        ) : (
          <BrandText
            style={[
              {
                color: neutralA3,
                lineHeight: layout.spacing_x1_5,
              },
              fontMedium10,
            ]}
          >
            Not connected
          </BrandText>
        )}
      </View>
    </Box>
  );
};

const GetTicketCTA: React.FC<{
  networkId: string;
  info: Info;
  style?: StyleProp<ViewStyle>;
}> = ({ networkId, info, style }) => {
  return (
    <View style={style}>
      <BrandText style={sectionLabelCStyle}>Get your tickets now!</BrandText>
      <View
        style={{
          gap: layout.spacing_x1_5,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          height: 32,
        }}
      >
        <BrandText
          style={[
            {
              textAlign: "center",
              color: primaryColor,
            },
            fontSemibold28,
          ]}
        >
          {info.config.max_tickets - info.current_tickets_count}
        </BrandText>
        <BrandText
          style={[
            {
              textAlign: "center",
              color: primaryColor,
              marginBottom: 5.4,
            },
            fontSemibold14,
          ]}
        >
          tickets
        </BrandText>
        <BrandText
          style={[
            {
              textAlign: "center",
              marginBottom: 5.4,
            },
            fontSemibold14,
          ]}
        >
          remaining
        </BrandText>
      </View>
      <View style={{ alignSelf: "center", marginTop: layout.spacing_x2 }}>
        <BuyTicketsButton networkId={networkId} info={info} />
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
        style={[
          {
            textAlign: "center",
            marginBottom: layout.spacing_x1_5,
          },
          fontSemibold20,
        ]}
      >
        Automated Lottery
      </BrandText>
      <GradientText style={fontSemibold28} gradientType="yellow">
        {prettyPrice(
          networkId,
          winnerPrizeAmount.toString(),
          info.config.ticket_price.denom,
        )}
      </GradientText>
      <BrandText
        style={[
          {
            textAlign: "center",
            marginTop: layout.spacing_x1_5,
          },
          fontSemibold14,
        ]}
      >
        in prizes!
      </BrandText>
      <OptimizedImage
        sourceURI={rakkiTicketImage}
        style={{ width: 457, height: 260, marginTop: 50 }}
        width={457}
        height={260}
      />
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
            color: neutral67,
          },
        ]}
      >
        ラ
        <BrandText style={[rakkiJapTextCStyle, { color: neutralFF }]}>
          ッ
        </BrandText>
        キー
      </BrandText>
    </View>
  );
};

const TicketsAndPrice: React.FC<{
  ticketsCount: number;
  price: string;
}> = ({ ticketsCount, price }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 18,
        alignItems: "center",
      }}
    >
      <GradientText style={fontSemibold14} gradientType="yellow">
        ~{price}
      </GradientText>
      <BrandText
        style={[
          {
            color: neutralA3,
          },
          fontMedium10,
        ]}
      >
        ({ticketsCount} TICKETS)
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
  ...fontSemibold12,
  color: neutral77,
  textAlign: "center",
};

const sectionLabelCStyle: TextStyle = {
  ...fontSemibold28,
  textAlign: "center",
  marginBottom: layout.spacing_x1_5,
};

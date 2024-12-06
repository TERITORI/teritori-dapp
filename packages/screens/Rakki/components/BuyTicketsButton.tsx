import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useQueryClient } from "@tanstack/react-query";
import Long from "long";
import { FC, useEffect, useMemo, useState } from "react";
import { TextInput, TextStyle, View } from "react-native";

import rakkiTicketSVG from "@/assets/icons/rakki-ticket.svg";
import rakkiTicketImage from "@/assets/logos/rakki-ticket.png";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { Box } from "@/components/boxes/Box";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { MainConnectWalletButton } from "@/components/connectWallet/MainConnectWalletButton";
import { GradientText } from "@/components/gradientText";
import { DepositWithdrawModal } from "@/components/modals/DepositWithdrawModal";
import ModalBase from "@/components/modals/ModalBase";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { ExecMsg, Info } from "@/contracts-clients/rakki/Rakki.types";
import { useBalances } from "@/hooks/useBalances";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  NetworkFeature,
  getNetworkFeature,
  getCosmosNetwork,
  CurrencyInfo,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { prettyPrice } from "@/utils/coins";
import {
  errorColor,
  neutral00,
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  neutralFF,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { modalMarginPadding } from "@/utils/style/modals";

export const BuyTicketsButton: FC<{ networkId: string; info: Info }> = ({
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

  const [isDepositVisible, setDepositVisible] = useState(false);
  const network = getCosmosNetwork(networkId);
  const atomIbcCurrency = useMemo(() => {
    return network?.currencies.find(
      (currencyInfo: CurrencyInfo) =>
        currencyInfo.kind === "ibc" && currencyInfo.sourceDenom === "uatom",
    );
  }, [network]);

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
                <SVG source={rakkiTicketSVG} width={24} height={24} />
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
              ) : !canPay ? (
                <PrimaryButton
                  loader
                  onPress={() => setDepositVisible(true)}
                  text="Deposit funds"
                  size="M"
                />
              ) : (
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

        <DepositWithdrawModal
          variation="deposit"
          networkId={networkId}
          targetCurrency={atomIbcCurrency?.denom}
          onClose={() => setDepositVisible(false)}
          isVisible={isDepositVisible}
        />
      </ModalBase>
    </View>
  );
};

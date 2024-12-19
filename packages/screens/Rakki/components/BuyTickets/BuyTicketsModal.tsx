import { useQueryClient } from "@tanstack/react-query";
import Long from "long";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { TextInput, TextStyle, View } from "react-native";

import rakkiTicketSVG from "@/assets/icons/rakki-ticket.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Box } from "@/components/boxes/Box";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { MainConnectWalletButton } from "@/components/connectWallet/MainConnectWalletButton";
import { GradientText } from "@/components/gradientText";
import ModalBase from "@/components/modals/ModalBase";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { Info, RakkiClient } from "@/contracts-clients/rakki";
import { useBalances } from "@/hooks/useBalances";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { ModalTicketImage } from "@/screens/Rakki/components/BuyTickets/ModalTicketImage";
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

export const BuyTicketsModal: FC<{
  visible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  info: Info;
  networkId: string;
}> = ({ visible, setModalVisible, info, networkId }) => {
  const selectedWallet = useSelectedWallet();
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

  const onPressBuyTickets = wrapWithFeedback(async () => {
    if (!selectedWallet?.address) {
      throw new Error("No wallet with valid address selected");
    }
    const cosmWasmClient = await getKeplrSigningCosmWasmClient(networkId);
    const feature = getNetworkFeature(networkId, NetworkFeature.CosmWasmRakki);
    if (feature?.type !== NetworkFeature.CosmWasmRakki) {
      throw new Error("Rakki not supported on this network");
    }
    const rakkiClient = new RakkiClient(
      cosmWasmClient,
      selectedWallet.address,
      feature.contractAddress,
    );
    const count = ticketAmountNumber.toNumber();
    const price = {
      amount: Long.fromString(info.config.ticket_price.amount)
        .multiply(count)
        .toString(),
      denom: info.config.ticket_price.denom,
    };
    await rakkiClient.buyTickets(
      {
        count,
      },
      "auto",
      undefined,
      [price],
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
  });

  return (
    <ModalBase
      scrollable
      label="Buy RAKKi Tickets!"
      visible={visible}
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
        <ModalTicketImage />

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
    </ModalBase>
  );
};

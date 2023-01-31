import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";

import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { FreelanceOrderModal } from "../../../components/modals/freelanceOrder/FreelanceOrderModal";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { TeritoriOrderClient } from "../../../contracts-clients/teritori-freelance-order/TeritoriOrder.client";
import { OrderParams } from "../../../contracts-clients/teritori-freelance-order/TeritoriOrder.types";
import { useIsKeplrConnected } from "../../../hooks/useIsKeplrConnected";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../../utils/keplr";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import {
  primaryColor,
  neutral77,
  neutral22,
  neutral00,
  secondaryColor,
  neutral33,
} from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold20 } from "../../../utils/style/fonts";
import { FirstRightCard } from "./FirstRightCard";
import { FirstStep } from "./FirstStep";
import { SecondRightCard } from "./SecondRightCard";

export type OrderModals = "Order";
const OrderPathMap = {
  Order: "order",
};
export const OrderDetails: ScreenFC<"OrderDetails"> = ({ route }) => {
  const wallet = useSelectedWallet();
  const navigation = useAppNavigation();
  const isKeplrConnected = useIsKeplrConnected();
  const { setToastError } = useFeedbacks();

  const currentStyle = StyleSheet.create({
    circle: {
      width: 40,
      height: 40,
      lineHeight: 40,
      borderRadius: 20,
      backgroundColor: primaryColor,
      color: neutral00,
      textAlign: "center",
      marginRight: 12,
      fontSize: 16,
    },
    text: { color: primaryColor },
  });

  const previousStyle = StyleSheet.create({
    circle: {
      width: 40,
      height: 40,
      lineHeight: 40,
      borderRadius: 20,
      backgroundColor: secondaryColor,
      color: neutral00,
      textAlign: "center",
      marginRight: 12,
      fontSize: 16,
    },
    text: { color: secondaryColor },
  });

  const nextStyle = StyleSheet.create({
    circle: {
      width: 40,
      height: 40,
      lineHeight: 40,
      borderRadius: 20,
      backgroundColor: neutral22,
      color: neutral77,
      textAlign: "center",
      marginRight: 12,
      fontSize: 16,
    },
    text: { color: neutral77 },
  });

  const [step, setStep] = useState<number>(2);
  const [firstStepStyle, setFirstStepStyle] = useState(currentStyle);
  const [secondStepStyle, setSecondStepStyle] = useState(nextStyle);
  const thirdStepStyle = nextStyle;

  const [payment, setPayment] = useState<string>("");

  const [, setActiveModal] = useState<OrderModals>();
  const [modalOrderVisible, setModalOrderVisible] = useState(false);

  const handleModalChange = (modal?: string, name?: string) => {
    if (!modal) {
      setActiveModal(undefined);
      setModalOrderVisible(false);
      return;
    }
    try {
      //@ts-ignore
      const routeName = Object.keys(OrderPathMap).find(
        //@ts-ignore
        (key) => OrderPathMap[key] === modal
      );
      //@ts-ignore

      if (["order"].includes(modal) && !name) {
        setModalOrderVisible(true);
      } else {
        //@ts-ignore
        setActiveModal(routeName);
        setModalOrderVisible(false);
      }
    } catch (err) {
      console.log("route path parsing failed", err);
    }
  };

  useEffect(() => {
    handleModalChange(route.params?.modal, route.params?.name);
  }, [route]);

  const submitData = async (data: OrderParams) => {
    setModalOrderVisible(false);
    if (!isKeplrConnected) {
      setToastError({
        title: "Please connect Keplr",
        message: "",
      });
      return;
    }
    try {
      const client = new TeritoriOrderClient(
        await getSigningCosmWasmClient(),
        wallet?.address || "",
        process.env.TERITORI_ESCROW_CONTRACT_ADDRESS || ""
      );

      const cw20Addr = data.cw20Addr!;
      const amount = data.amount!; //need to change later.
      const receiver = data.seller!; //need to change later.
      const expireAt = data.expireAt!; // need to change later

      await client.createContract({
        cw20Addr,
        amount,
        receiver,
        expireAt: parseInt(expireAt, 2),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScreenContainer fullWidth>
      <View
        style={{
          marginTop: 24,
          flexDirection: "row",
          width: 1280,
          margin: "auto",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                setStep(1);
                setFirstStepStyle(currentStyle);
              }}
            >
              <BrandText style={firstStepStyle.circle}>1</BrandText>
              <BrandText style={[fontSemibold20, firstStepStyle.text]}>
                Order Details
              </BrandText>
            </TouchableOpacity>
            <SVG
              source={chevronRightSVG}
              style={{ width: 15, margin: "0 20" }}
              color={neutral77}
            />
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                setStep(2);
                setSecondStepStyle(currentStyle);
                setFirstStepStyle(previousStyle);
              }}
            >
              <BrandText style={secondStepStyle.circle}>2</BrandText>
              <BrandText style={[fontSemibold20, secondStepStyle.text]}>
                Confirm & Pay
              </BrandText>
            </TouchableOpacity>

            <SVG
              source={chevronRightSVG}
              style={{ width: 15, margin: "0 20" }}
              color={neutral77}
            />

            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                setStep(3);
                setSecondStepStyle(previousStyle);
                setFirstStepStyle(previousStyle);
              }}
            >
              <BrandText style={thirdStepStyle.circle}>3</BrandText>
              <BrandText style={[fontSemibold20, thirdStepStyle.text]}>
                Submit Requirements
              </BrandText>
            </TouchableOpacity>
          </View>
          {step === 1 && <FirstStep />}
          {step === 2 && (
            <View>
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: neutral33,
                  marginTop: 24,
                  marginBottom: 24,
                }}
              />
              <BrandText style={[fontSemibold20]}>Payment Options</BrandText>
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value=""
                  color="#16BBFF"
                  uncheckedColor="#777777"
                  status={payment === "Tori" ? "checked" : "unchecked"}
                  onPress={() => setPayment("Tori")}
                />
                <BrandText style={[fontSemibold16, { marginLeft: 16 }]}>
                  Tori Wallet
                </BrandText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value=""
                  color="#16BBFF"
                  uncheckedColor="#777777"
                  status={payment === "Ethereum" ? "checked" : "unchecked"}
                  onPress={() => setPayment("Ethereum")}
                />
                <BrandText style={[fontSemibold16, { marginLeft: 16 }]}>
                  Ethereum Wallet
                </BrandText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value=""
                  color="#16BBFF"
                  uncheckedColor="#777777"
                  status={payment === "Solana" ? "checked" : "unchecked"}
                  onPress={() => setPayment("Solana")}
                />
                <BrandText style={[fontSemibold16, { marginLeft: 16 }]}>
                  Solana Wallet
                </BrandText>
              </View>
              <SecondaryButton
                text="Order"
                size="SM"
                fullWidth
                color={neutral00}
                backgroundColor={primaryColor}
                style={{ marginTop: 24, marginBottom: 20 }}
                onPress={async () => {
                  navigation.navigate("OrderDetails", { modal: "order" });
                }}
              />
            </View>
          )}
        </View>
        <FreelanceOrderModal
          visible={modalOrderVisible}
          onClose={() => {
            setModalOrderVisible(false);
            navigation.navigate("OrderDetails", { modal: "" });
          }}
          onEnter={submitData}
        />

        {step === 1 && <FirstRightCard />}
        {step === 2 && <SecondRightCard />}
      </View>
    </ScreenContainer>
  );
};

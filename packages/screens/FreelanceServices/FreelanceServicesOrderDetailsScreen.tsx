import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import { FreelanceScreenBase } from "./FreelanceScreenBase";
import { getGigData } from "./query/data";
import { BrandText } from "../../components/BrandText";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { FirstRightCard } from "../../components/freelanceServices/Order/FirstRightCard";
import { FirstStep } from "../../components/freelanceServices/Order/FirstStep";
import { OrderDetailsHeader } from "../../components/freelanceServices/Order/OrderDetailsHeader";
import { SecondRightCard } from "../../components/freelanceServices/Order/SecondRightCard";
import {
  GigInfo,
  GigData,
} from "../../components/freelanceServices/types/fields";
import { FreelanceOrderModal } from "../../components/modals/freelanceOrder/FreelanceOrderModal";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriOrderClient } from "../../contracts-clients/teritori-freelance/TeritoriOrder.client";
import { OrderParams } from "../../contracts-clients/teritori-freelance/TeritoriOrder.types";
import { useFetchGig } from "../../hooks/freelance/useFetchGig";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  mustGetCosmosNetwork,
  getKeplrSigningCosmWasmClient,
} from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral33, primaryColor } from "../../utils/style/colors";
import { fontSemibold16, fontSemibold20 } from "../../utils/style/fonts";
import { OrderStep } from "../../utils/types/freelance";
export type OrderModals = "Order";
const OrderPathMap = {
  Order: "order",
};

function SecondStep(props: {
  payment: string;
  onPress: () => void;
  onPress1: () => void;
  onPress2: () => void;
  onPress3: () => Promise<void>;
}) {
  return (
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
          status={props.payment === "TORI" ? "checked" : "unchecked"}
          onPress={props.onPress}
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
          status={props.payment === "ETH" ? "checked" : "unchecked"}
          onPress={props.onPress1}
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
          status={props.payment === "SOL" ? "checked" : "unchecked"}
          onPress={props.onPress2}
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
        onPress={props.onPress3}
      />
    </View>
  );
}

export const FreelanceServicesOrderDetailsScreen: ScreenFC<
  "FreelanceServicesOrder"
> = ({
  route: {
    params: { gigId, serviceLevelIndex, modal, name },
  },
}) => {
  const [gigData, setGigData] = useState<GigData | null>(null);
  const networkId = useSelectedNetworkId();
  const { data } = useFetchGig({ identifier: gigId });
  useEffect(() => {
    const setId = async () => {
      try {
        if (!data) return;
        setGigData(
          await getGigData(
            data.identifier,
            JSON.parse(data.metadata) as GigInfo,
            data.createdBy
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
    setId();
  }, [data]);

  const [extraSelection, setExtraSelection] = useState<Set<number>>(new Set());
  const wallet = useSelectedWallet();
  const navigation = useAppNavigation();
  const isKeplrConnected = useIsKeplrConnected();
  const { setToastError } = useFeedbacks();

  const [currentStep, setCurrentStep] = useState<OrderStep>(
    OrderStep.OrderDetails
  );
  const [step, setStep] = useState<OrderStep>(OrderStep.OrderDetails);

  const [payment, setPayment] = useState<"TORI" | "ETH" | "SOL">("TORI");

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
    if (modal) {
      handleModalChange(modal, name);
    }
  }, [modal, name]);

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
      const signingClient = await getKeplrSigningCosmWasmClient(networkId);
      const network = mustGetCosmosNetwork(networkId);
      const client = new TeritoriOrderClient(
        signingClient,
        wallet?.address!,
        network.freelanceEscrowAddress!
      );

      const cw20Addr = data.cw20Addr!;
      const amount = data.amount!; //need to change later.
      const receiver = data.seller!; //need to change later.
      const expireAt = data.expireAt!; // need to change later

      if (cw20Addr) {
        await client.createContractCw20({
          cw20Addr,
          amount,
          receiver,
          expireAt: parseInt(expireAt, 2),
        });
      } else {
        await client.createContract({
          amount,
          receiver,
          expireAt: parseInt(expireAt, 2),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const nextStep = async () => {
    if (currentStep === step) {
      setStep(step + 1);
    }
    setCurrentStep(currentStep + 1);
  };

  return (
    gigData && (
      <FreelanceScreenBase>
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
            <OrderDetailsHeader
              currentStep={currentStep}
              step={step}
              setCurrentStep={setCurrentStep}
            />
            {currentStep === OrderStep.OrderDetails && (
              <FirstStep
                gigData={gigData}
                serviceLevelIndex={serviceLevelIndex}
                selected={extraSelection}
                setSelected={setExtraSelection}
              />
            )}
            {currentStep === OrderStep.ConfirmPay && (
              <SecondStep
                payment={payment}
                onPress={() => setPayment("TORI")}
                onPress1={() => setPayment("ETH")}
                onPress2={() => setPayment("SOL")}
                onPress3={async () => {
                  navigation.navigate("FreelanceServicesOrder", {
                    gigId,
                    serviceLevelIndex,
                    modal: "order",
                  });
                }}
              />
            )}
          </View>
          <FreelanceOrderModal
            visible={modalOrderVisible}
            onClose={() => {
              setModalOrderVisible(false);
              navigation.navigate("FreelanceServicesOrder", {
                gigId,
                serviceLevelIndex,
              });
            }}
            onEnter={submitData}
          />

          {currentStep === OrderStep.OrderDetails && (
            <FirstRightCard
              serviceLevel={gigData.serviceLevels[serviceLevelIndex]}
              selected={extraSelection}
              nextStep={nextStep}
              step={currentStep}
            />
          )}
          {currentStep === OrderStep.ConfirmPay && (
            <SecondRightCard
              serviceLevel={gigData.serviceLevels[serviceLevelIndex]}
              selected={extraSelection}
              nextStep={nextStep}
              step={currentStep}
            />
          )}
        </View>
      </FreelanceScreenBase>
    )
  );
};

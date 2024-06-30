import {
  isDeliverTxFailure,
  MsgSendEncodeObject,
  StdFee,
} from "@cosmjs/stargate";
import React, { useState } from "react";
import { View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down-white.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import questionSVG from "../../../../assets/icons/question-gray.svg";
import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import MobileModal from "../components/MobileModal";
import MiniTable from "../components/Table/MiniTable";
import MiniTableRow from "../components/Table/MiniTableRow";
import TitleBar from "../components/TitleBar";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { Dropdown } from "@/components/Dropdown";
import { SVG } from "@/components/SVG";
import { TertiaryBadge } from "@/components/badges/TertiaryBadge";
import { CustomButton } from "@/components/buttons/CustomButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useGetAssets } from "@/hooks/wallet/useGetAssets";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { getCosmosNetwork, getStakingCurrency } from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import {
  neutral33,
  neutralA3,
  secondaryColor,
  withAlpha,
} from "@/utils/style/colors";
import { fontMedium16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { getNativeSigner } from "@/utils/wallet/getNativeSigner";

const getTxData = (denom: string, amount: string, userId: string) => {
  const networkId = "teritori"; // networkId placeholder
  const prettyAmount = prettyPrice(networkId, amount, denom);

  return [
    {
      label: "Token",
      value: <CurrencyIcon networkId={networkId} denom={denom} size={28} />,
      icon: "link",
    },
    {
      label: "Amount",
      value: prettyAmount,
    },
    {
      label: "Expiration",
      value: "157843252",
    },
    {
      label: "Nonce",
      value: "0",
    },
    {
      label: "Network",
      value: <TertiaryBadge iconSVG={teritoriSVG} label="Teritori" />,
    },
    {
      label: (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <UsernameWithAvatar userId={userId} />
          <SpacerRow size={1} />
          <BrandText style={[fontMedium16, { color: neutralA3 }]}>
            ninja.tori
          </BrandText>
        </View>
      ),
      value: "GxF34...3A31",
    },
  ];
};

const SendingToriScreen: ScreenFC<"MiniSendingTori"> = ({
  navigation,
  route,
}) => {
  const { denom, address, amount } = route.params;
  const [openModal, setOpenModal] = useState(false);

  const goBackTo = () =>
    navigation.replace("MiniSendTori", {
      back: "MiniSendingTori",
      denom,
    });
  const selectedWallet = useSelectedNativeWallet();

  const assets = useGetAssets(
    selectedWallet?.networkId,
    selectedWallet?.address,
  );
  const selectedToken = assets.find((asset) => asset.denom === denom);
  if (!selectedToken) {
    return null;
  }
  const cosmosMsg: MsgSendEncodeObject = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      fromAddress: selectedWallet?.address,
      toAddress: address,
      amount: [{ amount, denom }],
    },
  };
  return (
    <BlurScreenContainer
      title={`Sending ${selectedToken.symbol}`}
      onGoBack={goBackTo}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
          justifyContent: "space-between",
        }}
      >
        <View>
          <SpacerColumn size={3} />
          <MiniTableRow
            leftLabel={
              <SVG
                source={selectedToken?.logo_URIs?.svg || questionSVG}
                width={28}
                height={28}
              />
            }
            rightLabel={prettyPrice(selectedToken.networkId, amount, denom)}
          />

          <SpacerColumn size={2} />

          <Dropdown
            positionStyle={{ width: "100%", top: 45 }}
            triggerComponent={
              <View style={{ alignItems: "center" }}>
                <SVG source={chevronDownSVG} width={28} height={28} />
              </View>
            }
          >
            <View style={{ flex: 1 }}>
              <MiniTableRow
                leftLabel={address}
                leftLabelStyle={{ color: secondaryColor }}
              />
              <SpacerColumn size={1.5} />
              <MiniTableRow
                leftLabel="Network Fee"
                rightLabel="0.0000001 TORI"
                rightLabelStyle={fontMedium16}
              />
            </View>
          </Dropdown>
        </View>

        <SendingModal
          visible={openModal}
          onClose={() => setOpenModal(false)}
          txData={getTxData(denom, amount, `tori-${address}`)}
          msg={cosmosMsg}
        />

        <CustomButton title="Send" onPress={() => setOpenModal(true)} />
      </View>
    </BlurScreenContainer>
  );
};

export default SendingToriScreen;

type SendingModalProps = {
  visible: boolean;
  txData: any;
  msg: MsgSendEncodeObject;
  onClose: () => void;
};

function SendingModal({ visible, onClose, txData, msg }: SendingModalProps) {
  const feedbacks = useFeedbacks();
  const navigation = useAppNavigation();
  const [isInProcess, setIsInProcess] = useState(false);
  const selectedWallet = useSelectedNativeWallet();
  const cosmosNetwork = getCosmosNetwork(selectedWallet?.networkId);
  if (!cosmosNetwork) {
    throw new Error("User's network is not a Cosmos network");
  }
  const stakingCurrency = getStakingCurrency(selectedWallet?.networkId);
  if (!stakingCurrency) {
    throw new Error("Staking currency not found");
  }

  return (
    <MobileModal visible={visible} onClose={onClose}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
          paddingVertical: layout.spacing_x3,
          justifyContent: "space-between",
        }}
      >
        <View>
          <TitleBar
            title="Signature request"
            icon={teritoriCircleSVG}
            subTitle="Be careful this message may transfer assets"
          />
          <SpacerColumn size={3} />
          <MiniTable
            items={txData}
            colorOptions={{ tableColor: withAlpha(neutral33, 0.8) }}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <CustomButton
            type="gray"
            title="Cancel"
            onPress={() =>
              navigation.navigate("MiniTabs", { screen: "MiniWallets" })
            }
            style={{ flex: 1 }}
          />
          <CustomButton
            title={isInProcess ? "Sending" : "Sign"}
            isDisabled={isInProcess}
            onPress={async () => {
              setIsInProcess(true);
              if (selectedWallet === undefined) return;
              const client = await getNativeSigner(selectedWallet);
              if (!client) {
                feedbacks.setToast({
                  message: "Error: Wallet not found",
                  duration: 5000,
                  mode: "mini",
                  type: "error",
                });
                setIsInProcess(false);
                return;
              }

              try {
                const simulation = await client.simulate(
                  selectedWallet.address,
                  [msg],
                  "",
                );

                const gasEstimate =
                  simulation < 200000 ? 200000 : simulation * 1.3;
                const fee: StdFee = {
                  gas: gasEstimate.toFixed(0),
                  amount: [
                    {
                      amount: (
                        gasEstimate * cosmosNetwork.gasPriceStep.average
                      ).toFixed(0),
                      denom: stakingCurrency.denom,
                    },
                  ],
                };
                const txResponse = await client.signAndBroadcast(
                  selectedWallet.address,
                  [msg],
                  fee,
                  "",
                );
                if (isDeliverTxFailure(txResponse)) {
                  feedbacks.setToast({
                    message: `Transaction failed: ${txResponse.rawLog}}`,
                    duration: 5000,
                    mode: "mini",
                    type: "error",
                  });
                  setIsInProcess(false);
                  return;
                }
                feedbacks.setToast({
                  message: `Transaction sent ${txResponse.transactionHash}`,
                  duration: 5000,
                  mode: "mini",
                  type: "success",
                });
                navigation.navigate("MiniTabs", { screen: "MiniWallets" });
              } catch (e: any) {
                feedbacks.setToast({
                  message: `Error: ${e.message}`,
                  duration: 5000,
                  mode: "mini",
                  type: "error",
                });
                console.error(e);
                setIsInProcess(false);
              }
            }}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </MobileModal>
  );
}

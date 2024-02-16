import {
  isDeliverTxFailure,
  MsgSendEncodeObject,
  StdFee,
} from "@cosmjs/stargate";
import { cosmos } from "osmojs";
import { TxRaw } from "osmojs/dist/codegen/cosmos/tx/v1beta1/tx";
import React, { useState } from "react";
import { View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down-white.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import questionSVG from "../../../../assets/icons/question-gray.svg";
import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import { CustomButton } from "../components/Button/CustomButton";
import MobileModal from "../components/MobileModal";
import MiniTable from "../components/Table/MiniTable";
import MiniTableRow from "../components/Table/MiniTableRow";
import TitleBar from "../components/TitleBar";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { Dropdown } from "@/components/Dropdown";
import { SVG } from "@/components/SVG";
import { UserNameInline } from "@/components/UserNameInline";
import { TertiaryBadge } from "@/components/badges/TertiaryBadge";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { getNativeSigner } from "@/hooks/wallet/getNativeSigner";
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

const getTxData = (denom: string, amount: string, userId: string) => {
  const networkId = "teritori"; // networkId placeholder
  const prettyAmount = prettyPrice(networkId, amount, denom);

  return [
    {
      label: "Token",
      value: <CurrencyIcon networkId={networkId} denom={denom} size={28} />,
      icon: "link",
      onPress: () => alert("Token"),
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
          <UserNameInline userId={userId} />
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
            onPress={() => navigation.navigate("MiniTabs")}
            style={{ flex: 1 }}
          />
          <CustomButton
            title={isInProcess ? "Sending" : "Sign"}
            isDisabled={isInProcess}
            onPress={async () => {
              let signed: TxRaw;

              if (selectedWallet === undefined) return;
              const client = await getNativeSigner(selectedWallet);
              if (client === undefined) return;

              try {
                const gasEstimate =
                  (await client.simulate(selectedWallet.address, [msg], "")) *
                  1.3; // 30% buffer
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
                signed = await client.sign(
                  selectedWallet.address,
                  [msg],
                  fee,
                  "",
                );
                const txRaw = cosmos.tx.v1beta1.TxRaw;
                const txResponse = await client.broadcastTx(
                  Uint8Array.from(txRaw.encode(signed).finish()),
                );
                if (isDeliverTxFailure(txResponse)) {
                  throw new Error(txResponse.rawLog);
                }
                setIsInProcess(true);
                navigation.navigate("MiniTabs");
              } catch (e: any) {
                console.error(e);
              }
            }}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </MobileModal>
  );
}

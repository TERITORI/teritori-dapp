import React, { useState } from "react";
import { View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down-white.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import questionSVG from "../../../../assets/icons/question-gray.svg";
import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { CurrencyIcon } from "../../../components/CurrencyIcon";
import { Dropdown } from "../../../components/Dropdown";
import { SVG } from "../../../components/SVG";
import { TertiaryBadge } from "../../../components/badges/TertiaryBadge";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { prettyPrice } from "../../../utils/coins";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import {
  neutral33,
  neutralA3,
  secondaryColor,
  withAlpha,
} from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { useGetAssets } from "../../Wallet/util/chain-registry";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import { CustomButton } from "../components/Button/CustomButton";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import MobileModal from "../components/MobileModal";
import RowDisplay from "../components/RowDisplay";
import MiniTable from "../components/Table/MiniTable";
import TitleBar from "../components/TitleBar";

const getTxData = (denom: string, amount: string) => {
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
          <CircularImgOrIcon
            size={32}
            enableFullIcon
            style={{ alignItems: "center", justifyContent: "center" }}
            icon={require("../../../../assets/default-images/profile.png")}
          />
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
  const assets = useGetAssets(
    "teritori",
    "tori1lkydvh2qae4gqdslmwaxrje7j57p2kq8dw9d7t",
  );
  const selectedToken = assets.find((asset) => asset.denom === denom);
  if (!selectedToken) {
    return null;
  }
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
          <RowDisplay
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
              <RowDisplay
                leftLabel={address}
                leftLabelStyle={{ color: secondaryColor }}
              />
              <SpacerColumn size={1.5} />
              <RowDisplay
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
          txData={getTxData(denom, amount)}
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
  onClose: () => void;
};

function SendingModal({ visible, onClose, txData }: SendingModalProps) {
  const navigation = useAppNavigation();

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
            title="Sign"
            onPress={() => navigation.navigate("MiniTabs")}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </MobileModal>
  );
}

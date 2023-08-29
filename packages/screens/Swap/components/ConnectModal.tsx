import React, { Suspense } from "react";
import { StyleSheet, View, Image, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import osmosisIllustration from "../../../../assets/osmosis-illustration.png";
import { BrandText } from "../../../components/BrandText";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { selectAreTestnetsEnabled } from "../../../store/slices/settings";
import {
  neutral00,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type ConnectModalProps = {
  onClose: () => void;
  onPressConnect: () => void;
  onPressConnectTestnet: () => void;
  visible: boolean;
};

export const ConnectModal: React.FC<ConnectModalProps> = ({
  visible,
  onPressConnect,
  onPressConnectTestnet,
  onClose,
}) => {
  const testnetsEnabled = useSelector(selectAreTestnetsEnabled);
  const ModalHeader = React.lazy(() =>
    import("./SwapView").then((module) => ({ default: module.SwapHeader }))
  );

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      Header={() => (
        <Suspense fallback={<></>}>
          <ModalHeader />
        </Suspense>
      )}
      width={456}
    >
      <View style={modalChildrenStyle}>
        <Image
          source={osmosisIllustration}
          style={{
            height: 200,
            width: 160,
          }}
        />

        <BrandText style={textStyle}>
          This SWAP Feature is developed by OSMOSIS core team. By using this
          Decentralized Protocol, you accept all risks & rules associated to the
          <BrandText style={textWhiteStyle}>
            {" "}
            OSMOSIS Protocol Disclaimer.
          </BrandText>
        </BrandText>

        <SecondaryButton
          size="XL"
          text="Connect to OSMOSIS"
          backgroundColor={secondaryColor}
          color={neutral00}
          fullWidth
          onPress={onPressConnect}
        />
        {testnetsEnabled && (
          <>
            <SpacerColumn size={2} />
            <SecondaryButton
              size="XL"
              text="Connect to OSMOSIS Testnet"
              backgroundColor={secondaryColor}
              color={neutral00}
              fullWidth
              onPress={onPressConnectTestnet}
            />
          </>
        )}
      </View>
    </ModalBase>
  );
};

const modalChildrenStyle: ViewStyle = {
  alignItems: "center",
  paddingBottom: layout.padding_x2_5,
};
const textStyle: ViewStyle = {
  color: neutral77,
  maxWidth: 371,
  marginBottom: layout.padding_x2_5,
  marginTop: layout.padding_x4,
  ...StyleSheet.flatten(fontSemibold14),
};
const textWhiteStyle: ViewStyle = {
  color: secondaryColor,
  ...StyleSheet.flatten(fontSemibold14),
};

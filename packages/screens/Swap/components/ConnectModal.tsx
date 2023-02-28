import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import osmosisIllustration from "../../../../assets/osmosis-illustration.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
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
import { ModalHeader } from "./SwapModal";

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

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      Header={() => <ModalHeader />}
      width={456}
    >
      <View style={styles.modalChildren}>
        <SVG source={osmosisIllustration} height={200} width={160} />

        <BrandText style={styles.text}>
          This SWAP Feature is developed by OSMOSIS core team. By using this
          Decentralized Protocol, you accept all risks & rules associated to the
          <BrandText style={styles.textWhite}>
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

const styles = StyleSheet.create({
  modalHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalHeaderTitle: {
    marginLeft: layout.padding_x2,
  },
  modalChildren: {
    alignItems: "center",
    paddingBottom: layout.padding_x2_5,
  },
  text: {
    color: neutral77,
    maxWidth: 371,
    marginBottom: layout.padding_x2_5,
    marginTop: layout.padding_x4,
    ...StyleSheet.flatten(fontSemibold14),
  },
  textWhite: {
    color: secondaryColor,
    ...StyleSheet.flatten(fontSemibold14),
  },
});

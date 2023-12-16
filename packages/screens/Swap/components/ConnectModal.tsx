import React, { Suspense } from "react";
import { StyleSheet, View, Image } from "react-native";
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
    import("./SwapView/SwapHeader").then((module) => ({
      default: module.SwapHeader,
    })),
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
      <View style={styles.modalChildren}>
        <Image
          source={osmosisIllustration}
          style={{
            height: 200,
            width: 160,
          }}
        />

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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  modalHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalHeaderTitle: {
    marginLeft: layout.spacing_x2,
  },
  modalChildren: {
    alignItems: "center",
    paddingBottom: layout.spacing_x2_5,
  },
  text: {
    color: neutral77,
    maxWidth: 371,
    marginBottom: layout.spacing_x2_5,
    marginTop: layout.spacing_x4,
    ...StyleSheet.flatten(fontSemibold14),
  },
  textWhite: {
    color: secondaryColor,
    ...StyleSheet.flatten(fontSemibold14),
  },
});

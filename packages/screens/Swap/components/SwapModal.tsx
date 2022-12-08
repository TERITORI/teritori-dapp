import { StyleSheet, View } from "react-native";

import chevronCircleDown from "../../../../assets/icons/chevron-circle-down.svg";
import chevronCircleUp from "../../../../assets/icons/chevron-circle-up.svg";
import osmosisLogo from "../../../../assets/icons/networks/osmosis.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import {
  neutral77,
  neutralA3,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CurrencySelector } from "./CurrencySelector";
import {NetworkInfo} from "../../../networks";
import {Balance} from "../../../utils/coins";

type SwapModalProps = {
  onClose: () => void;
  visible: boolean;
  selectedNetwork: NetworkInfo;
  balances:  Balance[];
};

export const ModalHeader: React.FC = () => {
  return (
    <View style={styles.modalHeaderContainer}>
      <SVG source={osmosisLogo} height={32} width={32} />
      <BrandText style={styles.modalHeaderTitle}>Swap on OSMOSIS</BrandText>
    </View>
  );
};

export const SwapModal: React.FC<SwapModalProps> = ({ onClose, visible, selectedNetwork, balances }) => {

  console.log('selectedNetworkselectedNetworkselectedNetworkselectedNetwork', selectedNetwork)
  console.log('balancesbalancesbalancesbalancesbalances', balances)

  const onPressInvert = () => {
    // TODO:
  };

  return (
    <ModalBase
      Header={ModalHeader}
      width={456}
      visible={visible}
      onClose={onClose}
    >
      <View style={styles.modalChildren}>
        {/*======= First currency */}
        <TertiaryBox
          fullWidth
          mainContainerStyle={styles.tertiaryBoxMainContainer}
          style={{ zIndex: 15 }}
        >
          <View style={styles.counts}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Available{" "}
              <BrandText style={{ color: primaryColor }}> 0</BrandText>
            </BrandText>
            <View style={{ flexDirection: "row" }}>
              <SecondaryButton size="XS" text="MAX" />
              <SecondaryButton
                size="XS"
                text="HALF"
                touchableStyle={{ marginLeft: layout.padding_x1 }}
              />
            </View>
          </View>
          <View style={styles.currency}>
            <CurrencySelector />
            <BrandText style={{ color: neutralA3 }}>0</BrandText>
          </View>
        </TertiaryBox>

        <SpacerColumn size={1.5} />

        {/*======= Second currency */}
        <TertiaryBox
          fullWidth
          mainContainerStyle={styles.tertiaryBoxMainContainer}
          style={{ zIndex: 10 }}
        >
          <View style={styles.currency}>
            <CurrencySelector />
            <BrandText style={{ color: neutralA3 }}>0</BrandText>
          </View>
        </TertiaryBox>

        {/*======= Invert button */}
        <CustomPressable onPress={onPressInvert} style={styles.invertButton}>
          {({ hovered }) => (
            <SVG
              source={hovered ? chevronCircleDown : chevronCircleUp}
              height={32}
              width={32}
            />
          )}
        </CustomPressable>

        <SpacerColumn size={2.5} />

        <PrimaryButton size="XL" text="Swap" fullWidth />
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  tertiaryBoxMainContainer: {
    padding: layout.padding_x2,
  },
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
  },
  counts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  currency: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  invertButton: {
    position: "absolute",
    zIndex: 20,
    top: 108,
  },
});

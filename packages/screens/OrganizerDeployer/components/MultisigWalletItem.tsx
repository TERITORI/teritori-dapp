import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, TextStyle, View } from "react-native";

import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import toriLogoSVG from "../../../../assets/icons/networks/teritori-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { MULTISIG_WALLET_HEADING } from "../MultisigWalletManageScreen";
import { MultiSigWallet } from "../types";
import { MultisigWalletItemMenu } from "./MultisigWalletItemMenu";

interface MultisigWalletItemProps {
  data: MultiSigWallet;
  onPress?: () => void;
  labelStyle?: TextStyle;
}

export const MultisigWalletItem: React.FC<MultisigWalletItemProps> = ({
  data,
  onPress,
}) => {
  // variables
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  // functions
  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
  const onAlertTodo = () => alert("TODO");

  // returns
  const renderAssetType = useCallback(
    () => (
      <View style={styles.rowCenter}>
        <SVG source={toriLogoSVG} width={24} height={24} />
        <SpacerRow size={1} />
        <BrandText style={fontSemibold14}>
          Tertiori ({data.asset_type})
        </BrandText>
      </View>
    ),
    []
  );

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.valueContainer,
          { flex: MULTISIG_WALLET_HEADING.id.flex },
        ]}
      >
        <BrandText style={styles.valueText}>{data.id}</BrandText>
      </View>
      <View
        style={[
          styles.valueContainer,
          { flex: MULTISIG_WALLET_HEADING.name.flex },
        ]}
      >
        <BrandText style={styles.valueText}>{data.name}</BrandText>
      </View>
      <View
        style={[
          styles.valueContainer,
          { flex: MULTISIG_WALLET_HEADING.asset_type.flex },
        ]}
      >
        {renderAssetType()}
      </View>
      <View
        style={[
          styles.valueContainer,
          { flex: MULTISIG_WALLET_HEADING.approval_required.flex },
        ]}
      >
        <BrandText style={styles.valueText}>
          {data.approval} approvals
        </BrandText>
        <SpacerRow size={0.5} />
        <BrandText style={styles.valueText2}>of</BrandText>
        <SpacerRow size={0.5} />
        <BrandText style={styles.valueText}>
          {data.participants} participants
        </BrandText>
      </View>
      <View
        style={[
          styles.actionsContainer,
          { flex: MULTISIG_WALLET_HEADING.actions.flex },
        ]}
      >
        <MultisigWalletItemMenu
          isVisible={isMenuVisible}
          onToggleMenu={toggleMenu}
          onDeleteWalletPress={onAlertTodo}
          onParticipantsPress={onAlertTodo}
          onInvitePress={onAlertTodo}
          onTransactionPress={onAlertTodo}
        />
        <SpacerRow size={2} />
        <SVG source={chevronRightSVG} width={16} height={16} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderColor: neutral33,
    borderBottomWidth: 1,
    paddingVertical: layout.padding_x2,
    paddingLeft: layout.padding_x2_5,
  },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  valueContainer: {
    paddingRight: layout.padding_x1,
    flexDirection: "row",
    alignItems: "center",
  },
  actionsContainer: {
    paddingRight: layout.padding_x1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  valueText: {
    ...StyleSheet.flatten(fontSemibold14),
    color: secondaryColor,
  },
  valueText2: {
    ...StyleSheet.flatten(fontSemibold14),
    color: neutralA3,
  },
});

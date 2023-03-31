import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

import dotCircleSVG from "../../../../assets/icons/dots-circle.svg";
import inviteSVG from "../../../../assets/icons/invite.svg";
import participantsSVG from "../../../../assets/icons/participants.svg";
import transactionSVG from "../../../../assets/icons/transaction.svg";
import trashSVG from "../../../../assets/icons/trash.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import {
  errorColor,
  neutralA3,
  secondaryColor,
  transparentColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface MultisigWalletItemMenuProps {
  isVisible: boolean;
  onToggleMenu: () => void;
  onTransactionPress: () => void;
  onParticipantsPress: () => void;
  onInvitePress: () => void;
  onDeleteWalletPress: () => void;
}

export const MultisigWalletItemMenu: React.FC<MultisigWalletItemMenuProps> = ({
  isVisible,
  onToggleMenu,
  onTransactionPress,
  onParticipantsPress,
  onInvitePress,
  onDeleteWalletPress,
}) => {
  return (
    <Menu opened={isVisible} onBackdropPress={onToggleMenu}>
      <MenuTrigger onPress={onToggleMenu}>
        <View
          style={[
            styles.dotCircle,
            { borderColor: isVisible ? secondaryColor : transparentColor },
          ]}
        >
          <SVG source={dotCircleSVG} width={32} height={32} />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionWrapper: {
            paddingVertical: 0,
            paddingTop: layout.padding_x1_5,
          },
          optionsContainer: {
            marginTop: 44,
          },
        }}
        optionsContainerStyle={styles.menu}
      >
        <MenuOption
          style={styles.menuOption}
          onSelect={() => {
            onToggleMenu();
            onTransactionPress();
          }}
        >
          <SVG source={transactionSVG} width={16} height={16} />
          <SpacerRow size={1} />
          <BrandText style={styles.menuOptionText}>View Transactions</BrandText>
        </MenuOption>

        <View style={styles.menuDivider} />

        <MenuOption
          style={styles.menuOption}
          onSelect={() => {
            onToggleMenu();
            onParticipantsPress();
          }}
        >
          <SVG source={participantsSVG} width={16} height={16} />
          <SpacerRow size={1} />
          <BrandText style={styles.menuOptionText}>Participants List</BrandText>
        </MenuOption>

        <MenuOption
          style={styles.menuOption}
          onSelect={() => {
            onToggleMenu();
            onInvitePress();
          }}
        >
          <SVG source={inviteSVG} width={16} height={16} />
          <SpacerRow size={1} />
          <BrandText style={styles.menuOptionText}>
            Invite Participant
          </BrandText>
        </MenuOption>

        <View style={styles.menuDivider} />

        <MenuOption
          style={styles.menuOption}
          onSelect={() => {
            onToggleMenu();
            onDeleteWalletPress();
          }}
        >
          <SVG source={trashSVG} width={16} height={16} />
          <SpacerRow size={1} />
          <BrandText style={[styles.menuOptionText, { color: errorColor }]}>
            Delete Wallet
          </BrandText>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};
const styles = StyleSheet.create({
  dotCircle: { width: 34, height: 34, borderRadius: 34 / 2, borderWidth: 1.5 },
  menu: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    borderRadius: 12,
    padding: layout.padding_x1_5,
    paddingTop: 0,
    top: 0,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuOptionText: StyleSheet.flatten([
    fontSemibold13,
    {
      color: neutralA3,
    },
  ]),
  menuDivider: {
    height: 1,
    width: "100%",
    alignSelf: "center",
    backgroundColor: secondaryColor,
    opacity: 0.12,
    marginTop: layout.padding_x1_5,
  },
});

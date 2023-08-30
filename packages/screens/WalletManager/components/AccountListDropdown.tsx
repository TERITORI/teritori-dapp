import React, { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import infoSVG from "../../../../assets/icons/info.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useDropdowns } from "../../../context/DropdownsProvider";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { TransactionAccount } from "../types";

type AccountListDropdownProps = {
  variation: "right" | "left";
  accounts: TransactionAccount[];
  onSelect: (selectedAccount: TransactionAccount) => void;
};

export const AccountListDropdown: React.FC<AccountListDropdownProps> = ({
  variation,
  accounts,
  onSelect,
}) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  // functions
  const onPress = (selectedAccount: TransactionAccount) => {
    closeOpenedDropdown();
    onSelect(selectedAccount);
  };

  return (
    <View ref={dropdownRef} style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => onPressDropdownButton(dropdownRef)}
      >
        <SVG
          source={chevronDownSVG}
          width={layout.iconButton / 2}
          height={layout.iconButton / 2}
          color={secondaryColor}
        />
      </Pressable>
      {isDropdownOpen(dropdownRef) && (
        <View
          style={[
            styles.networkContainer,
            variation === "left" && { left: 0, right: undefined },
          ]}
        >
          <View style={styles.rowCenter}>
            <BrandText style={fontSemibold16}>Choose Network</BrandText>
          </View>
          <SpacerColumn size={1} />
          <View style={styles.rowCenter}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              IBC Transfers
            </BrandText>
            <SpacerRow size={1} />
            <SVG source={infoSVG} width={16} height={16} />
          </View>
          <SpacerColumn size={2} />

          {accounts.map((acc, index) => (
            <View key={acc.account} style={{ width: "100%" }}>
              <Pressable onPress={() => onPress(acc)}>
                <View style={styles.rowCenter}>
                  <SVG source={acc.icon} width={48} height={48} />
                  <SpacerRow size={1.5} />
                  <View>
                    <View style={styles.rowCenter}>
                      <BrandText style={fontSemibold20}>{acc.name}</BrandText>
                      <SpacerRow size={1.5} />
                    </View>
                    <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                      {acc.subtitle}
                    </BrandText>
                  </View>
                </View>
              </Pressable>
              {index !== accounts.length - 1 && <SpacerColumn size={1} />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 2,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  button: {
    backgroundColor: neutral22,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: layout.iconButton / 2,
    justifyContent: "center",
    alignItems: "center",
    height: layout.iconButton,
    width: layout.iconButton,
  },
  infoText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
  networkContainer: {
    position: "absolute",
    zIndex: 2,
    top: layout.iconButton + layout.padding_x0_5,
    backgroundColor: neutral00,
    padding: layout.padding_x2_5,
    borderColor: neutral33,
    borderWidth: 1,
    borderRadius: 12,
    right: 0,
  },
});

import React from "react";
import { StyleSheet, View } from "react-native";

import gameBoxSVG from "../../../../assets/icons/game-box.svg";
import { ConnectWalletButton } from "../../../components/ConnectWalletButton";
import { NetworkSelector } from "../../../components/NetworkSelector";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../../components/buttons/SecondaryButtonOutline";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  primaryTextColor,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  headerHeight,
  headerMarginHorizontal,
} from "../../../utils/style/layout";

export const RiotGameHeader = () => {
  return (
    <View style={styles.container}>
      <SecondaryButtonOutline
        text="Rarity"
        size="M"
        iconColor={secondaryColor}
        iconSVG={gameBoxSVG}
      />
      <SpacerRow size={1.5} />
      <PrimaryButton
        text="Guardians"
        size="M"
        iconColor={primaryTextColor}
        iconSVG={gameBoxSVG}
      />
      <SpacerRow size={1.5} />
      <Separator horizontal color={neutral33} />
      <SpacerRow size={1.5} />
      <NetworkSelector />
      <SpacerRow size={1.5} />
      <ConnectWalletButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: headerHeight,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: neutral33,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: headerMarginHorizontal,
  },
});

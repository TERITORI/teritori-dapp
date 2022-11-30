import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../../components/spacer";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral33, neutral55 } from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const RightSection = () => {
  // variables
  const navigation = useAppNavigation();

  // returns
  return (
    <View style={styles.container}>
      <SpacerColumn size={5} />
      <BrandText style={[fontSemibold12, { color: neutral55 }]}>
        ACTIONS
      </BrandText>

      <SpacerColumn size={2} />
      <PrimaryButton
        size="M"
        text="Create Transaction"
        fullWidth
        onPress={() => navigation.navigate("MultisigCreateTransaction")}
      />

      <SpacerColumn size={2.5} />
      <PrimaryButton
        size="M"
        text="Create Delegation"
        fullWidth
        onPress={() => navigation.navigate("MultisigDelegate")}
      />

      <SpacerColumn size={2.5} />
      <PrimaryButton size="M" text="Buy a TNS Account" fullWidth />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: "100%",
    borderLeftWidth: 1,
    borderColor: neutral33,
    padding: layout.padding_x2_5,
  },
});

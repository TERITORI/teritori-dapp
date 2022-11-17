import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../../components/spacer";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const LaunchingOrganizationSection: React.FC<{
  isLaunched: boolean;
}> = ({ isLaunched }) => {
  return (
    <View style={styles.container}>
      <BrandText style={fontSemibold28}>
        {isLaunched ? "All done" : "Launch organization"}
      </BrandText>
      {isLaunched && (
        <>
          <SpacerColumn size={1.5} />
          <BrandText style={[fontSemibold20, { color: neutralA3 }]}>
            Your organization is ready!
          </BrandText>
          <SpacerColumn size={3} />
          <PrimaryButton size="M" text="Get Started" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingRight: layout.padding_x2_5,
  },
});

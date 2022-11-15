import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { neutral33 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { CreateDAOSection } from "./components/CreateDAOSection";
import { RightSection } from "./components/RightSection";

const STEPS = [
  "Create a DAO",
  "Configure voting",
  "Set tokens",
  "Review information",
  "Launch organization",
  "Add dApps to the TORG",
];

export const OrganizerDeployerScreen = () => {
  // variables
  const [currentStep, setCurrentStep] = useState(0);

  // returns
  return (
    <ScreenContainer footerChildren={<></>} noMargin fullWidth noScroll>
      <View style={styles.row}>
        <View style={styles.fill}>
          <ScrollView>
            <CreateDAOSection />
          </ScrollView>
          <View style={styles.footer}>
            <PrimaryButton size="M" text={`Next: ${STEPS[currentStep + 1]}`} />
          </View>
        </View>

        <RightSection steps={STEPS} currentStep={currentStep} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", flex: 1 },
  fill: { flex: 1 },
  footer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: layout.padding_x1_5,
    paddingHorizontal: layout.padding_x2_5,
    borderTopWidth: 1,
    borderColor: neutral33,
  },
});

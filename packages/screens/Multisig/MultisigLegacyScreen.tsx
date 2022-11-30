import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn } from "../../components/spacer";
import { patternOnlyNumbers, validateAddress } from "../../utils/formRules";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { MultisigFormInput } from "./components/MultisigFormInput";
import { MultisigSection } from "./components/MultisigSection";
import { RightSection } from "./components/RightSection";
import { MultisigLegacyFormType } from "./types";

const defaultValues: MultisigLegacyFormType = {
  receiptAddress: "bc1qu5ujlp9dkvtgl98jakvw9ggj9uwyk79qhvwvrg",
  membersAddress: [
    { address: "bc1qu5ujlp9dkvtgl98jakvw9ggj9uwyk79qhvwvrg" },
    { address: "bc1qu5ujlp9dkvtgl98jakvw9ggj9uwyk79qhvwvrg" },
    { address: "bc1qu5ujlp9dkvtgl98jakvw9ggj9uwyk79qhvwvrg" },
  ],
  assets: "400",
};

export const MultisigLegacyScreen = () => {
  // variables
  const { control } = useForm<MultisigLegacyFormType>({
    defaultValues,
  });

  // returns
  return (
    <ScreenContainer
      headerChildren={<BackTo label="Multisig Wallet" />}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
    >
      <View style={styles.row}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <BrandText style={fontSemibold28}>Multisig Legacy Multisig</BrandText>
          <SpacerColumn size={2.5} />
          <MultisigSection title="Multisig Address">
            <MultisigFormInput<MultisigLegacyFormType>
              control={control}
              label="Recipient address"
              isAsterickSign
              name="receiptAddress"
              rules={{ required: true, validate: validateAddress }}
              isCopiable
            />
          </MultisigSection>

          <MultisigSection
            title="Members Addresses"
            tresholdCurrentCount={2}
            tresholdMax={3}
          >
            {defaultValues.membersAddress.map((_, index) => (
              <View>
                <MultisigFormInput<MultisigLegacyFormType>
                  control={control}
                  label={"Address #" + (index + 1)}
                  isAsterickSign
                  name={`membersAddress.${index}.address`}
                  rules={{ required: true, validate: validateAddress }}
                  isCopiable
                />
                {index !== defaultValues.membersAddress.length - 1 && (
                  <SpacerColumn size={2.5} />
                )}
              </View>
            ))}
          </MultisigSection>

          <MultisigSection title="Holdings & Assets">
            <MultisigFormInput<MultisigLegacyFormType>
              control={control}
              label="Assets"
              isAsterickSign
              name="assets"
              rules={{ required: true, pattern: patternOnlyNumbers }}
              isAmount
            />
          </MultisigSection>
        </ScrollView>

        <RightSection />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", flex: 1 },
  container: {
    padding: layout.contentPadding,
    paddingTop: layout.topContentPaddingWithHeading,
    maxWidth: 800,
  },
});

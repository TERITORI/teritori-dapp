import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import arrowSVG from "../../../../assets/icons/arrow-with-tail.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../../components/spacer";
import { patternOnlyNumbers, validateAddress } from "../../../utils/formRules";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { MultisigTransactionDelegateFormType } from "../types";
import { MultisigFormInput } from "./MultisigFormInput";
import { MultisigSection } from "./MultisigSection";

const defaultValues = {
  multisigAddress: "bc1qu5ujlp9dkvtgl98jakvw9ggj9uwyk79qhvwvrg",
  membersAddress: [
    { address: "bc1qu5ujlp9dkvtgl98jakvw9ggj9uwyk79qhvwvrg" },
    { address: "bc1qu5ujlp9dkvtgl98jakvw9ggj9uwyk79qhvwvrg" },
    { address: "bc1qu5ujlp9dkvtgl98jakvw9ggj9uwyk79qhvwvrg" },
  ],
};

interface MultisigTranscationDelegateFormProps {
  title: string;
  transferText: string;
  submitBtnText: string;
  isDisabled?: boolean;
  onSubmit?: (formValues: MultisigTransactionDelegateFormType) => void;
}

export const MultisigTranscationDelegateForm: React.FC<
  MultisigTranscationDelegateFormProps
> = ({
  title,
  isDisabled,
  transferText,
  submitBtnText,
  onSubmit = () => {},
}) => {
  // variables
  const { control, handleSubmit } =
    useForm<MultisigTransactionDelegateFormType>({
      defaultValues,
    });

  // returns
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BrandText style={fontSemibold28}>{title}</BrandText>
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <SpacerColumn size={2.5} />
          <MultisigSection title="Multisig Address">
            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label=""
              hideLabel
              isAsterickSign
              name="multisigAddress"
              rules={{ required: true, validate: validateAddress }}
            />
          </MultisigSection>

          <MultisigSection
            title="Multisig Wallet Members"
            tresholdCurrentCount={2}
            tresholdMax={3}
          >
            {defaultValues.membersAddress.map((_, index) => (
              <View>
                <MultisigFormInput<MultisigTransactionDelegateFormType>
                  control={control}
                  label={"Address #" + (index + 1)}
                  isAsterickSign
                  name={`membersAddress.${index}.address`}
                  rules={{ required: true, validate: validateAddress }}
                />
                {index !== defaultValues.membersAddress.length - 1 && (
                  <SpacerColumn size={2.5} />
                )}
              </View>
            ))}
          </MultisigSection>
        </View>

        <View style={styles.centerSection}>
          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            {transferText}
          </BrandText>
          <SpacerColumn size={0.75} />
          <SVG source={arrowSVG} width={138} height={8} />
        </View>

        <View style={styles.rightSection}>
          <SpacerColumn size={2.5} />
          <MultisigSection title="Recipient Address">
            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label=""
              hideLabel
              isAsterickSign
              name="receipientAddress"
              isDisabled={isDisabled}
              rules={{ required: true, validate: validateAddress }}
              placeHolder="E.g : torix23Jkj1ZSQJ128D928XJSkL2K30Dld1ksl"
            />
          </MultisigSection>

          <MultisigSection title="Amount of the Transaction" toriText>
            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Amount"
              isAsterickSign
              name="amount"
              rules={{ required: true, pattern: patternOnlyNumbers }}
              isDisabled={isDisabled}
              tiker="TORI"
              placeHolder="0.00"
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Gas Limit"
              isAsterickSign
              name="gasLimit"
              rules={{ required: true, pattern: patternOnlyNumbers }}
              isDisabled={isDisabled}
              placeHolder="0"
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Gas Price"
              isAsterickSign
              name="gasPrice"
              rules={{ required: true, pattern: patternOnlyNumbers }}
              isDisabled={isDisabled}
              placeHolder="0"
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Memo"
              name="memo"
              isDisabled={isDisabled}
            />
            <SpacerColumn size={2.5} />

            <View style={styles.selfCenter}>
              <PrimaryButton
                size="XL"
                width={218}
                text={submitBtnText}
                disabled={isDisabled}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </MultisigSection>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", flex: 1 },
  container: {
    padding: layout.contentPadding,
    paddingTop: layout.topContentPaddingWithHeading,
  },
  leftSection: {
    flex: 1,
  },
  centerSection: {
    paddingHorizontal: layout.padding_x2_5,
    marginTop: 60,
    alignItems: "center",
  },
  rightSection: {
    flex: 1,
  },
  selfCenter: {
    alignSelf: "center",
  },
});

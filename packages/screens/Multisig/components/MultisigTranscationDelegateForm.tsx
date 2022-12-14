import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import arrowSVG from "../../../../assets/icons/arrow-with-tail.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { AnimationExpand } from "../../../components/animations";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../../components/spacer";
import { useMultisigContext } from "../../../context/MultisigReducer";
import { useGetMultisigAccount } from "../../../hooks/multisig";
import { useMultisigHelpers } from "../../../hooks/multisig/useMultisigHelpers";
import {
  patternOnlyNumbers,
  validateAddress,
  validateMaxNumber,
  validateMultisigAddress,
} from "../../../utils/formRules";
import { AppRouteType } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { toriCurrency } from "../../../utils/teritori";
import { MultisigTransactionDelegateFormType } from "../types";
import { MultisigFormInput } from "./MultisigFormInput";
import { MultisigSection } from "./MultisigSection";

interface MultisigTranscationDelegateFormProps {
  type: "transfer" | "delegate";
  title: string;
  transferText: string;
  submitBtnText: string;
  onSubmit?: (formValues: MultisigTransactionDelegateFormType) => void;
}

export const MultisigTranscationDelegateForm: React.FC<
  MultisigTranscationDelegateFormProps
> = ({ title, transferText, submitBtnText, onSubmit = () => {}, type }) => {
  // variables
  const {
    params: { address },
  } = useRoute<AppRouteType<"MultisigTransfer" | "MultisigDelegate">>();
  const { isLoading, data } = useGetMultisigAccount(address);
  const { control, handleSubmit, setValue } =
    useForm<MultisigTransactionDelegateFormType>();
  const { coinSimplified, participantAddressesFromMultisig } =
    useMultisigHelpers();
  const { state } = useMultisigContext();

  const holidings = useMemo(() => {
    if (data?.holdings) {
      return coinSimplified(data.holdings);
    }
    return null;
  }, [data]);

  const membersAddress = useMemo(() => {
    if (data?.accountData) {
      return participantAddressesFromMultisig(data.accountData[0]);
    }
    return null;
  }, [data]);

  // functions
  const onPressMax = () => {
    setValue("amount", holidings?.value || "0", { shouldValidate: true });
  };

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
              defaultValue={address}
              isCopiable
              isDisabled
              isOverrideDisabledBorder
            />
          </MultisigSection>

          <MultisigSection
            title="Multisig Wallet Members"
            tresholdCurrentCount={
              data
                ? parseInt(data.accountData[0].value.threshold, 10)
                : undefined
            }
            tresholdMax={membersAddress ? membersAddress.length : undefined}
            isLoading={isLoading}
          >
            {membersAddress &&
              membersAddress.map((address, index) => (
                <AnimationExpand key={address}>
                  <MultisigFormInput<MultisigTransactionDelegateFormType>
                    control={control}
                    label={"Address #" + (index + 1)}
                    isAsterickSign
                    name={`membersAddress.${index}.address`}
                    rules={{ required: true, validate: validateAddress }}
                    isCopiable
                    isDisabled
                    isOverrideDisabledBorder
                    isLoading={isLoading}
                    defaultValue={address}
                  />
                  {index !== membersAddress.length - 1 && (
                    <SpacerColumn size={2.5} />
                  )}
                </AnimationExpand>
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
              name="recipientAddress"
              isDisabled={!membersAddress?.length}
              rules={{
                required: true,
                validate: (value) =>
                  validateMultisigAddress(
                    value,
                    type === "transfer"
                      ? state.chain?.addressPrefix || ""
                      : state.chain?.validatorPrefix || ""
                  ),
              }}
              placeHolder="E.g : torix23Jkj1ZSQJ128D928XJSkL2K30Dld1ksl"
            />
          </MultisigSection>

          <MultisigSection title="Amount of the Transaction" toriText>
            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Amount"
              isAsterickSign
              name="amount"
              rules={{
                required: true,
                validate: (value) =>
                  validateMaxNumber(value, parseFloat(holidings?.value || "0")),
              }}
              currency={toriCurrency}
              isDisabled={!membersAddress?.length}
              subtitle={
                holidings?.value ? `${holidings.value} ${holidings.ticker}` : ""
              }
              placeHolder="0.00"
              onPressMax={onPressMax}
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Gas Limit"
              isAsterickSign
              name="gasLimit"
              rules={{ required: true, pattern: patternOnlyNumbers }}
              isDisabled={!membersAddress?.length}
              placeHolder="0"
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Gas Price"
              isAsterickSign
              name="gasPrice"
              rules={{ required: true }}
              isDisabled
              isOverrideDisabledBorder
              placeHolder="0"
              defaultValue={state.chain?.gasPrice}
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Memo"
              name="memo"
              isDisabled={!membersAddress?.length}
            />
            <SpacerColumn size={2.5} />

            <View style={styles.selfCenter}>
              <PrimaryButton
                size="XL"
                width={218}
                text={submitBtnText}
                disabled={!membersAddress?.length}
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

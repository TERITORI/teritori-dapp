import { useRoute } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { MultisigFormInput } from "./MultisigFormInput";
import { MultisigSection } from "./MultisigSection";
import arrowSVG from "../../../../assets/icons/arrow-with-tail.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { AnimationExpand } from "../../../components/animations";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SearchNSInputContainer } from "../../../components/inputs/SearchNSInputContainer";
import {
  SelectInput,
  SelectInputData,
} from "../../../components/inputs/SelectInput";
import { SpacerColumn } from "../../../components/spacer";
import { useMultisigContext } from "../../../context/MultisigReducer";
import {
  useGetMultisigAccount,
  useMultisigHelpers,
} from "../../../hooks/multisig";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { useValidators } from "../../../hooks/useValidators";
import { parseUserId } from "../../../networks";
import {
  patternOnlyNumbers,
  validateAddress,
  validateMaxNumber,
  validateMultisigAddress,
} from "../../../utils/formRules";
import { AppRouteType } from "../../../utils/navigation";
import { neutral77, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { toriCurrency } from "../../../utils/teritori";
import { MultisigTransactionDelegateFormType } from "../types";

interface MultisigTransactionDelegateFormProps {
  type: "transfer" | "delegate";
  title: string;
  transferText: string;
  submitBtnText: string;
  onSubmit?: (formValues: MultisigTransactionDelegateFormType) => void;
}

export const MultisigTransactionForm: React.FC<
  MultisigTransactionDelegateFormProps
> = ({ title, transferText, submitBtnText, onSubmit = () => {}, type }) => {
  const {
    params: { address: multisigId },
  } = useRoute<AppRouteType<"MultisigTransfer" | "MultisigDelegate">>();
  const selectedNetworkId = useSelectedNetworkId();
  const [, address] = parseUserId(multisigId);
  const { isLoading, data } = useGetMultisigAccount(multisigId);
  const { control, handleSubmit, setValue, watch } =
    useForm<MultisigTransactionDelegateFormType>();
  const { coinSimplified, participantAddressesFromMultisig } =
    useMultisigHelpers();
  const { state } = useMultisigContext();
  const {
    data: { activeValidators },
    isFetching,
  } = useValidators(selectedNetworkId);

  const holidings = useMemo(() => {
    if (data?.holdings) {
      return coinSimplified(data.holdings);
    }
    return null;
  }, [coinSimplified, data?.holdings]);

  const membersAddress = useMemo(() => {
    if (data?.accountData) {
      return participantAddressesFromMultisig(data.accountData[0]);
    }
    return null;
  }, [data?.accountData, participantAddressesFromMultisig]);

  // functions
  const onPressMax = () => {
    setValue("amount", holidings?.value || "0", { shouldValidate: true });
  };

  const [selectedInputData, setSelectedInputData] = useState<SelectInputData>({
    label: "",
    value: "",
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
          <MultisigSection
            title="Recipient Address"
            containerStyle={{ zIndex: 20 }}
          >
            {isFetching && <ActivityIndicator color={secondaryColor} />}
            {!isFetching && (
              <>
                {type === "transfer" ? (
                  <SearchNSInputContainer
                    searchText={watch("recipientAddress")}
                    onPressName={(address) =>
                      setValue("recipientAddress", address)
                    }
                  >
                    <MultisigFormInput<MultisigTransactionDelegateFormType>
                      control={control}
                      label=""
                      hideLabel
                      name="recipientAddress"
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
                  </SearchNSInputContainer>
                ) : (
                  <SelectInput
                    data={activeValidators.map((v) => {
                      return {
                        label: v.moniker,
                        value: v.moniker,
                      };
                    })}
                    placeHolder="Select"
                    selectedData={selectedInputData}
                    setData={(d) => {
                      let recipientAddr = "";
                      activeValidators.map((av) => {
                        if (av.moniker === d.value) {
                          recipientAddr = av.address;
                        }
                      });
                      setValue("recipientAddress", recipientAddr);
                      setSelectedInputData(d);
                    }}
                  />
                )}
              </>
            )}
          </MultisigSection>

          <MultisigSection title="Amount of the Transaction" toriText>
            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Amount"
              name="amount"
              rules={{
                required: true,
                validate: (value) =>
                  validateMaxNumber(value, parseFloat(holidings?.value || "0")),
              }}
              currency={toriCurrency}
              subtitle={
                <BrandText>
                  {holidings?.value
                    ? `${holidings.value} ${holidings.ticker}`
                    : ""}
                </BrandText>
              }
              placeHolder="0.00"
              onPressMax={onPressMax}
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Gas Limit"
              name="gasLimit"
              rules={{ required: true, pattern: patternOnlyNumbers }}
              placeHolder="0"
              defaultValue="200000"
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Gas Price"
              name="gasPrice"
              rules={{ required: true }}
              isDisabled
              isOverrideDisabledBorder
              placeHolder="0"
              defaultValue={process.env.PUBLIC_GAS_PRICE}
            />
            <SpacerColumn size={2.5} />

            <MultisigFormInput<MultisigTransactionDelegateFormType>
              control={control}
              label="Memo"
              name="memo"
            />
            <SpacerColumn size={2.5} />

            <View style={styles.selfCenter}>
              <PrimaryButton
                size="XL"
                width={218}
                text={submitBtnText}
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

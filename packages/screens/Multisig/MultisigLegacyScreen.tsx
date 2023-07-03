import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import { MultisigFormInput } from "./components/MultisigFormInput";
import { MultisigSection } from "./components/MultisigSection";
import { RightSection } from "./components/RightSection";
import { MultisigLegacyFormType } from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AnimationExpand } from "../../components/animations";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn } from "../../components/spacer";
import {
  useGetMultisigAccount,
  useMultisigHelpers,
} from "../../hooks/multisig";
import { patternOnlyNumbers, validateAddress } from "../../utils/formRules";
import { ScreenFC } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MultisigLegacyScreen: ScreenFC<"MultisigLegacy"> = ({ route }) => {
  const { control } = useForm<MultisigLegacyFormType>();
  const { address, name } = route.params;
  const { isLoading, data } = useGetMultisigAccount(address);
  const { coinSimplified, participantAddressesFromMultisig } =
    useMultisigHelpers();

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

  // returns
  return (
    <ScreenContainer
      headerChildren={<BackTo label="Multisig Dashboard" />}
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
          <BrandText style={fontSemibold28}>
            {name || "Multisig Legacy"}
          </BrandText>
          <SpacerColumn size={2.5} />
          <MultisigSection title="Multisig Address">
            <MultisigFormInput<MultisigLegacyFormType>
              control={control}
              label=""
              hideLabel
              name="multisigAddress"
              rules={{ required: true, validate: validateAddress }}
              isCopiable
              isDisabled
              isOverrideDisabledBorder
              defaultValue={address}
            />
          </MultisigSection>

          <MultisigSection
            title="Members Addresses"
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
                  <MultisigFormInput<MultisigLegacyFormType>
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

          <MultisigSection title="Holdings & Assets">
            <MultisigFormInput<MultisigLegacyFormType>
              control={control}
              label="Assets"
              name="assets"
              rules={{ required: true, pattern: patternOnlyNumbers }}
              tiker={holidings?.ticker}
              isDisabled
              isOverrideDisabledBorder
              isLoading={isLoading}
              defaultValue={holidings?.value}
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

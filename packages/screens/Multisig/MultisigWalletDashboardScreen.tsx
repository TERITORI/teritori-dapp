import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import { MultisigFormInput } from "./components/MultisigFormInput";
import { MultisigSection } from "./components/MultisigSection";
import { RightSection } from "./components/RightSection";
import { MultisigLegacyFormType } from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AnimationExpand } from "../../components/animations";
import { SpacerColumn } from "../../components/spacer";
import {
  useGetMultisigAccount,
  useMultisigHelpers,
} from "../../hooks/multisig";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind } from "../../networks";
import { patternOnlyNumbers, validateAddress } from "../../utils/formRules";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MultisigWalletDashboardScreen: ScreenFC<
  "MultisigWalletDashboard"
> = ({ route }) => {
  const navigation = useAppNavigation();
  const { selectedWallet } = useSelectedWallet();
  const { control } = useForm<MultisigLegacyFormType>();
  const { address, walletName } = route.params;
  const { isLoading, data } = useGetMultisigAccount(address);
  const { coinSimplified, participantAddressesFromMultisig } =
    useMultisigHelpers();

  //TODO: Display loader until isLoading === false

  // Leave screen if no wallet found from URL address, no name or if the user havn't this wallet
  useEffect(() => {
    if (
      !isLoading &&
      (!walletName ||
        !data ||
        !data?.dbData.userAddresses.find(
          (address) => address === selectedWallet?.address
        ))
    ) {
      navigation.navigate("Multisig");
    }
  }, [isLoading, data, selectedWallet?.address, navigation, walletName]);

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
      headerChildren={
        <BrandText style={fontSemibold20}>Multisig Dashboard</BrandText>
      }
      onBackPress={() => navigation.navigate("Multisig")}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <View style={styles.row}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <BrandText style={fontSemibold28}>
            {walletName || "Multisig Legacy"}
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

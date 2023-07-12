import React, { useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";

import { MultiSigWalletTransactionType } from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useGetMultisigAccount } from "../../hooks/multisig";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BasicTransactionItem } from "../OrganizerDeployer/components/BasicTransactionItem";
import { MakeProposalModal } from "../OrganizerDeployer/components/MakeProposalModal";
import { ProposalItemWIP } from "../OrganizerDeployer/components/ProposalItemWIP";
import multisigTransactions from "../OrganizerDeployer/multisig-transactions.json";

//TODO: Another Transactions page ?

export const MultisigWIPTransactionsScreen: ScreenFC<
  "MultisigWIPTransactions"
> = ({ route }) => {
  const { selectedWallet } = useSelectedWallet();
  const navigation = useAppNavigation();
  const { address, walletName } = route.params;
  // variabels
  const [isMakeProposalVisible, setIsMakeProposalVisible] = useState(false);
  const { isLoading, data } = useGetMultisigAccount(address);

  //TODO: Display loader until isLoading === false

  // Leave screen if no wallet found from URL address, no name or if the user haven't this wallet
  useEffect(() => {
    if (
      !isLoading &&
      (!walletName ||
        !data ||
        !data?.dbData.userAddresses.find(
          (address) => address === selectedWallet?.address
        ))
    ) {
      navigation.goBack();
      // navigation.navigate("MultisigWalletDashboard", {
      //   address,
      //   walletName
      // })
    }
  }, [isLoading, data, selectedWallet?.address, navigation, walletName]);

  // functions
  const toggleIsMakeProposalVisible = () =>
    setIsMakeProposalVisible(!isMakeProposalVisible);

  // returns
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MultiSigWalletTransactionType>) => {
      switch (item.type) {
        case "proposals":
          return (
            <ProposalItemWIP
              {...item}
              onPress={() =>
                navigation.navigate("MultisigTransactions", {
                  address: "",
                })
              }
            />
          );

        default:
          return <BasicTransactionItem {...item} />;
      }
    },
    [navigation]
  );

  return (
    <ScreenContainer
      isHeaderSmallMargin
      headerChildren={
        <BrandText style={fontSemibold20}>
          Transactions (Again ? TODO)
        </BrandText>
      }
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Multisig")
      }
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
    >
      <FlatList
        data={multisigTransactions as MultiSigWalletTransactionType[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListHeaderComponent={() => (
          <>
            <BrandText style={fontSemibold28}>
              Transactions history for {walletName}
            </BrandText>
            <SpacerColumn size={1.5} />
            <Separator />
            <View style={styles.header}>
              <BrandText style={[fontSemibold28, { color: primaryColor }]}>
                $5,454.68
              </BrandText>
              <View style={styles.row}>
                <SecondaryButton
                  size="M"
                  text="Make a proposal"
                  onPress={toggleIsMakeProposalVisible}
                />
                <SpacerRow size={2} />
                <SecondaryButton size="M" text="Receive" />
              </View>
            </View>
          </>
        )}
        ListFooterComponent={() => <SpacerColumn size={6} />}
      />

      <MakeProposalModal
        visible={isMakeProposalVisible}
        onRequestClose={toggleIsMakeProposalVisible}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingTop: layout.topContentPaddingWithHeading,
    flex: 1,
  },
  header: {
    paddingVertical: layout.padding_x1_5,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});

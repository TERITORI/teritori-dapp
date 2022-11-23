import React, { useCallback, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useAppNavigation } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BasicTransactionItem } from "./components/BasicTransactionItem";
import { MakeProposalModal } from "./components/MakeProposalModal";
import { ProposalItem } from "./components/ProposalItem";
import multisigTransactions from "./multisig-transactions.json";
import { MultiSigWalletTransactionType } from "./types";

export const MultisigWalletTransactionScreen = () => {
  // variabels
  const [isMakeProposalVisible, setIsMakeProposalVisible] = useState(false);
  const navigation = useAppNavigation();

  // functions
  const toggleIsMakeProposalVisible = () =>
    setIsMakeProposalVisible(!isMakeProposalVisible);

  // returns
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MultiSigWalletTransactionType>) => {
      switch (item.type) {
        case "proposals":
          return (
            <ProposalItem
              {...item}
              onPress={() => navigation.navigate("TransactionProposal")}
            />
          );

        default:
          return <BasicTransactionItem {...item} />;
      }
    },
    []
  );

  return (
    <ScreenContainer
      isHeaderSmallMargin
      headerChildren={<BackTo label="Wallet Name 1" />}
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
            <BrandText style={fontSemibold28}>Transactions history</BrandText>
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

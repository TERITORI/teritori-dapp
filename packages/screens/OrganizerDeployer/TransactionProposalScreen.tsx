import React, { useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";

import { ProposalTransactionItem } from "./components/ProposalTransactionItem";
import multisigTransactions from "./multisig-proposal-transaction.json";
import { ProposalsTransactionType } from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const tabs = {
  all: {
    name: "All",
    badgeCount: 25,
  },
  transfer: {
    name: "Transfer",
    badgeCount: 20,
  },
  stake: {
    name: "Stake",
    badgeCount: 5,
  },
};

export const TransactionProposalScreen = () => {
  // variables
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("all");
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  // returns
  return (
    <ScreenContainer
      isHeaderSmallMargin
      headerChildren={<BackTo label="Transactions history" />}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      headerStyle={{ zIndex: 1000 }}
    >
      <View style={styles.header}>
        <BrandText style={fontSemibold28}>Transaction proposals</BrandText>
        <SpacerColumn size={1.5} />

        <Tabs
          items={tabs}
          onSelect={setSelectedTab}
          selected={selectedTab}
          tabStyle={{
            height: 64,
          }}
        />
      </View>
      <FlatList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: true,
          }
        )}
        data={multisigTransactions as ProposalsTransactionType[]}
        renderItem={({ item }) => <ProposalTransactionItem {...item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListFooterComponent={() => <SpacerColumn size={6} />}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingTop: 0,
    flex: 1,
  },
  header: {
    marginHorizontal: layout.contentPadding,
    marginTop: layout.topContentPaddingWithHeading,
  },
});

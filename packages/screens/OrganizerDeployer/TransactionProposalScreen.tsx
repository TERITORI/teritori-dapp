import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import {
  MultisigTransactionListType,
  useFetchMultisigTransactions,
} from "../../hooks/useFetchMultisigTransactionsById";
import { useGetMultisigAccount } from "../../hooks/useGetMultisigAccount";
import { ScreenFC } from "../../utils/navigation";
import { secondaryColor } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { MultisigTransactionType } from "../Multisig/types";
import { ProposalTransactionItem } from "./components/ProposalTransactionItem";
const tabs = {
  all: {
    name: "All",
    badgeCount: 25,
    value: undefined,
  },
  transfer: {
    name: "Transfer",
    badgeCount: 20,
    value: MultisigTransactionType.TRANSFER,
  },
  stake: {
    name: "Stake",
    badgeCount: 5,
    value: MultisigTransactionType.STAKE,
  },
};

export const TransactionProposalScreen: ScreenFC<
  "MultisigTransactionProposal"
> = ({ route }) => {
  // variables
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("all");
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { data: multisigData } = useGetMultisigAccount(route.params.address);
  const { data, isLoading, isFetching } = useFetchMultisigTransactions(
    multisigData?.id || "",
    tabs[selectedTab].value
  );
  const list = useMemo(
    () =>
      data?.pages.reduce(
        (ar: MultisigTransactionListType[], ac) => [...ac.data, ...ar],
        []
      ),
    [data?.pages]
  );

  // returns
  const ListFooter = useCallback(
    () => (
      <>
        <SpacerColumn size={6} />
        {(isLoading || isFetching) && (
          <>
            <ActivityIndicator color={secondaryColor} />
            <SpacerColumn size={2} />
          </>
        )}
      </>
    ),
    [isFetching, isLoading]
  );

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
        data={list}
        renderItem={({ item }) => <ProposalTransactionItem {...item} />}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListFooterComponent={ListFooter}
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

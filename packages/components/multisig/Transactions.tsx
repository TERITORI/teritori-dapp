import React, { FC, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { ProposalTransactionItem } from "./ProposalTransactionItem";
import {
  ExecutionState,
  TransactionsCount,
} from "../../api/multisig/v1/multisig";
import {
  useMultisigTransactions,
  useMultisigTransactionsCounts,
  useMultisigValidator,
} from "../../hooks/multisig";
import { secondaryColor } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { headerHeight, layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { EmptyList } from "../EmptyList";
import { SpacerColumn } from "../spacer";
import { Tabs } from "../tabs/Tabs";

const MIN_ITEMS_PER_PAGE = 50;

export const Transactions: FC<{
  chainId: string | undefined;
  multisigAddress?: string;
  userAddress?: string;
  title?: string;
}> = ({ chainId, multisigAddress, title, userAddress }) => {
  const { height: windowHeight } = useWindowDimensions();
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("all");

  const { transactionsCounts: counts } = useMultisigTransactionsCounts(
    chainId,
    multisigAddress
  );
  const { isUserMultisig } = useMultisigValidator(multisigAddress);
  const tabs = useMemo(
    () => ({
      currentProposals: {
        name: "Current proposals",
        badgeCount: counts?.all?.pending || 0,
        types: [],
        state: ExecutionState.EXECUTION_STATE_PENDING,
      },
      all: {
        name: "All",
        badgeCount: counts?.all?.total || 0,
        types: [],
        state: ExecutionState.EXECUTION_STATE_UNSPECIFIED,
      },
      // TODO: transferReceived must be the transfers sent to the multisig wallet
      transferReceived: {
        name: "Transfer received",
        badgeCount: 0,
        disabled: true,
        types: [],
        state: ExecutionState.EXECUTION_STATE_UNSPECIFIED,
      },
      transferEmitted: {
        name: "Transfer emitted",
        ...filteredTabValues(
          counts?.byType || [],
          ExecutionState.EXECUTION_STATE_UNSPECIFIED,
          ["/cosmos.bank.v1beta1.MsgSend"]
        ),
      },
      stake: {
        name: "Staking",
        ...filteredTabValues(
          counts?.byType || [],
          ExecutionState.EXECUTION_STATE_UNSPECIFIED,
          [
            "/cosmos.staking.v1beta1.MsgDelegate",
            "/cosmos.staking.v1beta1.MsgUndelegate",
            "/cosmos.staking.v1beta1.MsgBeginRedelegate",
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
          ]
        ),
      },
      // collectionLaunch: {
      //   name: "Collection launch",
      //   badgeCount: countList ? countList[5] : 0,
      //   value: MultisigTransactionType.LAUNCH_NFT_COLLECTION,
      // },
      contracts: {
        name: "Contracts",
        ...filteredTabValues(
          counts?.byType || [],
          ExecutionState.EXECUTION_STATE_UNSPECIFIED,
          [
            "/cosmwasm.wasm.v1.MsgInstantiateContract",
            "/cosmwasm.wasm.v1.MsgExecuteContract",
          ]
        ),
      },
    }),
    [counts]
  );

  const {
    data,
    isLoading: txLoading,
    fetchNextPage: fetchNextTransactionsPage,
  } = useMultisigTransactions(
    chainId,
    multisigAddress,
    userAddress,
    tabs[selectedTab].types,
    tabs[selectedTab].state
  );

  const list = useMemo(() => {
    if (data)
      return data.pages.reduce(
        (r, p) => [...r, ...p.data],
        [] as (typeof data)["pages"][0]["data"]
      );
    return [];
  }, [data]);

  return (
    <>
      <View>
        {title && (
          <>
            <BrandText style={fontSemibold28}>{title}</BrandText>
            <SpacerColumn size={1.5} />
          </>
        )}

        <Tabs
          items={tabs}
          onSelect={setSelectedTab}
          selected={selectedTab}
          tabContainerStyle={{
            height: 64,
          }}
        />
      </View>

      <FlatList
        data={list}
        renderItem={({ item }) => (
          <ProposalTransactionItem {...item} isUserMultisig={isUserMultisig} />
        )}
        initialNumToRender={MIN_ITEMS_PER_PAGE}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => fetchNextTransactionsPage()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          txLoading ? null : <EmptyList text="No proposals" />
        }
        ListFooterComponent={<ListFooter isTransactionsLoading={txLoading} />}
        style={{ height: windowHeight - headerHeight - 70 }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: layout.contentPadding,
    flex: 1,
  },
});

const filteredTabValues = (
  counts: TransactionsCount[],
  state: ExecutionState,
  types: string[]
) => {
  const result = {
    badgeCount: 0,
    state,
    types,
  };
  for (const count of counts) {
    if (types.length === 0 || types.includes(count.type)) {
      switch (state) {
        case ExecutionState.EXECUTION_STATE_UNSPECIFIED:
          result.badgeCount += count.total;
          break;
        case ExecutionState.EXECUTION_STATE_PENDING:
          result.badgeCount += count.pending;
          break;
        case ExecutionState.EXECUTION_STATE_EXECUTED:
          result.badgeCount += count.executed;
          break;
      }
    }
  }
  return result;
};

const ListFooter: React.FC<{ isTransactionsLoading: boolean }> = ({
  isTransactionsLoading,
}) => (
  <View>
    {isTransactionsLoading && (
      <>
        <SpacerColumn size={4} />
        <ActivityIndicator size="large" color={secondaryColor} />
      </>
    )}
  </View>
);

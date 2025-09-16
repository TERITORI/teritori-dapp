import React, { FC, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  View,
  useWindowDimensions,
} from "react-native";

import { MultisigTransactionItem } from "./MultisigTransactionItem";
import {
  ExecutionState,
  JoinState,
  TransactionsCount,
} from "../../api/multisig/v1/multisig";
import { useMultisigTransactions } from "../../hooks/multisig/useMultisigTransactions";
import { useMultisigTransactionsCounts } from "../../hooks/multisig/useMultisigTransactionsCounts";
import { secondaryColor } from "../../utils/style/colors";
import { fontRegular28 } from "../../utils/style/fonts";
import { headerHeight, layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { EmptyList } from "../EmptyList";
import { SpacerColumn } from "../spacer";
import { Tabs } from "../tabs/Tabs";

import { useUserMultisigs } from "@/hooks/multisig/useUserMultisigs";
import { getNetwork, NetworkFeature } from "@/networks";
import { TabDefinition } from "@/utils/types/tabs";

const MIN_ITEMS_PER_PAGE = 50;

interface TabInfo extends TabDefinition {
  types: string[];
  state: ExecutionState;
}

export const MultisigTransactions: FC<{
  title?: string;
  userId: string | undefined;
  multisigUserId?: string;
  networkId?: string;
  Header?: FlatListProps<unknown>["ListHeaderComponent"];
  showCreator?: boolean;
}> = ({ title, userId, multisigUserId, networkId, Header, showCreator }) => {
  const network = getNetwork(networkId);
  const { height: windowHeight } = useWindowDimensions();
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("all");

  const { transactionsCounts: counts } = useMultisigTransactionsCounts(
    userId,
    multisigUserId,
  );

  const { multisigs } = useUserMultisigs(userId, JoinState.JOIN_STATE_IN);

  const tabs = useMemo(() => {
    const infos: Record<string, TabInfo> = {
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
      transferEmitted: {
        name: "Transfer emitted",
        ...filteredTabValues(
          counts?.byType || [],
          ExecutionState.EXECUTION_STATE_UNSPECIFIED,
          ["/cosmos.bank.v1beta1.MsgSend", "/bank.MsgSend"],
        ),
      },
    };

    console.log("netififi", network);

    if (network?.features.includes(NetworkFeature.NativeStaking)) {
      infos.stake = {
        name: "Staking",
        ...filteredTabValues(
          counts?.byType || [],
          ExecutionState.EXECUTION_STATE_UNSPECIFIED,
          [
            "/cosmos.staking.v1beta1.MsgDelegate",
            "/cosmos.staking.v1beta1.MsgUndelegate",
            "/cosmos.staking.v1beta1.MsgBeginRedelegate",
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
          ],
        ),
      };
    }

    infos.contracts = {
      name: "Contracts",
      ...filteredTabValues(
        counts?.byType || [],
        ExecutionState.EXECUTION_STATE_UNSPECIFIED,
        [
          "/cosmwasm.wasm.v1.MsgInstantiateContract",
          "/cosmwasm.wasm.v1.MsgExecuteContract",
          "/vm.m_call",
        ],
      ),
    };

    return infos;
  }, [counts, network]);

  const {
    data,
    isLoading: txLoading,
    fetchNextPage: fetchNextTransactionsPage,
  } = useMultisigTransactions(
    userId,
    multisigUserId,
    tabs[selectedTab].types,
    tabs[selectedTab].state,
  );

  const list = useMemo(() => {
    if (data)
      return data.pages.reduce(
        (r, p) => [...r, ...p.data],
        [] as (typeof data)["pages"][0]["data"],
      );
    return [];
  }, [data]);

  const ListHeaderComponent: React.FC = useMemo(() => {
    const Res = () => (
      <>
        {typeof Header === "function" ? <Header /> : undefined}
        <View>
          {title && (
            <>
              <BrandText style={fontRegular28}>{title}</BrandText>
              <SpacerColumn size={1.5} />
            </>
          )}

          <Tabs
            items={tabs}
            onSelect={setSelectedTab}
            selected={selectedTab}
            tabContainerStyle={{ height: 64 }}
          />
        </View>
      </>
    );
    return Res;
  }, [Header, selectedTab, tabs, title]);

  return (
    <FlatList
      data={list}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={({ item }) => {
        let name;
        if (!showCreator) {
          name = multisigs.find(
            (msig) => msig.address === item.multisigAddress,
          )?.name;
        }
        return <MultisigTransactionItem multisigName={name} {...item} />;
      }}
      initialNumToRender={MIN_ITEMS_PER_PAGE}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => fetchNextTransactionsPage()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: layout.contentSpacing,
        flex: 1,
      }}
      ListEmptyComponent={txLoading ? null : <EmptyList text="No proposals" />}
      ListFooterComponent={<ListFooter isTransactionsLoading={txLoading} />}
      style={{ height: windowHeight - headerHeight - 70 }}
    />
  );
};

const filteredTabValues = (
  counts: TransactionsCount[],
  state: ExecutionState,
  types: string[],
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

import React, { FC, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { useGetMultisigTransactionsCountsQuery } from "../../../api/multisig";
import { BrandText } from "../../../components/BrandText";
import { EmptyList } from "../../../components/EmptyList";
import { AnimationFadeIn } from "../../../components/animations";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import {
  useFetchMultisigTransactionsById,
  useMultisigValidator,
} from "../../../hooks/multisig";
import { getCosmosNetwork, parseUserId } from "../../../networks";
import { fetcherConfig } from "../../../utils/faunaDB/multisig/multisigGraphql";
import { fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ProposalTransactionItem } from "../../OrganizerDeployer/components/ProposalTransactionItem";
import { MultisigTransactionType } from "../types";

const MIN_ITEMS_PER_PAGE = 50;

export const Transactions: FC<{
  multisigId?: string;
  title?: string;
}> = ({ multisigId, title }) => {
  const [network, multisigAddress] = parseUserId(multisigId);
  const cosmosNetwork = getCosmosNetwork(network?.id);
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("all");
  const { data: countsData } = useGetMultisigTransactionsCountsQuery(
    fetcherConfig,
    {
      chainId: cosmosNetwork?.chainId || "",
      address: multisigAddress,
    },
    { enabled: !!cosmosNetwork?.chainId && !!multisigAddress }
  );
  const counts = countsData?.counts;
  const { isUserMultisig } = useMultisigValidator(multisigAddress);
  const tabs = useMemo(
    () => ({
      // TODO: currentProposals must be proposals than require approbations or broadcast
      currentProposals: {
        name: "Current proposals",
        badgeCount: (counts?.total || 0) - (counts?.executed || 0),
        value: undefined,
      },
      all: {
        name: "All",
        badgeCount: counts?.total || 0,
        value: undefined,
      },
      // TODO: transferReceived must be the transfers sent to the multisig wallet
      transferReceived: {
        name: "Transfer received",
        // badgeCount: countList ? countList[2] : 0,
        badgeCount: 0,
        value: undefined,
        disabled: true,
      },
      transferEmitted: {
        name: "Transfer emitted",
        badgeCount: 0,
        value: MultisigTransactionType.TRANSFER,
      },
      stake: {
        name: "Stake",
        badgeCount: 0,
        value: MultisigTransactionType.STAKE,
      },
      // collectionLaunch: {
      //   name: "Collection launch",
      //   badgeCount: countList ? countList[5] : 0,
      //   value: MultisigTransactionType.LAUNCH_NFT_COLLECTION,
      // },
      postCreation: {
        name: "Post creation",
        badgeCount: 0,
        value: MultisigTransactionType.CREATE_NEW_POST,
      },
      profileManagement: {
        name: "Profile management",
        badgeCount: 0,
        value: MultisigTransactionType.MANAGE_PUBLIC_PROFILE,
      },
      nameRegister: {
        name: "Name register",
        badgeCount: 0,
        value: MultisigTransactionType.REGISTER_TNS,
      },
    }),
    [counts?.executed, counts?.total]
  );

  const {
    data,
    isLoading: txLoading,
    fetchNextPage: fetchNextTransactionsPage,
  } = useFetchMultisigTransactionsById(multisigId || "");

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
      <View style={styles.header}>
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
        renderItem={({ item, index }) => (
          <AnimationFadeIn delay={index * 50}>
            <ProposalTransactionItem
              {...item}
              isUserMultisig={isUserMultisig}
            />
          </AnimationFadeIn>
        )}
        initialNumToRender={MIN_ITEMS_PER_PAGE}
        keyExtractor={(item) => item._id}
        onEndReached={() => fetchNextTransactionsPage()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListEmptyComponent={() =>
          txLoading ? null : <EmptyList text="No proposals" />
        }
      />
    </>
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

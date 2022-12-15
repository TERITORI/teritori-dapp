import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { EmptyList } from "../../components/EmptyList";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AnimationFadeIn } from "../../components/animations";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import {
  MultisigTransactionListType,
  useFetchMultisigTransactionsById,
  useGetMultisigAccount,
  useMultisigValidator,
} from "../../hooks/multisig";
import { useGetTransactionCount } from "../../hooks/multisig/useGetTransactionCount";
import { ScreenFC } from "../../utils/navigation";
import { secondaryColor } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { MultisigTransactionType } from "../Multisig/types";
import { ProposalTransactionItem } from "./components/ProposalTransactionItem";

const RESULT_SIZE = 20;
export const TransactionProposalScreen: ScreenFC<
  "MultisigTransactionProposal"
> = ({ route }) => {
  // variables
  const { address, backText } = route.params;
  const [
    isEndReachedCalledDuringMomentum,
    setIsEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("all");
  const { data: multisigData } = useGetMultisigAccount(address);
  const { data: countList } = useGetTransactionCount(
    multisigData?.dbData._id || "",
    ["", MultisigTransactionType.TRANSFER, MultisigTransactionType.STAKE]
  );
  const { isUserMultisig } = useMultisigValidator(address);

  const tabs = useMemo(
    () => ({
      all: {
        name: "All",
        badgeCount: countList ? countList[0] : 0,
        value: undefined,
      },
      transfer: {
        name: "Transfer",
        badgeCount: countList ? countList[1] : 0,
        value: MultisigTransactionType.TRANSFER,
      },
      stake: {
        name: "Stake",
        badgeCount: countList ? countList[2] : 0,
        value: MultisigTransactionType.STAKE,
      },
    }),
    [countList]
  );

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } =
    useFetchMultisigTransactionsById(
      multisigData?.dbData._id || "",
      tabs[selectedTab].value,
      RESULT_SIZE
    );

  const list = useMemo(
    () =>
      data?.pages.reduce(
        (ar: MultisigTransactionListType[], ac) => [...ar, ...ac.data],
        []
      ),
    [data?.pages]
  );

  // functions
  const onEndReach = () => {
    if (hasNextPage && !isEndReachedCalledDuringMomentum) {
      fetchNextPage();
    }
  };

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
      headerChildren={<BackTo label={backText} />}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
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
        data={list}
        renderItem={({ item, index }) => (
          <AnimationFadeIn delay={index * 50}>
            <ProposalTransactionItem
              {...item}
              isUserMultisig={isUserMultisig}
              shouldRetch={() => refetch()}
            />
          </AnimationFadeIn>
        )}
        initialNumToRender={RESULT_SIZE}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListFooterComponent={ListFooter}
        onEndReached={onEndReach}
        onMomentumScrollBegin={() => setIsEndReachedCalledDuringMomentum(false)}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() =>
          isLoading ? null : <EmptyList text="No proposals" />
        }
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

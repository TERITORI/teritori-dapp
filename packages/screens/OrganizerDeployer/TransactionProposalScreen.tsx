import React, { useCallback, useMemo, useState, useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { EmptyList } from "../../components/EmptyList";
import { Pagination } from "../../components/Pagination";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AnimationFadeIn } from "../../components/animations";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { useMultisigContext } from "../../context/MultisigReducer";
import {
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

const RESULT_SIZE = 2;
export const TransactionProposalScreen: ScreenFC<
  "MultisigTransactionProposal"
> = ({ route }) => {
  // variables
  const { address, backText } = route.params;
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("all");
  const { state } = useMultisigContext();
  const { data: multisigData } = useGetMultisigAccount(address);
  const { data: countList } = useGetTransactionCount(
    multisigData?.dbData._id || "",
    ["", MultisigTransactionType.TRANSFER, MultisigTransactionType.STAKE]
  );

  const { isUserMultisig } = useMultisigValidator(
    address,
    state.chain.chainId!
  );

  const [pageIndex, setPageIndex] = useState(0);

  const [currentIndex, setCurrentIndex] = useState<string | null>(null);
  const [afterIndex, setAfterIndex] = useState<string | null>(null);
  const [beforeIndex, setBeforeIndex] = useState<string | null>(null);

  const itemsPerPage = 2;
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
  useEffect(() => {
    setCurrentIndex(null);
    setAfterIndex(null);
    setBeforeIndex(null);
  }, [selectedTab]);
  const total = useMemo(() => {
    return tabs[selectedTab].badgeCount;
  }, [selectedTab, countList]);

  const maxPage = useMemo(
    () => Math.max(Math.ceil(total / itemsPerPage), 1),
    [total]
  );

  const { data, isLoading, isFetching } = useFetchMultisigTransactionsById(
    multisigData?.dbData._id || "",
    tabs[selectedTab].value,
    currentIndex,
    RESULT_SIZE
  );
  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      setAfterIndex(data.after);
      setBeforeIndex(data.before);
    }
  }, [data, isLoading, isFetching]);
  const list = useMemo(() => {
    if (data) return data.data;
    return [];
  }, [data]);

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
        {!isLoading && !isFetching && data && data.data.length > 0 && (
          <Pagination
            disableLastButton
            currentPage={pageIndex}
            maxPage={maxPage}
            itemsPerPage={itemsPerPage}
            onChangePage={(index) => {
              if (index === pageIndex - 1) {
                //back
                setCurrentIndex(beforeIndex);
              } else if (index === pageIndex + 1) {
                //forward
                setCurrentIndex(afterIndex);
              } else {
                if (index === 0) {
                  //first
                  setCurrentIndex(null);
                } else if (index === maxPage - 1) {
                  //last
                }
              }
              setPageIndex(index);
            }}
          />
        )}
      </>
    ),
    [isFetching, isLoading, pageIndex, afterIndex, beforeIndex]
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
            />
          </AnimationFadeIn>
        )}
        initialNumToRender={RESULT_SIZE}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListFooterComponent={ListFooter}
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
  pagination_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

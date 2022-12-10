import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import chatSVG from "../../../assets/icons/organization/chat.svg";
import freelanceSVG from "../../../assets/icons/organization/freelance.svg";
import launchSVG from "../../../assets/icons/organization/launch.svg";
import multisigWalletSVG from "../../../assets/icons/organization/multisig-wallet.svg";
import pathwarSVG from "../../../assets/icons/organization/pathwar.svg";
import postJobSVG from "../../../assets/icons/organization/post-job.svg";
import profileSVG from "../../../assets/icons/organization/profile.svg";
import searchSVG from "../../../assets/icons/organization/search.svg";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { tinyAddress } from "../../components/WalletSelector";
import { AnimationFadeIn } from "../../components/animations";
import { SpacerColumn } from "../../components/spacer";
import {
  MultisigTransactionListType,
  useFetchMultisigList,
  useFetchMultisigTransactionsByAddress,
} from "../../hooks/multisig";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useAppNavigation } from "../../utils/navigation";
import { neutral33, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GetStartedOption } from "../OrganizerDeployer/components/GetStartedOption";
import { ProposalTransactionItem } from "../OrganizerDeployer/components/ProposalTransactionItem";

const RESULT_SIZE = 20;

export const MultisigScreen = () => {
  // variables
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const {
    data,
    isLoading: isMultisigLoading,
    isFetching: isMultisigFetching,
  } = useFetchMultisigList(selectedWallet?.address || "");
  const {
    data: transactionData,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
  } = useFetchMultisigTransactionsByAddress(selectedWallet?.address || "");

  const list = useMemo(
    () =>
      transactionData?.pages.reduce(
        (ar: MultisigTransactionListType[], ac) => [...ar, ...ac.data],
        []
      ),
    [transactionData?.pages]
  );

  // functions
  const onPress = () => {
    alert("TODO");
  };

  // returns
  const ListFooter = useCallback(
    () => (
      <>
        <SpacerColumn size={6} />
        {(isTransactionsLoading || isTransactionsFetching) && (
          <>
            <ActivityIndicator color={secondaryColor} />
            <SpacerColumn size={2} />
          </>
        )}
      </>
    ),
    [isTransactionsFetching, isTransactionsLoading]
  );

  return (
    <ScreenContainer
      headerChildren={<BrandText>Multisig Wallet</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.horizontalContentPadding}>
            <BrandText>What do you want to do?</BrandText>
          </View>
          <SpacerColumn size={3} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.optionsScrollContent}
            showsHorizontalScrollIndicator={false}
          >
            <GetStartedOption
              variant="small"
              title="Manage Public Profile"
              icon={profileSVG}
              onPress={onPress}
            />
            <GetStartedOption
              variant="small"
              title="Create your first Post"
              icon={searchSVG}
              onPress={onPress}
            />
            <GetStartedOption
              variant="small"
              title="Launch an NFT Collection"
              icon={launchSVG}
              onPress={onPress}
            />
            <GetStartedOption
              variant="small"
              title="Create the Organization Chat"
              icon={chatSVG}
            />
            <GetStartedOption
              variant="small"
              title="Post Job"
              icon={postJobSVG}
            />
            <GetStartedOption
              variant="small"
              title="Create Challenge on Pathwar"
              icon={pathwarSVG}
            />
            <GetStartedOption
              variant="small"
              title="Create Freelance Service"
              icon={freelanceSVG}
              onPress={onPress}
            />
            <GetStartedOption
              variant="small"
              title="Manage Multisig Wallet"
              icon={multisigWalletSVG}
              onPress={() => navigation.navigate("MultisigWalletManage")}
            />
          </ScrollView>
          <SpacerColumn size={3} />
          <View style={styles.horizontalContentPadding}>
            <Separator color={neutral33} />
            <SpacerColumn size={3} />
            <BrandText style={fontSemibold28}>My Multisigs</BrandText>
            <SpacerColumn size={1.5} />
            <BrandText style={[fontSemibold16, { color: neutral77 }]}>
              Overview of your Multisignatures Wallets
            </BrandText>
            <SpacerColumn size={2.5} />
            <FlatList
              data={data}
              horizontal
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <AnimationFadeIn delay={index * 50}>
                  <GetStartedOption
                    variant="small"
                    title={`Multisig #${index + 1}`}
                    icon={multisigWalletSVG}
                    isBetaVersion
                    onPress={() =>
                      navigation.navigate("MultisigLegacy", {
                        address: item.address,
                      })
                    }
                    subtitle={tinyAddress(item.address, 21)}
                    titleStyle={{ color: secondaryColor }}
                  />
                </AnimationFadeIn>
              )}
              ListHeaderComponent={() => (
                <GetStartedOption
                  variant="small"
                  title="Create new"
                  icon={postJobSVG}
                  isBetaVersion
                  onPress={() => navigation.navigate("MultisigCreate")}
                />
              )}
              ListFooterComponent={() =>
                isMultisigLoading && isMultisigFetching ? (
                  <View style={styles.contentCenter}>
                    <ActivityIndicator color={secondaryColor} />
                  </View>
                ) : null
              }
            />
          </View>
          <SpacerColumn size={3} />
          <View style={styles.horizontalContentPadding}>
            <Separator color={neutral33} />
            <SpacerColumn size={3} />
            <BrandText style={fontSemibold28}>Transactions Proposals</BrandText>

            <FlatList
              data={list}
              renderItem={({ item, index }) => (
                <AnimationFadeIn delay={index * 50}>
                  <ProposalTransactionItem {...item} />
                </AnimationFadeIn>
              )}
              initialNumToRender={RESULT_SIZE}
              keyExtractor={(item) => item._id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.transactionListContent}
              ListFooterComponent={ListFooter}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: layout.topContentPaddingWithHeading,
    paddingBottom: layout.contentPadding,
  },
  horizontalContentPadding: {
    paddingHorizontal: layout.contentPadding,
  },
  optionsScrollContent: {
    paddingHorizontal: layout.contentPadding - layout.padding_x2,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -layout.padding_x2,
    marginVertical: -layout.padding_x2,
  },
  contentCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 135,
  },
  transactionListContent: {
    paddingBottom: layout.contentPadding,
    marginTop: layout.padding_x2_5,
  },
});

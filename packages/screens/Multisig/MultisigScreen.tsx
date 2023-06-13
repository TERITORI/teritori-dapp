import React, { useCallback, useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { MultisigTransactionType } from "./types";
import chatSVG from "../../../assets/icons/organization/chat.svg";
import freelanceSVG from "../../../assets/icons/organization/freelance.svg";
import launchSVG from "../../../assets/icons/organization/launch.svg";
import multisigWalletSVG from "../../../assets/icons/organization/multisig-wallet.svg";
import pathwarSVG from "../../../assets/icons/organization/pathwar.svg";
import postJobSVG from "../../../assets/icons/organization/post-job.svg";
import profileSVG from "../../../assets/icons/organization/profile.svg";
import searchSVG from "../../../assets/icons/organization/search.svg";
import { BrandText } from "../../components/BrandText";
import { EmptyList } from "../../components/EmptyList";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { AnimationFadeIn } from "../../components/animations";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import ModalBase from "../../components/modals/ModalBase";
import { SpacerColumn } from "../../components/spacer";
import { useMultisigContext } from "../../context/MultisigReducer";
import {
  getMultisigAccount,
  MultisigTransactionListType,
  useFetchMultisigList,
  useFetchMultisigTransactionsByAddress,
} from "../../hooks/multisig";
import { useCreateMultisigTransactionForExecuteContract } from "../../hooks/multisig/useCreateMultisigTransactionForExecuteContract";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useAppNavigation } from "../../utils/navigation";
import { neutral33, neutral77, secondaryColor } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { GetStartedOption } from "../OrganizerDeployer/components/GetStartedOption";
import { ProposalTransactionItem } from "../OrganizerDeployer/components/ProposalTransactionItem";

const RESULT_SIZE = 20;

enum SelectModalKind {
  LaunchNFT,
  CreatePost,
  ManagePublicProfile,
}

export const MultisigScreen = () => {
  const navigation = useAppNavigation();
  const { selectedWallet } = useSelectedWallet();
  const { state } = useMultisigContext();
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
      marginTop: layout.padding_x2_5,
    },
  });

  const {
    data,
    isLoading: isMultisigLoading,
    isFetching: isMultisigFetching,
  } = useFetchMultisigList(selectedWallet?.address || "", state.chain.chainId!);
  const {
    data: transactionData,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
  } = useFetchMultisigTransactionsByAddress(
    selectedWallet?.address || "",
    state.chain.chainId!
  );

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

  const [openSelectMultiSignModal, setOpenSelectMultiSignModal] =
    useState<boolean>(false);
  const [kind, setKind] = useState<SelectModalKind>(SelectModalKind.LaunchNFT);

  const {
    isLoading,
    mutate,
    data: transactionId,
  } = useCreateMultisigTransactionForExecuteContract();

  const createProposal = (address: string) => {
    if (kind === SelectModalKind.LaunchNFT) {
      createProposalForLaunchNFT(address);
    } else if (kind === SelectModalKind.CreatePost) {
      createProposalForCreatePost(address);
    } else if (kind === SelectModalKind.ManagePublicProfile) {
      createProposalForManagePublicProfile(address);
    }
  };
  //address: multisign address
  const createProposalForLaunchNFT = async (address: string) => {
    const contractAddress = "CONTRACT_ADDR1";
    const mltisignAccountInfo = await getMultisigAccount(
      address,
      selectedWallet?.networkId!
    );
    if (mltisignAccountInfo?.accountData && mltisignAccountInfo.dbData._id) {
      mutate({
        formData: {
          contractAddress,
          multisigAddress: address,
          msg: { Execute: "CreateCollection" },
          multisigId: mltisignAccountInfo.dbData._id,
          type: MultisigTransactionType.LAUNCH_NFT_COLLECTION,
        },
        accountOnChain: mltisignAccountInfo?.accountData,
      });
    }
  };

  //address: multisign address
  const createProposalForCreatePost = async (address: string) => {
    const contractAddress = "CONTRACT_ADDR1";
    const mltisignAccountInfo = await getMultisigAccount(
      address,
      selectedWallet?.networkId!
    );
    if (mltisignAccountInfo?.accountData && mltisignAccountInfo.dbData._id) {
      mutate({
        formData: {
          contractAddress,
          multisigAddress: address,
          msg: { Execute: "CreateCollection" },
          multisigId: mltisignAccountInfo.dbData._id,
          type: MultisigTransactionType.CREATE_NEW_POST,
        },
        accountOnChain: mltisignAccountInfo?.accountData,
      });
    }
  };

  //address: multisign address
  const createProposalForManagePublicProfile = async (address: string) => {
    const contractAddress = "CONTRACT_ADDR1";
    const mltisignAccountInfo = await getMultisigAccount(
      address,
      selectedWallet?.networkId!
    );
    if (mltisignAccountInfo?.accountData && mltisignAccountInfo.dbData._id) {
      mutate({
        formData: {
          contractAddress,
          multisigAddress: address,
          msg: { Execute: "CreateCollection" },
          multisigId: mltisignAccountInfo.dbData._id,
          type: MultisigTransactionType.MANAGE_PUBLIC_PROFILE,
        },
        accountOnChain: mltisignAccountInfo?.accountData,
      });
    }
  };

  const onCompleteTransactionCreation = () => {
    if (transactionId) {
      navigation.reset({
        index: 1,
        routes: [{ name: "Multisig" }],
      });
    }
  };

  const displayProposal = (modalKind: SelectModalKind) => {
    if (data === undefined || data?.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please create Multisign wallet",
      });
      return;
    }
    setKind(modalKind);
    setOpenSelectMultiSignModal(true);
  };

  // returns
  const ListFooter = useCallback(
    () => (
      <>
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
              onPress={() =>
                displayProposal(SelectModalKind.ManagePublicProfile)
              }
            />
            <GetStartedOption
              variant="small"
              title="Create your first Post"
              icon={searchSVG}
              onPress={() => displayProposal(SelectModalKind.CreatePost)}
            />
            <GetStartedOption
              variant="small"
              title="Launch an NFT Collection"
              icon={launchSVG}
              onPress={() => displayProposal(SelectModalKind.LaunchNFT)}
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
                        name: `Multisig #${index + 1}`,
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
                  <ProposalTransactionItem {...item} isUserMultisig />
                </AnimationFadeIn>
              )}
              initialNumToRender={RESULT_SIZE}
              keyExtractor={(item) => item._id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.transactionListContent}
              ListFooterComponent={ListFooter}
              extraData={selectedWallet?.address}
              ListEmptyComponent={() =>
                isTransactionsLoading ? null : <EmptyList text="No proposals" />
              }
            />
          </View>
        </View>
      </ScrollView>
      <MultisigWalletSelectModal
        onClose={() => setOpenSelectMultiSignModal((value) => !value)}
        visible={openSelectMultiSignModal}
        data={data}
        callback={createProposal}
      />
      <CheckLoadingModal
        isVisible={isLoading}
        onComplete={onCompleteTransactionCreation}
      />
    </ScreenContainer>
  );
};
interface MultisigWalletSelectModalProps {
  visible: boolean;
  onClose: () => void;
  data: any;
  callback: (address: string) => void;
}

export const MultisigWalletSelectModal: React.FC<
  MultisigWalletSelectModalProps
> = ({ onClose, visible, data, callback }) => {
  const modalWidth = 448;
  const paddingWidth = layout.padding_x2_5;

  const styles = StyleSheet.create({
    itemBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.padding_x2,
      marginHorizontal: "auto",
    },
    walletName: StyleSheet.flatten([fontSemibold14, {}]),
    footer: {
      width: "100%",
      height: 20,
    },
    walletPress: {
      paddingTop: layout.padding_x2,
    },
  });

  return (
    <ModalBase
      visible={visible}
      onClose={() => onClose()}
      label="Select MultisigWallet"
      width={modalWidth}
      containerStyle={{ flexDirection: "column" }}
      childrenBottom={<View style={styles.footer} />}
    >
      {data?.map((item: any, index: number) => (
        <Pressable
          key={`pressable-${index}`}
          style={[
            styles.walletPress,
            { paddingTop: index === 0 ? 0 : layout.padding_x2 },
          ]}
          onPress={() => {
            callback(item.address);
            onClose();
          }}
        >
          <TertiaryBox
            mainContainerStyle={styles.itemBox}
            width={modalWidth - 2 * paddingWidth}
            key={index}
          >
            <BrandText style={styles.walletName}>
              Multisig #{index + 1}
            </BrandText>
            <BrandText style={styles.walletName}>
              {tinyAddress(item.address)}
            </BrandText>
          </TertiaryBox>
        </Pressable>
      ))}
    </ModalBase>
  );
};

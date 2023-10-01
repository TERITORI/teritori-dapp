import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { GetStartedOption } from "./components/GetStartedOption";
import multisigWalletSVG from "../../../assets/icons/organization/multisig-wallet.svg";
import postJobSVG from "../../../assets/icons/organization/post-job.svg";
import { JoinState } from "../../api/multisig/v1/multisig";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { AnimationFadeIn } from "../../components/animations/AnimationFadeIn";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import ModalBase from "../../components/modals/ModalBase";
import { LoginButton } from "../../components/multisig/LoginButton";
import { Transactions } from "../../components/multisig/Transactions";
import { SpacerColumn } from "../../components/spacer";
import { useUserMultisigs } from "../../hooks/multisig/useUserMultisigs";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCosmosNetwork, getUserId, NetworkKind } from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";
import { RootState } from "../../store/store";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral33, neutral77, secondaryColor } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";

enum SelectModalKind {
  LaunchNFT,
  CreatePost,
  ManagePublicProfile,
}

export const MultisigScreen: ScreenFC<"Multisig"> = () => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  // FIXME: remove StyleSheet.create
  // eslint-disable-next-line no-restricted-syntax
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: layout.topContentSpacingWithHeading,
    },
    horizontalContentPadding: {
      paddingHorizontal: layout.contentSpacing,
    },
    optionsScrollContent: {
      paddingHorizontal: layout.contentSpacing - layout.spacing_x2,
    },
    row: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -layout.spacing_x2,
      marginVertical: -layout.spacing_x2,
    },
    contentCenter: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: 135,
    },
    transactionListContent: {
      marginTop: layout.spacing_x2_5,
    },
  });
  const authToken = useSelector((state: RootState) =>
    selectMultisigToken(state, selectedWallet?.address)
  );

  const {
    multisigs: data,
    isLoading: isMultisigLoading,
    isFetching: isMultisigFetching,
  } = useUserMultisigs(selectedWallet?.userId, JoinState.JOIN_STATE_IN);

  const { multisigs: invitations } = useUserMultisigs(
    selectedWallet?.userId,
    JoinState.JOIN_STATE_OUT
  );

  const cosmosNetwork = getCosmosNetwork(selectedWallet?.networkId);

  const [openSelectMultiSignModal, setOpenSelectMultiSignModal] =
    useState<boolean>(false);
  const [kind] = useState<SelectModalKind>(SelectModalKind.LaunchNFT);

  /*
  const {
    isLoading,
    mutate,
    data: transactionId,
  } = useCreateMultisigTransactionForExecuteContract();
  */

  const createProposal = (address: string) => {
    if (kind === SelectModalKind.LaunchNFT) {
      // createProposalForLaunchNFT(address);
    } else if (kind === SelectModalKind.CreatePost) {
      // createProposalForCreatePost(address);
    } else if (kind === SelectModalKind.ManagePublicProfile) {
      // createProposalForManagePublicProfile(address);
    }
  };

  // const createProposalForLaunchNFT = async (address: string) => {
  //   const contractAddress = "CONTRACT_ADDR1";
  //   const mltisignAccountInfo = await getMultisigAccount(
  //     address,
  //     selectedWallet?.networkId!
  //   );
  //   if (mltisignAccountInfo?.accountData && mltisignAccountInfo.dbData._id) {
  //     mutate({
  //       formData: {
  //         contractAddress,
  //         multisigAddress: address,
  //         msg: { Execute: "CreateCollection" },
  //         funds: [], //TODO: How much funds ?
  //         multisigId: mltisignAccountInfo.dbData._id,
  //         type: MultisigTransactionType.LAUNCH_NFT_COLLECTION,
  //       },
  //       accountOnChain: mltisignAccountInfo?.accountData,
  //     });
  //   }
  // };

  /*
  const createProposalForCreatePost = async (
    queryClient: QueryClient,
    address: string
  ) => {
    const contractAddress = "CONTRACT_ADDR1";
    const mltisignAccountInfo = await getMultisigAccount(
      queryClient,
      address,
      selectedWallet?.networkId!
    );
    if (mltisignAccountInfo?.accountData && mltisignAccountInfo.dbData._id) {
      mutate({
        formData: {
          contractAddress,
          multisigAddress: address,
          msg: { Execute: "CreateCollection" },
          funds: [], //TODO: How much funds ?
          multisigId: mltisignAccountInfo.dbData._id,
          type: MultisigTransactionType.CREATE_NEW_POST,
        },
        accountOnChain: mltisignAccountInfo?.accountData,
      });
    }
  };
  */

  //address: multisign address
  /*
  const createProposalForManagePublicProfile = async (
    queryClient: QueryClient,
    address: string
  ) => {
    const contractAddress = "CONTRACT_ADDR1";
    const mltisignAccountInfo = await getMultisigAccount(
      queryClient,
      address,
      selectedWallet?.networkId!
    );
    if (mltisignAccountInfo?.accountData && mltisignAccountInfo.dbData._id) {
      mutate({
        formData: {
          contractAddress,
          multisigAddress: address,
          msg: { Execute: "CreateCollection" },
          funds: [], //TODO: How much funds ?
          multisigId: mltisignAccountInfo.dbData._id,
          type: MultisigTransactionType.MANAGE_PUBLIC_PROFILE,
        },
        accountOnChain: mltisignAccountInfo?.accountData,
      });
    }
  };
  */

  const onCompleteTransactionCreation = () => {
    /*
    if (transactionId) {
      navigation.reset({
        index: 1,
        routes: [{ name: "Multisig" }],
      });
    }
    */
  };

  return (
    <ScreenContainer
      headerChildren={<BrandText>Multisig Wallets</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      onBackPress={() => navigation.navigate("Multisig")}
      noScroll
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.horizontalContentPadding}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BrandText style={fontSemibold28}>My Multisigs</BrandText>
              <LoginButton userId={selectedWallet?.userId} />
            </View>
            <SpacerColumn size={1.5} />
            <BrandText style={[fontSemibold16, { color: neutral77 }]}>
              Overview of your Multisignatures Wallets
            </BrandText>
            <SpacerColumn size={2.5} />
            <FlatList
              data={data}
              horizontal
              keyExtractor={(item) => item.address}
              renderItem={({ item, index }) => (
                <AnimationFadeIn delay={index * 50}>
                  <GetStartedOption
                    variant="small"
                    title={
                      item.name || `Multisig #${(data?.length || 0) - index}`
                    }
                    icon={multisigWalletSVG}
                    isBetaVersion
                    onPress={() =>
                      navigation.navigate("MultisigWalletDashboard", {
                        id: getUserId(selectedWallet?.networkId, item.address),
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
                  disabled={!authToken}
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
          {!!invitations?.length && (
            <>
              <View style={styles.horizontalContentPadding}>
                <BrandText style={fontSemibold28}>Invitations</BrandText>
                <SpacerColumn size={1.5} />
                <BrandText style={[fontSemibold16, { color: neutral77 }]}>
                  Multisignatures Wallets you did not join yet
                </BrandText>
                <SpacerColumn size={2.5} />
                <FlatList
                  data={invitations}
                  horizontal
                  keyExtractor={(item) => item.address}
                  renderItem={({ item, index }) => (
                    <AnimationFadeIn delay={index * 50}>
                      <GetStartedOption
                        variant="small"
                        title={
                          item.name ||
                          `Multisig #${(invitations?.length || 0) - index}`
                        }
                        icon={multisigWalletSVG}
                        isBetaVersion
                        onPress={() =>
                          navigation.navigate("MultisigWalletDashboard", {
                            id: getUserId(
                              selectedWallet?.networkId,
                              item.address
                            ),
                          })
                        }
                        subtitle={tinyAddress(item.address, 21)}
                        titleStyle={{ color: secondaryColor }}
                      />
                    </AnimationFadeIn>
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
            </>
          )}
          {!!authToken && (
            <View style={styles.horizontalContentPadding}>
              <Separator color={neutral33} />
              <SpacerColumn size={3} />
              <Transactions
                userAddress={selectedWallet?.address}
                chainId={cosmosNetwork?.chainId}
                title="Multisig Transactions Overview"
              />
            </View>
          )}
        </View>
      </ScrollView>
      <MultisigWalletSelectModal
        onClose={() => setOpenSelectMultiSignModal((value) => !value)}
        visible={openSelectMultiSignModal}
        data={data}
        callback={createProposal}
      />
      <CheckLoadingModal
        isVisible={/*isLoading*/ false}
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

const MultisigWalletSelectModal: React.FC<MultisigWalletSelectModalProps> = ({
  onClose,
  visible,
  data,
  callback,
}) => {
  const modalWidth = 448;
  const paddingWidth = layout.spacing_x2_5;
  // FIXME: remove StyleSheet.create
  // eslint-disable-next-line no-restricted-syntax
  const styles = StyleSheet.create({
    itemBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.spacing_x2,
      marginHorizontal: "auto",
    },
    walletName: StyleSheet.flatten([fontSemibold14, {}]),
    footer: {
      width: "100%",
      height: 20,
    },
    walletPress: {
      paddingTop: layout.spacing_x2,
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
            { paddingTop: index === 0 ? 0 : layout.spacing_x2 },
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

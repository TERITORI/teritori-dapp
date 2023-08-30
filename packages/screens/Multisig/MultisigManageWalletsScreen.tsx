import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ScrollView, View, ViewStyle } from "react-native";

import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { InputMultisigAddressModal } from "./components/InputMultisigAddressModal";
import { MultisigWalletItem } from "./components/MultisigWalletItem";
import { UserWalletType } from "./types";
import {
  GetMultisigQueryVariables,
  useGetMultisigQuery,
  useGetUserMultisigsQuery,
} from "../../api/multisig";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { TableRow, TableRowHeading } from "../../components/table";
import { useMultisigContext } from "../../context/MultisigReducer";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, mustGetCosmosNetwork } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MULTISIG_WALLET_HEADING: { [key in string]: TableRowHeading } = {
  id: {
    label: "#",
    flex: 2,
  },
  name: {
    label: "Wallet Name",
    flex: 2,
  },
  asset_type: {
    label: "Asset Type",
    flex: 3,
  },
  multisig_addr: {
    label: "MultisignAddress",
    flex: 3,
  },
  actions: {
    label: "",
    flex: 2,
  },
};

const setToastError = (arg0: { title: string; message: string }) => {
  throw new Error("Function not implemented.");
};

export const MultisigManageWalletsScreen: ScreenFC<
  "MultisigWalletsManage"
> = () => {
  const navigation = useAppNavigation();
  const [isInputMultisigAddressVisible, setInputMultisigAddressVisible] =
    useState(false);
  const queryClient = useQueryClient();

  const { mutate, isLoading, data: multisigData } = useCreateUserWallet();
  const { state } = useMultisigContext();
  const { selectedWallet: walletAccount } = useSelectedWallet();

  const [multisigList, setMultisigList] = useState<UserWalletType[]>([]);

  useEffect(() => {
    const getMultisigList = async () => {
      if (
        state.chain?.chainId &&
        state.chain?.addressPrefix &&
        walletAccount?.address
      ) {
        const userAddress = walletAccount?.address;
        const network = mustGetCosmosNetwork(walletAccount.networkId);
        const { multisigs } = await faunaDbQuery(
          useGetUserMultisigsQuery,
          queryClient,
          {
            chainId: network.chainId,
            userAddress: walletAccount.address,
            size: 200,
            before: null,
          }
        );
        const retArr: UserWalletType[] = [];
        if (multisigs) {
          multisigs.map((item) => {
            retArr.push({
              multisigId: item._id,
              multisigAddress: item.address,
              userAddress,
              multisigUserAddresses: item.userAddresses || [],
              chainId: network.chainId,
              walletName: item.name || "",
            });
          });
          setMultisigList(retArr);
        }
      }
    };
    getMultisigList();
  }, [
    queryClient,
    state.chain?.addressPrefix,
    state.chain?.chainId,
    walletAccount?.address,
    walletAccount?.networkId,
  ]);

  // returns
  return (
    <ScreenContainer
      isHeaderSmallMargin
      headerChildren={
        <BrandText style={fontSemibold20}>Manage Multisig Wallets</BrandText>
      }
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Multisig")
      }
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          padding: layout.contentPadding,
          paddingTop: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: layout.padding_x1,
            borderColor: neutral33,
            borderBottomWidth: 1,
            width: "100%",
          }}
        >
          <View style={rowSBStyle}>
            <BrandText style={fontSemibold20}>Wallets</BrandText>
            <SpacerRow size={1} />
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              {multisigList.length}
            </BrandText>
          </View>
          <View style={rowSBStyle}>
            <SecondaryButton
              text="Add existing Wallet"
              size="M"
              onPress={() => setInputMultisigAddressVisible(true)}
            />
            <SpacerRow size={2} />
            <PrimaryButton
              text="Create Multisig Wallet"
              size="M"
              onPress={() => navigation.navigate("MultisigCreate")}
            />
          </View>
        </View>
        <SpacerColumn size={2.5} />
        <TableRow
          headings={Object.values(MULTISIG_WALLET_HEADING)}
          showBrokenCorner
          style={{
            backgroundColor: neutral00,
            minHeight: 44,
          }}
        />
        {multisigList.map((wallet, index) => (
          <MultisigWalletItem
            data={wallet}
            key={`multisig-index-${index}`}
            onPressTransactions={() =>
              navigation.navigate("MultisigWIPTransactions", {
                address: wallet.multisigAddress,
                walletName: wallet.walletName,
              })
            }
          />
        ))}
      </ScrollView>
      <InputMultisigAddressModal
        isVisible={isInputMultisigAddressVisible}
        networkId={process.env.TERITORI_NETWORK_ID || ""}
        onClose={() => setInputMultisigAddressVisible(false)}
        onConfirm={async (walletName, address) => {
          if (
            state.chain?.chainId &&
            state.chain?.addressPrefix &&
            walletAccount?.address
          ) {
            const chainId = state.chain.chainId;
            const vars: GetMultisigQueryVariables = { address, chainId };
            const res = await queryClient.fetchQuery(
              useGetMultisigQuery.getKey(vars),
              useGetMultisigQuery.fetcher(
                {
                  endpoint: "https://graphql.eu.fauna.com/graphql",
                  fetchParams: {
                    headers: {
                      Authorization: `Bearer ${process.env.FAUNADB_SECRET}`,
                    },
                  },
                },
                vars
              )
            );
            if (!res.multisig) {
              setToastError({
                title: "Invalid Multisig address",
                message:
                  "Multisig has no pubkey on node, and was not created using this tool.",
              });
              return;
            }
            setInputMultisigAddressVisible(false);

            const multisigId = res.multisig._id;
            const userAddress = walletAccount?.address;
            mutate({
              chainId,
              walletName,
              userAddress,
              multisigId,
            });
          }
        }}
      />
      <CheckLoadingModal
        isVisible={isLoading}
        onComplete={() => {
          if (multisigData) {
            setMultisigList([...multisigList, multisigData!]);
          }
        }}
      />
    </ScreenContainer>
  );
};

const rowSBStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

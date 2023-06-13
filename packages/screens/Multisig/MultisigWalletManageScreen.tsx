import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { InputMultisigAddressModal } from "./components/InputMultisigAddressModal";
import { MultisigWalletItem } from "./components/MultisigWalletItem";
import { UserWalletType } from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { TableRow, TableRowHeading } from "../../components/table";
import { useMultisigContext } from "../../context/MultisigReducer";
import { useCreateUserWallet } from "../../hooks/multisig";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getMultisig,
  getMultisigsByUserWallet,
} from "../../utils/founaDB/multisig/multisigGraphql";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
// import data from "./multisig-wallet.json";

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

export const MultisigWalletManageScreen = () => {
  const navigation = useAppNavigation();
  const [isInputMultisigAddressVisible, setInputMultisigAddressVisible] =
    useState(false);

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
        const chainId = state.chain.chainId;
        const res = await getMultisigsByUserWallet(userAddress, chainId);
        const retArr: UserWalletType[] = [];
        if (res.data.data.getMultisigsByUser) {
          res.data.data.getMultisigsByUser.data.map((item: any) => {
            retArr.push({
              multisigId: item.multisig._id,
              multisigAddress: item.multisig.address,
              userAddress,
              multisigUserAddresses: item.multisig.userAddresses,
              chainId,
              walletName: item.walletName,
            } as UserWalletType);
          });
          setMultisigList(retArr);
        }
      }
    };
    getMultisigList();
  }, [walletAccount, state.chain.chainId, state.chain?.addressPrefix]);

  // returns
  return (
    <ScreenContainer
      isHeaderSmallMargin
      headerChildren={<BackTo label="Manage Multisig Wallet" />}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.rowSB}>
            <BrandText style={fontSemibold20}>Wallet</BrandText>
            <SpacerRow size={1} />
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              {multisigList.length}
            </BrandText>
          </View>
          <View style={styles.rowSB}>
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
          style={styles.tableRow}
        />
        {multisigList.map((wallet, index) => (
          <MultisigWalletItem
            data={wallet}
            key={`multisig-index-${index}`}
            onPressTransactions={() =>
              navigation.navigate("MultisigWalletTransaction")
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
            const res = await getMultisig(address, chainId);
            if (!res.data.data.getMultisig) {
              setToastError({
                title: "Invalid Multisig address",
                message:
                  "Multisig has no pubkey on node, and was not created using this tool.",
              });
              return;
            }
            setInputMultisigAddressVisible(false);

            const multisigId = res.data.data.getMultisig._id;
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: layout.contentPadding, paddingTop: 0 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: layout.padding_x1,
    borderColor: neutral33,
    borderBottomWidth: 1,
    width: "100%",
  },
  rowSB: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableRow: {
    backgroundColor: neutral00,
    minHeight: 44,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
});
function setToastError(arg0: { title: string; message: string }) {
  throw new Error("Function not implemented.");
}

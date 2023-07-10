import React, { useEffect, useState } from "react";

import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { MultisigTransactionForm } from "./components/MultisigTransactionForm";
import { SignTransactionModal } from "./components/SignTransactionModal";
import {
  MultisigTransactionDelegateFormType,
  MultisigTransactionType,
} from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import {
  useCreateMultisigTransaction,
  useGetMultisigAccount,
} from "../../hooks/multisig";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";

export const MultisigTransferScreen: ScreenFC<"MultisigTransfer"> = ({
  route,
}) => {
  const navigation = useAppNavigation();
  const { selectedWallet } = useSelectedWallet();
  const [isTransactionVisible, setIsTransactionVisible] = useState(false);
  const {
    isLoading: createLoading,
    mutate,
    data: transactionId,
  } = useCreateMultisigTransaction();
  const { address, walletName } = route.params;
  const { data, isLoading } = useGetMultisigAccount(address);
  const [formData, setFormData] =
    useState<MultisigTransactionDelegateFormType>();

  // Leave screen if no wallet found from URL address, no name or if the user haven't this wallet
  useEffect(() => {
    if (
      !isLoading &&
      (!walletName ||
        !data ||
        !data?.dbData.userAddresses.find(
          (address) => address === selectedWallet?.address
        ))
    ) {
      navigation.navigate("MultisigWalletDashboard", {
        address,
        walletName,
      });
    }
  }, [
    isLoading,
    data,
    selectedWallet?.address,
    address,
    navigation,
    walletName,
  ]);

  // functions
  const toggleTransactionModal = () =>
    setIsTransactionVisible(!isTransactionVisible);

  const onSubmitForm = (formData: MultisigTransactionDelegateFormType) => {
    setFormData(formData);
    toggleTransactionModal();
  };

  const handleCreate = () => {
    toggleTransactionModal();

    if (data?.accountData && formData && data.dbData._id) {
      mutate({
        formData: {
          ...formData,
          multisigId: data.dbData._id,
          type: MultisigTransactionType.TRANSFER,
        },
        accountOnChain: data?.accountData[1],
      });
    }
  };

  const onCompleteCreation = () => {
    if (transactionId) {
      navigation.reset({
        index: 1,
        routes: [
          { name: "Multisig" },
          {
            name: "MultisigTransactions",
            params: {
              address,
              walletName: "Multisig Dashboard",
            },
          },
        ],
      });
    }
  };

  // returns
  return (
    <ScreenContainer
      headerChildren={
        <BrandText style={fontSemibold20}>New Transfer</BrandText>
      }
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("MultisigWalletDashboard", {
              walletName,
              address,
            })
      }
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <MultisigTransactionForm
        type="transfer"
        title={`Create a new Transfer from ${walletName}`}
        transferText="Send to"
        submitBtnText="Create Transaction"
        onSubmit={onSubmitForm}
      />

      <SignTransactionModal
        isVisible={isTransactionVisible}
        onCancel={toggleTransactionModal}
        onConfirm={handleCreate}
        amount={formData?.amount}
        address={address}
      />

      <CheckLoadingModal
        isVisible={createLoading}
        onComplete={onCompleteCreation}
      />
    </ScreenContainer>
  );
};

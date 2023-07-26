import React, { useState } from "react";

import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { MultisigTransactionForm } from "./components/MultisigTransactionForm";
import { SignTransactionModal } from "./components/SignTransactionModal";
import { MultisigTransactionDelegateFormType } from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import {
  useMultisigProposeSend,
  useGetMultisigAccount,
} from "../../hooks/multisig";
import { NetworkKind, parseUserId } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";

export const MultisigTransferScreen: ScreenFC<"MultisigTransfer"> = ({
  route,
}) => {
  const navigation = useAppNavigation();
  const [isTransactionVisible, setIsTransactionVisible] = useState(false);
  const {
    isLoading: createLoading,
    mutate,
    data: transactionId,
  } = useMultisigProposeSend();
  const { address: multisigId, walletName } = route.params;
  const [, address] = parseUserId(multisigId);
  const { data } = useGetMultisigAccount(multisigId);
  const [formData, setFormData] =
    useState<MultisigTransactionDelegateFormType>();

  // functions
  const toggleTransactionModal = () =>
    setIsTransactionVisible(!isTransactionVisible);

  const onSubmitForm = (formData: MultisigTransactionDelegateFormType) => {
    setFormData(formData);
    toggleTransactionModal();
  };

  const handleCreate = () => {
    toggleTransactionModal();

    console.log("handle create", data?.accountData, formData);

    if (!data?.accountData || !formData) {
      throw new Error("Missing data");
    }

    mutate({
      formData: {
        ...formData,
        multisigId,
      },
      accountOnChain: data?.accountData[0],
    });
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
              id: address,
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

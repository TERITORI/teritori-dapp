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
  useCreateMultisigDelegate,
  useGetMultisigAccount,
} from "../../hooks/multisig";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";

export const MultisigDelegateScreen: ScreenFC<"MultisigDelegate"> = ({
  route,
}) => {
  const navigation = useAppNavigation();
  const { selectedWallet } = useSelectedWallet();
  const [isTransactionVisible, setIsTransactionVisible] = useState(false);
  const {
    isLoading: createLoading,
    mutate,
    data: transactionId,
  } = useCreateMultisigDelegate();
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
        id: address, // TODO
      });
    }
  }, [
    isLoading,
    data,
    selectedWallet?.address,
    address,
    walletName,
    navigation,
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
          type: MultisigTransactionType.STAKE,
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
              walletName,
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
        <BrandText style={fontSemibold20}>New Delegation</BrandText>
      }
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("MultisigWalletDashboard", {
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
        type="delegate"
        title={`Create a new Delegation from ${walletName}`}
        transferText="Delegate to"
        submitBtnText="Delegate"
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

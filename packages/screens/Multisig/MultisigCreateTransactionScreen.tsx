import React, { useState } from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { useCreateMultisigTransaction } from "../../hooks/useCreateMultisigTransaction";
import { useGetMultisigAccount } from "../../hooks/useGetMultisigAccount";
import { ScreenFC } from "../../utils/navigation";
import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { MultisigTranscationDelegateForm } from "./components/MultisigTranscationDelegateForm";
import { SignTransactionModal } from "./components/SignTransactionModal";
import {
  MultisigTransactionDelegateFormType,
  MultisigTransactionType,
} from "./types";

export const MultisigCreateTransactionScreen: ScreenFC<
  "MultisigCreateTransaction"
> = ({ route, navigation }) => {
  // variables
  const [isTransactionVisible, setIsTransactionVisible] = useState(false);
  const {
    isLoading,
    mutate,
    data: transactionId,
  } = useCreateMultisigTransaction();
  const { address } = route.params;
  const { data } = useGetMultisigAccount(address);
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

    if (data?.accountData && formData && data.id) {
      mutate({
        formData: {
          ...formData,
          multisigId: data.id,
          type: MultisigTransactionType.TRANSFER,
        },
        accountOnChain: data?.accountData[1],
      });
    }
  };

  const onCompleteCreation = () => {
    if (transactionId) {
      navigation.navigate("MultisigTransactionProposal", {
        address,
      });
    }
  };

  // returns
  return (
    <ScreenContainer
      headerChildren={<BackTo label="Multisig Legacy" />}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
    >
      <MultisigTranscationDelegateForm
        type="transfer"
        title="Create a New Transaction"
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
        isVisible={isLoading}
        onComplete={onCompleteCreation}
      />
    </ScreenContainer>
  );
};

import React, { useState } from "react";

import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { MultisigTransactionForm } from "./components/MultisigTransactionForm";
import { SignTransactionModal } from "./components/SignTransactionModal";
import {
  MultisigTransactionDelegateFormType,
  MultisigTransactionType,
} from "./types";
import { ScreenContainer } from "../../components/ScreenContainer";
import {
  useCreateMultisigDelegate,
  useGetMultisigAccount,
} from "../../hooks/multisig";
import { ScreenFC } from "../../utils/navigation";

export const MultisigDelegateScreen: ScreenFC<"MultisigDelegate"> = ({
  route,
  navigation,
}) => {
  const [isTransactionVisible, setIsTransactionVisible] = useState(false);
  const {
    isLoading,
    mutate,
    data: transactionId,
  } = useCreateMultisigDelegate();
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
            name: "MultisigTransactionProposal",
            params: {
              address,
              backText: "Multisig Dashboard",
            },
          },
        ],
      });
    }
  };

  // returns
  return (
    <ScreenContainer
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
    >
      <MultisigTransactionForm
        type="delegate"
        title="Create a New Transaction"
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
        isVisible={isLoading}
        onComplete={onCompleteCreation}
      />
    </ScreenContainer>
  );
};

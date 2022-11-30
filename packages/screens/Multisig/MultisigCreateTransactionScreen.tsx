import React, { useState } from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { MultisigTranscationDelegateForm } from "./components/MultisigTranscationDelegateForm";
import { SignTransactionModal } from "./components/SignTransactionModal";

export const MultisigCreateTransactionScreen = () => {
  // variables
  const [isTransactionVisible, setIsTransactionVisible] = useState(false);

  // functions
  const toggleTransactionModal = () =>
    setIsTransactionVisible(!isTransactionVisible);

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
        title="Create a New Transaction"
        transferText="Send to"
        submitBtnText="Create Transaction"
        onSubmit={toggleTransactionModal}
        isDisabled
      />

      <SignTransactionModal
        isVisible={isTransactionVisible}
        onCancel={toggleTransactionModal}
      />
    </ScreenContainer>
  );
};

import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { MultisigTranscationDelegateForm } from "./components/MultisigTranscationDelegateForm";

export const MultisigDelegateScreen = () => {
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
        transferText="Delegate to"
        submitBtnText="Delegate"
        onSubmit={console.log}
      />
    </ScreenContainer>
  );
};

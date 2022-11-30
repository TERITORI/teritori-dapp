import React from "react";

import { BrandText } from "../../../components/BrandText";
import ModalBase from "../../../components/modals/ModalBase";
type DepositProposalModalProps = {
  isVisible?: boolean;
  onClose: () => void;
  numberProposal: string;
};

// TODO:

export const DepositProposalModal: React.FC<DepositProposalModalProps> = ({
  isVisible,
  onClose,
  numberProposal,
}) => {
  return (
    <ModalBase
      onClose={onClose}
      label="Your vote"
      visible={isVisible}
      width={372}
    >
      <BrandText
        style={{
          fontSize: 14,
          color: "#777777",
        }}
      >
        {numberProposal}
      </BrandText>
    </ModalBase>
  );
};

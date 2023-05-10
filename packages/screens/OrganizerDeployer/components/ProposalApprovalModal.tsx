import React from "react";
import { FlatList, useWindowDimensions } from "react-native";

import { ProposalTransactionItem } from "./ProposalTransactionItem";
import GradientModalBase from "../../../components/modals/GradientModalBase";
import { neutral17 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import multisigDataTransactions from "../multisig-proposal-transaction.json";
import { ProposalsTransactionType } from "../types";

type ProposalApprovalModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export const ProposalApprovalModal: React.FC<ProposalApprovalModalProps> = ({
  visible,
  onRequestClose,
}) => {
  // variables
  const { width } = useWindowDimensions();

  // returns
  return (
    <GradientModalBase
      visible={visible}
      onClose={onRequestClose}
      modalStatus="dark"
      label="Approval Transactions"
      width={width - layout.contentPadding * 2}
      hideMainSeparator
      scrollable
    >
      <FlatList
        data={
          multisigDataTransactions.slice(0, 2) as ProposalsTransactionType[]
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProposalTransactionItem
            {...item}
            btnSquaresBackgroundColor={neutral17}
          />
        )}
      />
    </GradientModalBase>
  );
};

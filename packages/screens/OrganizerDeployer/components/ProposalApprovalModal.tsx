import React from "react";
import { FlatList, useWindowDimensions } from "react-native";

import GradientModalBase from "../../../components/modals/GradientModalBase";
import { MultisigTransactionListType } from "../../../hooks/multisig";
import { neutral17 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { ProposalTransactionItem } from "./ProposalTransactionItem";

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
        data={[] as MultisigTransactionListType[]}
        keyExtractor={(item) => item._id.toString()}
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

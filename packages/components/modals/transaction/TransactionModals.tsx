import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import React, { useState } from "react";

import { NFTInfo } from "../../../screens/Marketplace/NFTDetailScreen";
import { TransactionPaymentModal } from "./TransactionPaymentModal";
import { TransactionPendingModal } from "./TransactionPendingModal";
import { TransactionSuccessModal } from "./TransactionSuccessModal";

// this hook is used to open modals from parents components. All the flow progress is handled by TransactionModals props.
export const useTransactionModals = () => {
  const [transactionPaymentModalVisible, setTransactionPaymentModalVisible] =
    useState(false);
  // The parents just want to open this modals flow. You can use openTransactionModals from the parents
  const openTransactionModals = () => {
    setTransactionPaymentModalVisible(true);
  };
  return {
    openTransactionModals,
    transactionPaymentModalVisible,
    setTransactionPaymentModalVisible,
  };
};

// It concerns only NFTs for now TODO: More global for all types of transaction ? This design could be used for all transactions ? Better to use ContextAPI instead of useTransactionModals hook ?
export const TransactionModals: React.FC<{
  startTransaction: () => Promise<ExecuteResult | undefined>;
  nftInfo?: NFTInfo;
  textComponentPayment: JSX.Element;
  textComponentSuccess: JSX.Element;
}> = ({
  startTransaction,
  nftInfo,
  textComponentPayment,
  textComponentSuccess,
}) => {
  const { transactionPaymentModalVisible, setTransactionPaymentModalVisible } =
    useTransactionModals();
  const [transactionPendingModalVisible, setTransactionPendingModalVisible] =
    useState(false);
  const [transactionSuccessModalVisible, setTransactionSuccessModalVisible] =
    useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const handleStartTransaction = async () => {
    setTransactionPaymentModalVisible(false);
    setTransactionPendingModalVisible(true);
    startTransaction().then((reply) => {
      if (!reply) {
        setTransactionPendingModalVisible(false);
      } else {
        setTransactionHash(reply?.transactionHash || "");
        setTransactionPendingModalVisible(false);
        setTransactionSuccessModalVisible(true);
      }
    });
  };

  return (
    <>
      {/* ----- Modal to process payment*/}
      <TransactionPaymentModal
        onPressProceed={handleStartTransaction}
        onClose={() => setTransactionPaymentModalVisible(false)}
        visible={transactionPaymentModalVisible}
        price={nftInfo?.price}
        priceDenom={nftInfo?.priceDenom}
        label="Checkout"
        textComponent={textComponentPayment}
      />

      {/* ----- Modal with loader, waiting for wallet approbation*/}
      <TransactionPendingModal
        operationLabel="Purchase"
        visible={transactionPendingModalVisible}
        onClose={() => setTransactionPendingModalVisible(false)}
      />

      {/* ----- Success modal*/}
      <TransactionSuccessModal
        transactionHash={transactionHash}
        visible={transactionSuccessModalVisible}
        textComponent={textComponentSuccess}
        onClose={() => setTransactionSuccessModalVisible(false)}
      />
    </>
  );
};

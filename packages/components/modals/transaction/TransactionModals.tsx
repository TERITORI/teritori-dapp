import React, { useState } from "react";

import { useTransactionModals } from "../../../context/TransactionModalsProvider";
import { NFTInfo } from "../../../screens/Marketplace/NFTDetailScreen";
import { TransactionPaymentModal } from "./TransactionPaymentModal";
import { TransactionPendingModal } from "./TransactionPendingModal";
import { TransactionSuccessModal } from "./TransactionSuccessModal";

// It concerns only NFTs for now TODO: More global for all types of transaction ? This design could be used for all transactions ? Better to use ContextAPI instead of useTransactionModals hook ?
export const TransactionModals: React.FC<{
  startTransaction: () => Promise<string | undefined>;
  nftInfo?: NFTInfo;
  textComponentPayment: JSX.Element;
  textComponentSuccess: JSX.Element;
}> = ({
  startTransaction,
  nftInfo,
  textComponentPayment,
  textComponentSuccess,
}) => {
  const { transactionPaymentModalVisible, closeTransactionPaymentModal } =
    useTransactionModals();
  const [transactionPendingModalVisible, setTransactionPendingModalVisible] =
    useState(false);
  const [transactionSuccessModalVisible, setTransactionSuccessModalVisible] =
    useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const handleStartTransaction = async () => {
    closeTransactionPaymentModal();
    setTransactionPendingModalVisible(true);
    startTransaction().then((txHash) => {
      if (!txHash) {
        setTransactionPendingModalVisible(false);
      } else {
        setTransactionHash(txHash);
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
        onClose={closeTransactionPaymentModal}
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

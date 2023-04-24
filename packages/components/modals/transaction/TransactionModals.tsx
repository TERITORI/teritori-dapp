import React, { useState } from "react";

import { TransactionPaymentModal } from "./TransactionPaymentModal";
import { TransactionPendingModal } from "./TransactionPendingModal";
import { TransactionSuccessModal } from "./TransactionSuccessModal";
import { useTransactionModals } from "../../../context/TransactionModalsProvider";
import { useNFTInfo } from "../../../hooks/useNFTInfo";

// It concerns only NFTs for now TODO: More global for all types of transaction ? This design could be used for all transactions ? Better to use ContextAPI instead of useTransactionModals hook ?
export const TransactionModals: React.FC<{
  startTransaction: () => Promise<string | undefined>;
  nftId: string;
  textComponentPayment: JSX.Element;
  textComponentSuccess: JSX.Element;
}> = ({
  startTransaction,
  nftId,
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
  const { info: nftInfo } = useNFTInfo(nftId);

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
      {!!nftInfo && (
        <TransactionPaymentModal
          onPressProceed={handleStartTransaction}
          onClose={closeTransactionPaymentModal}
          visible={transactionPaymentModalVisible}
          nftId={nftId}
          price={nftInfo.price}
          priceDenom={nftInfo.priceDenom}
          label="Checkout"
          textComponent={textComponentPayment}
        />
      )}

      {/* ----- Modal with loader, waiting for wallet approbation*/}
      <TransactionPendingModal
        operationLabel="Purchase"
        visible={transactionPendingModalVisible}
        onClose={() => setTransactionPendingModalVisible(false)}
      />

      {/* ----- Success modal*/}
      <TransactionSuccessModal
        networkId={nftInfo?.networkId}
        transactionHash={transactionHash}
        visible={transactionSuccessModalVisible}
        textComponent={textComponentSuccess}
        onClose={() => setTransactionSuccessModalVisible(false)}
      />
    </>
  );
};

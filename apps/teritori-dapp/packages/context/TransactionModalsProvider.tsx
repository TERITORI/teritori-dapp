import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type TransactionModalsContextValue = {
  visible: boolean;
  setVisible: (value: boolean) => void;
};

const transactionModalContext =
  React.createContext<TransactionModalsContextValue>({
    visible: false,
    setVisible: () => {},
  });

export const TransactionModalsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const value = useMemo(() => {
    return {
      visible,
      setVisible,
    };
  }, [visible]);
  return (
    <transactionModalContext.Provider value={value}>
      {children}
    </transactionModalContext.Provider>
  );
};

// this hook is used to open modals from parents components. All the flow progress is handled by TransactionModals props.
export const useTransactionModals = () => {
  const {
    visible: transactionPaymentModalVisible,
    setVisible: setTransactionPaymentModalVisible,
  } = useContext(transactionModalContext);
  // The parents just want to open this modals flow. You can use openTransactionModals from the parents
  const openTransactionModals = useCallback(() => {
    setTransactionPaymentModalVisible(true);
  }, [setTransactionPaymentModalVisible]);
  const closeTransactionPaymentModal = useCallback(() => {
    setTransactionPaymentModalVisible(false);
  }, [setTransactionPaymentModalVisible]);
  return {
    openTransactionModals,
    transactionPaymentModalVisible,
    closeTransactionPaymentModal,
  };
};

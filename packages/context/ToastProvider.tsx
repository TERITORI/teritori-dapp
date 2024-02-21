import { ReactNode, createContext, useContext, useState } from "react";

import { MiniToastProps, MiniToast } from "@/components/MiniToast";

interface InitailValues {
  toast: MiniToastProps;
  setToast: (data: MiniToastProps) => void;
}

const initialValues: InitailValues = {
  toast: {},
  setToast: () => {},
};

const ToastContext = createContext(initialValues);

export const useToast = () => useContext(ToastContext);

export const ToastContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<MiniToastProps>(initialValues.toast);

  return (
    <ToastContext.Provider value={{ setToast, toast }}>
      <MiniToast {...toast} />
      {children}
    </ToastContext.Provider>
  );
};

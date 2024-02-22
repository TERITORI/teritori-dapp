import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { MiniToastProps, MiniToast } from "@/components/MiniToast";

interface DefaultValues {
  toast: MiniToastProps;
  setToast: (data: MiniToastProps) => void;
}

const defaultValues: DefaultValues = {
  toast: { message: "" },
  setToast: () => {},
};

const ToastContext = createContext(defaultValues);

export const useToast = () => useContext(ToastContext);

export const ToastContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<MiniToastProps>(defaultValues.toast);

  useEffect(() => {
    //always show toast when showAlways flag is enabled or status is loading
    if (!toast.showAlways && toast.status !== "loading") {
      const timeoutID = setTimeout(() => {
        setToast(defaultValues.toast);
      }, toast.duration || 5000);

      return () => clearTimeout(timeoutID);
    }
  }, [toast]);
  return (
    <ToastContext.Provider value={{ setToast, toast }}>
      <MiniToast {...toast} />
      {children}
    </ToastContext.Provider>
  );
};

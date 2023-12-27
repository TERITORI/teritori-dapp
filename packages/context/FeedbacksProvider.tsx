import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { LoaderFullScreen } from "../components/loaders/LoaderFullScreen";
import { Toast, ToastType } from "../components/toasts/Toast";

interface ToastMessage {
  title: string;
  message: string;
  duration?: number;
  onPress?: () => void;
  type: ToastType;
}

const initialToast: ToastMessage = {
  title: "",
  message: "",
  duration: 8000,
  type: "error",
};

interface FeedbacksProviderValue {
  toast: ToastMessage;
  setToastError: (error: ToastMessage) => void;
  setToastSuccess: (info: ToastMessage) => void;
  loadingFullScreen: boolean;
  setLoadingFullScreen: (loading: boolean) => void;
  wrapWithFeedback: (
    cb: () => Promise<void>,
    success?: { title: string; message?: string },
    errorTransform?: (err: unknown) => { title: string; message?: string },
  ) => () => Promise<void>;
}
const defaultValue: FeedbacksProviderValue = {
  toast: initialToast,
  setToastError: () => {},
  setToastSuccess: () => {},
  loadingFullScreen: false,
  setLoadingFullScreen: () => {},
  wrapWithFeedback: () => async () => {},
};

const FeedbacksContext = createContext(defaultValue);

export const FeedbacksContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [toast, setToast] = useState(initialToast);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setToast(initialToast);
    }, toast.duration || 8000);

    return () => clearTimeout(timeoutID);
  }, [toast]);

  const wrapWithFeedback: FeedbacksProviderValue["wrapWithFeedback"] =
    useCallback(
      (
        cb,
        success = { title: "Success", message: "" },
        errorTransform = (err) => {
          console.error(err);
          return {
            title: "Error",
            message: err instanceof Error ? err.message : `${err}`,
          };
        },
      ) => {
        return async () => {
          try {
            await cb();
            setToast({ message: "", ...success, type: "success" });
          } catch (err) {
            setToast({ message: "", ...errorTransform(err), type: "error" });
          }
        };
      },
      [],
    );

  return (
    <FeedbacksContext.Provider
      value={{
        toast,
        loadingFullScreen,
        setLoadingFullScreen,
        setToastError: (params) => setToast({ ...params, type: "error" }),
        setToastSuccess: (params) => setToast({ ...params, type: "success" }),
        wrapWithFeedback,
      }}
    >
      {/*==== Loader full screen*/}
      <LoaderFullScreen visible={loadingFullScreen} />
      {/*==== Toasts*/}
      {toast && toast.title ? (
        <Toast
          onPress={() => setToast(initialToast)}
          title={toast.title}
          message={toast.message}
          type={toast.type}
        />
      ) : null}

      {/*==== Page content*/}
      {children}
    </FeedbacksContext.Provider>
  );
};

export const useFeedbacks = () => useContext(FeedbacksContext);

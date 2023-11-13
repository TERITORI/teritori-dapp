import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { LoaderFullScreen } from "../components/loaders/LoaderFullScreen";
import { ToastError } from "../components/toasts/ToastError";
import { ToastSuccess } from "../components/toasts/ToastSuccess";

interface ToastMessage {
  title: string;
  message: string;
  duration?: number;
  onPress?: () => void;
}
export const initialToastError: ToastMessage = {
  title: "",
  message: "",
  duration: 8000,
};
const initialToastSuccess: ToastMessage = {
  title: "",
  message: "",
  duration: 8000,
};

interface FeedbacksProviderValue {
  toastError: ToastMessage;
  setToastError: (error: ToastMessage) => void;
  toastSuccess: ToastMessage;
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
  toastError: initialToastError,
  setToastError: () => {},
  toastSuccess: initialToastSuccess,
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
  const [toastError, setToastError] = useState(initialToastError);
  const [toastSuccess, setToastSuccess] = useState(initialToastSuccess);

  useEffect(() => {
    const timeoutID = setTimeout(
      () => {
        setToastError(initialToastError);
        setToastSuccess(initialToastSuccess);
      },
      toastError.duration || toastSuccess.duration || 8000,
    );

    return () => clearTimeout(timeoutID);
  }, [toastError, toastSuccess]);

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
            setToastSuccess({ message: "", ...success });
          } catch (err) {
            setToastError({ message: "", ...errorTransform(err) });
          }
        };
      },
      [],
    );

  return (
    <FeedbacksContext.Provider
      value={{
        loadingFullScreen,
        setLoadingFullScreen,
        toastError,
        setToastError,
        toastSuccess,
        setToastSuccess,
        wrapWithFeedback,
      }}
    >
      {/*==== Loader full screen*/}
      <LoaderFullScreen visible={loadingFullScreen} />
      {/*==== Toasts*/}
      {toastError && toastError.title ? (
        <ToastError
          onPress={() => setToastError(initialToastError)}
          title={toastError.title}
          message={toastError.message}
        />
      ) : null}
      {toastSuccess && toastSuccess.title ? (
        <ToastSuccess
          onPress={() => {
            return toastSuccess.onPress
              ? toastSuccess.onPress()
              : setToastSuccess(initialToastSuccess);
          }}
          title={toastSuccess.title}
          message={toastSuccess.message}
        />
      ) : null}
      {/*==== Page content*/}
      {children}
    </FeedbacksContext.Provider>
  );
};

export const useFeedbacks = () => useContext(FeedbacksContext);

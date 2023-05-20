import React, { createContext, useContext, useEffect, useState } from "react";

import { LoaderFullScreen } from "../components/loaders/LoaderFullScreen";
import { ToastError } from "../components/toasts/ToastError";
import { ToastSuccess } from "../components/toasts/ToastSuccess";

interface ToastMessage {
  title: string;
  message: string;
  duration?: number;
}
export const initialToastError: ToastMessage = {
  title: "",
  message: "",
  duration: 8000,
};
export const initialToastSuccess: ToastMessage = {
  title: "",
  message: "",
  duration: 8000,
};

interface DefaultValue {
  toastError: ToastMessage;
  setToastError: (error: ToastMessage) => void;
  toastSuccess: ToastMessage;
  setToastSuccess: (info: ToastMessage) => void;
  loadingFullScreen: boolean;
  setLoadingFullScreen: (loading: boolean) => void;
}
const defaultValue: DefaultValue = {
  toastError: initialToastError,
  setToastError: () => {},
  toastSuccess: initialToastSuccess,
  setToastSuccess: () => {},
  loadingFullScreen: false,
  setLoadingFullScreen: () => {},
};

export const FeedbacksContext = createContext(defaultValue);

export const FeedbacksContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [toastError, setToastError] = useState(initialToastError);
  const [toastSuccess, setToastSuccess] = useState(initialToastSuccess);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setToastError(initialToastError);
      setToastSuccess(initialToastSuccess);
    }, toastError.duration || toastSuccess.duration || 8000);

    return () => clearTimeout(timeoutID);
  }, [toastError, toastSuccess]);

  return (
    <FeedbacksContext.Provider
      value={{
        loadingFullScreen,
        setLoadingFullScreen,
        toastError,
        setToastError,
        toastSuccess,
        setToastSuccess,
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
          onPress={() => setToastSuccess(initialToastSuccess)}
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

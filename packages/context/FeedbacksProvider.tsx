import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

import { LoaderFullScreen } from "../components/loaders/LoaderFullScreen";
import {
  NormalToast,
  NormalToastProps,
} from "../components/toasts/NormalToast";

import { MiniToast, MiniToastProps } from "@/components/toasts/MiniToast";

interface INormalToast extends NormalToastProps {
  mode: "normal";
  duration?: number;
}
interface IMiniToast extends MiniToastProps {
  mode: "mini";
  duration?: number;
}

type Toast = IMiniToast | INormalToast;

const initialToast: Toast = {
  message: "",
  title: "",
  duration: 8000,
  mode: "normal",
  type: "success",
};

/**
 * @deprecated Use initialToast instead
 */
export const initialToastError: Pick<
  INormalToast,
  "message" | "duration" | "onPress" | "title"
> = {
  title: "",
  message: "",
  duration: 8000,
};

interface FeedbacksProviderValue {
  /**
   * @deprecated Use setToast instead
   */
  setToastError: (
    error: Pick<INormalToast, "message" | "duration" | "onPress" | "title">,
  ) => void;
  /**
   * @deprecated Use setToast instead
   */
  setToastSuccess: (
    info: Pick<INormalToast, "message" | "duration" | "onPress" | "title">,
  ) => void;
  loadingFullScreen: boolean;
  setLoadingFullScreen: (loading: boolean) => void;
  wrapWithFeedback: (
    cb: () => Promise<void>,
    success?: { title: string; message?: string },
    errorTransform?: (err: unknown) => { title: string; message?: string },
  ) => () => Promise<void>;
  setToast: (data: Toast) => void;
}
const defaultValue: FeedbacksProviderValue = {
  setToastError: () => {},
  setToastSuccess: () => {},
  loadingFullScreen: false,
  setLoadingFullScreen: () => {},
  wrapWithFeedback: () => async () => {},
  setToast: () => {},
};

const FeedbacksContext = createContext(defaultValue);

export const FeedbacksContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [toast, setToast] = useState<Toast>(initialToast);
  const { onPress: onToastPress, ...toastRestProps } = toast;

  const clearToast = () => setToast(initialToast);

  useEffect(() => {
    const toastDuration = toast.duration || initialToast.duration;

    const timeoutID = setTimeout(() => {
      // If the toast is in "mini" mode and showAlways flag is enabled, do not clear the toast
      const shouldClearToast = !(toast.mode === "mini" && toast.showAlways);

      if (shouldClearToast) {
        clearToast();
      }
    }, toastDuration);

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
            setToast({
              mode: "normal",
              type: "success",
              message: "",
              ...success,
            });
          } catch (err) {
            setToast({
              mode: "normal",
              type: "error",
              message: "",
              ...errorTransform(err),
            });
          }
        };
      },
      [],
    );

  const tapToClear = () => {
    clearToast();
    if (onToastPress) {
      onToastPress();
    }
  };

  return (
    <FeedbacksContext.Provider
      value={{
        loadingFullScreen,
        setLoadingFullScreen,
        setToastError: ({ title = "", ...args }) =>
          setToast({ mode: "normal", type: "error", title, ...args }),
        setToastSuccess: ({ title = "", ...args }) =>
          setToast({
            mode: "normal",
            type: "success",
            title,
            ...args,
          }),
        wrapWithFeedback,
        setToast,
      }}
    >
      {/*==== Loader full screen*/}
      <LoaderFullScreen visible={loadingFullScreen} />
      {/*==== Toasts*/}
      {toast && toast.mode === "normal" && toast.title ? (
        <NormalToast
          onPress={tapToClear}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          topOffset={
            toast.topOffset ? toast.topOffset : Platform.OS !== "web" ? 55 : 24
          }
        />
      ) : null}

      {/* Mini Toast */}
      {toast && toast.mode === "mini" && toast.message && (
        <MiniToast
          onPress={tapToClear}
          message={toast.message || ""}
          {...toastRestProps}
        />
      )}

      {/*==== Page content*/}
      {children}
    </FeedbacksContext.Provider>
  );
};

export const useFeedbacks = () => useContext(FeedbacksContext);

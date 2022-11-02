import { useFeedbacks } from "../context/FeedbacksProvider";
import { DETAULT_PROCESS_ERROR } from "../utils/errors";

type ErrorHandlerType = {
  error: unknown;
  callback?: () => void;
};

export const useErrorHandler = () => {
  const { setToastError } = useFeedbacks();

  const triggerError = ({ error, callback }: ErrorHandlerType) => {
    let errorText = DETAULT_PROCESS_ERROR;
    if (typeof error === "string") {
      errorText = error;
    } else if (error instanceof Error) {
      errorText = error.message;
    }
    callback && callback();
    setToastError({ title: "Delegation failed!", message: errorText });
  };

  return { triggerError };
};

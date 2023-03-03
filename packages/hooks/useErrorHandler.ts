import { useFeedbacks } from "../context/FeedbacksProvider";
import { DETAULT_PROCESS_ERROR } from "../utils/errors";

type ErrorHandlerType = {
  title: string;
  error: unknown;
  callback?: () => void;
};

export const useErrorHandler = () => {
  const { setToastError } = useFeedbacks();

  const triggerError = ({ title, error, callback }: ErrorHandlerType) => {
    let errorText = DETAULT_PROCESS_ERROR;
    if (typeof error === "string") {
      errorText = error;
    } else if (error instanceof Error) {
      errorText = error.message;
    }
    callback && callback();
    setToastError({ title, message: errorText });
  };

  return { triggerError };
};

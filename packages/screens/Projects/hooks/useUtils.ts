import { useFeedbacks } from "../../../context/FeedbacksProvider";

export const useUtils = () => {
  const { setToastError } = useFeedbacks();

  const mustGetValue = (value?: string, name?: string) => {
    if (!value) {
      setToastError({
        title: "Error",
        message: `failed to get ${name || "value"}`,
      });
      throw Error(`failed to get ${name || "value"}`);
    }
    return value;
  };

  return { mustGetValue };
};

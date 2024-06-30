import { useFeedbacks } from "../../../context/FeedbacksProvider";

export const useUtils = () => {
  const { setToast } = useFeedbacks();

  const mustGetValue = (value?: string, name?: string) => {
    if (!value) {
      setToast({
        title: "Error",
        type: "error",
        mode: "normal",
        message: `failed to get ${name || "value"}`,
      });
      throw Error(`failed to get ${name || "value"}`);
    }
    return value;
  };

  return { mustGetValue };
};

/* eslint-disable */
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { getValueFor } from "../../../hooks/useMobileSecureStore";
import { ScreenFC } from "../../../utils/navigation";
import { setMnemonic } from "../hooks/useNativeWallet";
import { createMnemonic } from "../util/seed";

export const ViewSeed: ScreenFC<"ViewSeed"> = () => {
  const { wrapWithFeedback } = useFeedbacks();

  const createWallet = async () => {
    const fromStorage = await getValueFor("mnemonic");
    let mnemonic = "";
    if (fromStorage) {
      mnemonic = fromStorage;
    } else {
      mnemonic = createMnemonic();
      await setMnemonic(mnemonic);
    }
  };

  return null;
};

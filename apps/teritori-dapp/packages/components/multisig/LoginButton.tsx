import { Keplr } from "@keplr-wallet/types";
import { FC } from "react";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMultisigAuthToken } from "../../hooks/multisig/useMultisigAuthToken";
import { useMultisigClient } from "../../hooks/multisig/useMultisigClient";
import { parseUserId, NetworkKind } from "../../networks";
import { setMultisigToken } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { keplrSignArbitrary } from "../../utils/keplr";
import { PrimaryButton } from "../buttons/PrimaryButton";

import { multisigLogin } from "@/utils/multisig";

export const LoginButton: FC<{ userId: string | undefined }> = ({ userId }) => {
  const [network, userAddress] = parseUserId(userId);
  const storeAuthToken = useMultisigAuthToken(userId);
  const dispatch = useAppDispatch();
  const { wrapWithFeedback } = useFeedbacks();
  const client = useMultisigClient(network?.id);

  return (
    <PrimaryButton
      text={
        storeAuthToken
          ? "Logout of Multisig service"
          : "Login to Multisig service"
      }
      loader
      disabled={!userId} // TODO: replace with connect wallet button in this case
      onPress={wrapWithFeedback(async () => {
        if (storeAuthToken) {
          dispatch(setMultisigToken({ userAddress, token: undefined }));
          return;
        }

        if (!userId) {
          throw new Error("No user id");
        }

        const [network] = parseUserId(userId);
        if (network?.kind !== NetworkKind.Cosmos) {
          throw new Error("Invalid network");
        }

        const keplr = (window as any).keplr as Keplr | undefined;
        if (!keplr) {
          throw new Error("Keplr not found");
        }

        const { pubKey, algo } = await keplr.getKey(network.chainId);
        if (algo !== "secp256k1") {
          throw new Error("Unsupported key algorithm");
        }

        const authToken = await multisigLogin(
          network,
          client,
          pubKey,
          (infoJSON) => keplrSignArbitrary(userId, infoJSON),
        );

        dispatch(setMultisigToken({ userAddress, token: authToken }));
      })}
    />
  );
};

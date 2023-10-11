import { Keplr } from "@keplr-wallet/types";
import { FC } from "react";

import {
  GetTokenRequest,
  TokenRequestInfo,
} from "../../api/multisig/v1/multisig";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMultisigAuthToken } from "../../hooks/multisig/useMultisigAuthToken";
import { useMultisigClient } from "../../hooks/multisig/useMultisigClient";
import { parseUserId, NetworkKind } from "../../networks";
import { setMultisigToken } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { keplrSignArbitrary } from "../../utils/keplr";
import { PrimaryButton } from "../buttons/PrimaryButton";

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

        const challengeResponse = await client.GetChallenge({});

        if (!challengeResponse.challenge) {
          throw new Error("No challenge returned from server");
        }

        const info = TokenRequestInfo.toJSON({
          kind: "Login to Teritori Multisig Service",
          challenge: challengeResponse.challenge,
          userBech32Prefix: network.addressPrefix,
          userPubkeyJson: JSON.stringify({
            type: "tendermint/PubKeySecp256k1",
            value: Buffer.from(pubKey).toString("base64"),
          }),
        });
        const infoJSON = JSON.stringify(info);

        const stdsig = await keplrSignArbitrary(userId, infoJSON);

        const req: GetTokenRequest = {
          infoJson: infoJSON,
          userSignature: stdsig.signature,
        };

        const { authToken } = await client.GetToken(req);

        if (!authToken) {
          throw new Error("No auth token returned from server");
        }

        dispatch(setMultisigToken({ userAddress, token: authToken }));
      })}
    />
  );
};

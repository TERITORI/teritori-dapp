import { Keplr } from "@keplr-wallet/types";
import { FC } from "react";
import { useSelector } from "react-redux";

import {
  MultisigServiceClientImpl,
  GrpcWebImpl as MultisigGrpcWebImpl,
  GetTokenRequest,
  TokenRequestInfo,
} from "../../api/multisig/v1/multisig";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { parseUserId, NetworkKind } from "../../networks";
import {
  selectMultisigToken,
  setMultisigToken,
} from "../../store/slices/settings";
import { RootState, useAppDispatch } from "../../store/store";
import { keplrSignArbitrary } from "../../utils/keplr";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const LoginButton: FC<{ userId: string | undefined }> = ({ userId }) => {
  const [, userAddress] = parseUserId(userId);
  const storeAuthToken = useSelector((state: RootState) =>
    selectMultisigToken(state, userAddress)
  );
  const dispatch = useAppDispatch();
  const hasValidToken =
    storeAuthToken && Date.parse(storeAuthToken.expiration) > Date.now(); // FIXME: this won't rerender when token expires
  const { wrapWithFeedback } = useFeedbacks();

  return (
    <PrimaryButton
      text={
        hasValidToken
          ? "Logout of Multisig service"
          : "Login to Multisig service"
      }
      loader
      disabled={!userId} // TODO: replace with connect wallet button in this case
      onPress={wrapWithFeedback(async () => {
        if (hasValidToken) {
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

        const rpc = new MultisigGrpcWebImpl("http://localhost:9091", {
          debug: false,
        });
        const client = new MultisigServiceClientImpl(rpc);

        const keplr = (window as any).keplr as Keplr | undefined;
        if (!keplr) {
          throw new Error("Keplr not found");
        }

        const key = await keplr.getKey(network.chainId);
        console.log("key", key);
        const { pubKey, algo } = key;

        if (algo !== "secp256k1") {
          throw new Error("Unsupported key algorithm");
        }

        const challengeResponse = await client.GetChallenge({});

        if (!challengeResponse.challenge) {
          throw new Error("No challenge returned from server");
        }

        console.log("algo", algo);

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
        console.log(stdsig);

        console.log(stdsig.pub_key);

        const req: GetTokenRequest = {
          infoJson: infoJSON,
          userSignature: stdsig.signature,
        };

        console.log("req", req);

        const { authToken } = await client.GetToken(req);

        console.log("authToken", authToken);

        if (!authToken) {
          throw new Error("No auth token returned from server");
        }

        dispatch(setMultisigToken({ userAddress, token: authToken }));

        const { multisigs } = await client.Multisigs({ authToken, limit: 100 });
        console.log("multisigs", multisigs);

        const { transactions } = await client.Transactions({
          authToken,
          limit: 100,
        });
        console.log("transactions", transactions);

        // TODO: send pubkey/address, signature and nonce to get auth token
        // TODO: store token in persisted redux slice
      })}
    />
  );
};

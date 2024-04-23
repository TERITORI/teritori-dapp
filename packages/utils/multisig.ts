import { StdSignature } from "@cosmjs/amino";

import {
  MultisigService,
  TokenRequestInfo,
  GetTokenRequest,
} from "@/api/multisig/v1/multisig";
import { CosmosNetworkInfo } from "@/networks";

export const multisigLogin = async (
  network: CosmosNetworkInfo,
  client: MultisigService,
  pubKey: Uint8Array,
  sign: (infoJSON: string) => Promise<StdSignature>,
) => {
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

  const stdsig = await sign(infoJSON);

  const req: GetTokenRequest = {
    infoJson: infoJSON,
    userSignature: stdsig.signature,
  };

  const { authToken } = await client.GetToken(req);

  if (!authToken) {
    throw new Error("No auth token returned from server");
  }

  return authToken;
};

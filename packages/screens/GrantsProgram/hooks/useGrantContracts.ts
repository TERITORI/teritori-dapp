import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";

import { useUtils } from "./useUtils";
import { mustGetGnoNetwork } from "../../../networks";
import { Project } from "../types";

const toJSON = (contractData: string, isArray: boolean) => {
  const regex = isArray ? /("\[.*\]")/ : /("{.*}")/;

  // FIXME: Wait JK to fix this JSON =============================================
  // NOTE: Don't know why extractGnoJSONString doesn't work here
  const rawData = contractData.match(regex)?.[0] || "";

  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  let contractJSON = JSON.parse(JSON.parse(rawData));

  if (isArray) {
    contractJSON = contractJSON.map((data: any) => {
      // FIXME: sanitize
      // eslint-disable-next-line no-restricted-syntax
      data.metadata = JSON.parse(data.metadata);
      return data;
    });
  } else {
    // eslint-disable-next-line no-restricted-syntax
    contractJSON.metadata = JSON.parse(contractJSON.metadata);
  }

  return contractJSON;
};

export const useGrantContracts = (networkId: string) => {
  const { mustHaveValue } = useUtils();

  const getContract = async (contractId: number): Promise<Project> => {
    const gnoNetwork = mustGetGnoNetwork(networkId);
    const escrowPkgPath = mustHaveValue(
      gnoNetwork.escrowPkgPath,
      "escrow pkg path",
    );
    const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
    const contractData = await client.evaluateExpression(
      escrowPkgPath,
      `RenderContract(${contractId})`,
    );

    return toJSON(contractData, false) as Project;
  };

  const getContracts = async (
    startAfter: number,
    limit: number,
  ): Promise<Project[]> => {
    const gnoNetwork = mustGetGnoNetwork(networkId);
    const escrowPkgPath = mustHaveValue(
      gnoNetwork.escrowPkgPath,
      "escrow pkg path",
    );
    const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
    const contractsData = await client.evaluateExpression(
      escrowPkgPath,
      `RenderContracts(${startAfter},${limit})`,
    );

    return toJSON(contractsData, true) as Project[];
  };

  return { getContract, getContracts };
};

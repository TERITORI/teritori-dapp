import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { bech32 } from "bech32";
import shajs from "sha.js";

import { mustGetGnoNetwork } from "../networks";

export enum AdenaDoContractMessageType {
  CALL = "/vm.m_call",
  ADD_PKG = "/vm.m_addpkg",
}

export interface AdenaDoContractMessage {
  type: string;
  value: { [key in string]: any };
}

export interface RequestDocontractMessage {
  messages: AdenaDoContractMessage[];
  gasFee: number;
  gasWanted: number;
  memo?: string;
}

interface AdenaDoContractOpts {
  gasFee?: number;
  gasWanted?: number;
  memo?: string;
}

export const adenaDoContract = async (
  networkId: string,
  messages: AdenaDoContractMessage[],
  opts?: AdenaDoContractOpts,
) => {
  const adena = (window as any).adena;
  const network = mustGetGnoNetwork(networkId);
  const client = new GnoJSONRPCProvider(network.endpoint);
  const height = await client.getBlockNumber();
  const req: RequestDocontractMessage = {
    messages,
    gasFee: opts?.gasFee === undefined ? 2000000 : opts.gasFee,
    gasWanted: opts?.gasWanted === undefined ? 20000000 : opts.gasWanted,
    memo: opts?.memo,
  };
  const res = await adena.DoContract(req);
  if (res.status === "failure") {
    throw new Error(res.message);
  }
  const hash: string = res.data.hash;
  const { height: txHeight, index } = await client.waitForTransaction(
    hash,
    height,
  );
  const blockResult = await client.getBlockResult(txHeight);
  const deliverResults = blockResult.results.deliver_tx || [];
  if (deliverResults.length <= index) {
    throw new Error("tx result not found in block");
  }
  const err = deliverResults[index].ResponseBase.Error;
  if (err) {
    console.error(deliverResults[index]);
    throw new Error(JSON.stringify(err));
  }
  return hash;
};

export interface VmCall {
  caller: string;
  send: string;
  pkg_path: string;
  func: string;
  args: string[];
}

export const adenaVMCall = async (
  networkId: string,
  vmCall: VmCall,
  opts?: AdenaDoContractOpts,
) => {
  await adenaDoContract(
    networkId,
    [{ type: AdenaDoContractMessageType.CALL, value: vmCall }],
    opts,
  );
};

interface Package {
  name: string;
  path: string;
  files: PackageFile[];
}

interface PackageFile {
  name: string;
  body: string;
}

interface VmAddPackage {
  creator: string;
  package?: Package;
  deposit: string;
}

export const adenaAddPkg = async (
  networkId: string,
  vmAddPackage: VmAddPackage,
  opts?: AdenaDoContractOpts,
) => {
  await adenaDoContract(
    networkId,
    [{ type: AdenaDoContractMessageType.ADD_PKG, value: vmAddPackage }],
    {
      ...opts,
    },
  );
};

// this is hacky af
export const extractGnoNumber = (str: string) => {
  return parseFloat(str.slice("(".length).split(" ")[0]);
};
export const extractGnoAddress = (str: string) => {
  console.log("extracting address", str);
  const jsonStr = str.slice("(".length, -" std.Address)".length);
  if (!jsonStr) {
    return "";
  }
  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  return JSON.parse(jsonStr) as string;
};
export const extractGnoString = (str: string) => {
  console.log("extracting string from", str);
  const jsonStr = str.slice("(".length, -" string)".length);
  if (!jsonStr) {
    return "";
  }
  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  return JSON.parse(jsonStr) as string;
};
export const extractGnoJSONString = (str: string) => {
  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  return JSON.parse(extractGnoString(str));
};

export const derivePkgAddr = (pkgPath: string): string => {
  const h = shajs("sha256")
    .update("pkgPath:" + pkgPath)
    .digest()
    .subarray(0, 20);
  return bech32.encode("g", bech32.toWords(h));
};

const extractGnoStringResponse = (res: string): string => {
  const jsonString = res.substring("(".length, res.length - " string)".length);
  // eslint-disable-next-line no-restricted-syntax
  const jsonStringContent = JSON.parse(jsonString);
  if (typeof jsonStringContent != "string") {
    throw new Error(
      `unexpected response type ${typeof jsonStringContent} in ${jsonString}`,
    );
  }
  return jsonStringContent;
};

export const extractGnoJSONResponse = (res: string): unknown => {
  const str = extractGnoStringResponse(res);
  // eslint-disable-next-line no-restricted-syntax
  return JSON.parse(str) as unknown;
};

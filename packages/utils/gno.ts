import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";

import { mustGetGnoNetwork } from "../networks";

interface AdenaDoContractMessage {
  type: string;
  value: { [key in string]: any };
}

interface RequestDocontractMessage {
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
    gasFee: opts?.gasFee === undefined ? 1 : opts.gasFee,
    gasWanted: opts?.gasWanted === undefined ? 10000000 : opts.gasWanted,
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
    [{ type: "/vm.m_call", value: vmCall }],
    opts,
  );
};

interface Package {
  Name: string;
  Path: string;
  Files: PackageFile[];
}

interface PackageFile {
  Name: string;
  Body: string;
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
    [{ type: "/vm.m_addpkg", value: vmAddPackage }],
    {
      ...opts,
    },
  );
};

// this is hacky af
export const extractGnoNumber = (str: string) => {
  return parseFloat(str.slice("(".length).split(" ")[0]);
};
export const extractGnoString = (str: string) => {
  const jsonStr = str.slice(str.indexOf(`"`), str.lastIndexOf(`"`) + 1);
  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  return JSON.parse(jsonStr) as string;
};
export const extractGnoJSONString = (str: string) => {
  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  return JSON.parse(extractGnoString(str));
};

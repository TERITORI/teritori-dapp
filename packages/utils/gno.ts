import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";

import { Status } from "../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { mustGetGnoNetwork } from "../networks";

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

export interface AdenaDoContractOpts {
  gasFee?: number;
  gasWanted?: number;
  memo?: string;
}

export const adenaDoContract = async (
  networkId: string,
  messages: AdenaDoContractMessage[],
  opts?: AdenaDoContractOpts
) => {
  const adena = (window as any).adena;
  const network = mustGetGnoNetwork(networkId);
  const client = new GnoJSONRPCProvider(network.endpoint);
  const height = await client.getBlockNumber();
  const req: RequestDocontractMessage = {
    messages,
    gasFee: opts?.gasFee === undefined ? 1000000 : opts.gasFee,
    gasWanted: opts?.gasWanted === undefined ? 1000000 : opts.gasWanted,
    memo: opts?.memo,
  };
  const res = await adena.DoContract(req);
  if (res.status === "failure") {
    throw new Error(res.message);
  }
  const hash: string = res.data.hash;
  const { height: txHeight, index } = await client.waitForTransaction(
    hash,
    height
  );
  const blockResult = await client.getBlockResult(txHeight);
  const deliverResults = blockResult.results.deliver_tx || [];
  if (deliverResults.length <= index) {
    throw new Error("tx result not found in block");
  }
  const err = deliverResults[index].ResponseBase.Error;
  if (err) {
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
  opts?: AdenaDoContractOpts
) => {
  await adenaDoContract(
    networkId,
    [{ type: "/vm.m_call", value: vmCall }],
    opts
  );
};

export interface Package {
  Name: string;
  Path: string;
  Files: PackageFile[];
}

export interface PackageFile {
  Name: string;
  Body: string;
}

export interface VmAddPackage {
  creator: string;
  package?: Package;
  deposit: string;
}

export const adenaAddPkg = async (
  networkId: string,
  vmAddPackage: VmAddPackage,
  opts?: AdenaDoContractOpts
) => {
  await adenaDoContract(
    networkId,
    [{ type: "/vm.m_addpkg", value: vmAddPackage }],
    {
      gasFee: 1,
      gasWanted: 5000000,
      ...opts,
    }
  );
};

// this is hacky af
export const extractGnoNumber = (str: string) => {
  return parseFloat(str.slice("(".length).split(" ")[0]);
};
export const extractGnoString = (str: string) => {
  const jsonStr = str.slice(str.indexOf(`"`), str.lastIndexOf(`"`) + 1);
  return JSON.parse(jsonStr) as string;
};
export const extractGnoJSONString = (str: string) => {
  return JSON.parse(extractGnoString(str));
};
export const proposalStatusFromNumber = (status: number): Status => {
  switch (status) {
    case 0:
      return "open";
    case 1:
      return "passed";
    case 2:
      return "executed";
  }
  return "open";
};

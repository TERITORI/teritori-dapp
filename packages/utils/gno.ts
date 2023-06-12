import { Status } from "../contracts-clients/dao-proposal-single/DaoProposalSingle.types";

export interface RequestDocontractMessage {
  messages: {
    type: string;
    value: { [key in string]: any };
  }[];
  gasFee: number;
  gasWanted: number;
  memo?: string;
}

export interface VmCall {
  caller: string;
  send: string;
  pkg_path: string;
  func: string;
  args: string[];
}

export const adenaVMCall = async (
  vmCall: VmCall,
  opts?: { gasFee?: number; gasWanted?: number; memo?: string }
) => {
  const adena = (window as any).adena;
  const req: RequestDocontractMessage = {
    messages: [{ type: "/vm.m_call", value: vmCall }],
    gasFee: opts?.gasFee === undefined ? 1000000 : opts.gasFee,
    gasWanted: opts?.gasWanted === undefined ? 1000000 : opts.gasWanted,
    memo: opts?.memo,
  };
  const res = await adena.DoContract(req);
  if (res.status === "failure") {
    throw new Error(res.message);
  }
};

// this is hacky af
export const extractGnoNumber = (str: string) => {
  return parseFloat(str.replace("(", "").split(" ")[0]);
};
export const extractGnoString = (str: string) => {
  return str.slice(2, -'" string)'.length).replaceAll("\\n", "\n");
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

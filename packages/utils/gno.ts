import { Status } from "../contracts-clients/dao-proposal-single/DaoProposalSingle.types";

// this is hacky af
export const extractGnoNumber = (str: string) => {
  return parseFloat(str.replace("(", "").split(" ")[0]);
};
export const extractGnoString = (str: string) => {
  return str.slice(2, -'" string)'.length);
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

export type ProposalStatus =
  | "PROPOSAL_STATUS_PASSED"
  | "PROPOSAL_STATUS_REJECTED"
  | "PROPOSAL_STATUS_VOTING";

export interface Content {
  "@type": string;
  title: string;
  description: string;
}

export interface FinalTallyResult {
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
}

export interface TotalDeposit {
  denom: string;
  amount: string;
}

export interface Proposal {
  proposal_id: string;
  content: Content;
  status: ProposalStatus;
  final_tally_result: FinalTallyResult;
  submit_time: string;
  deposit_end_time: string;
  total_deposit: TotalDeposit[];
  voting_start_time: string;
  voting_end_time: string;
}

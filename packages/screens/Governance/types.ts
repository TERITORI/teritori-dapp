export type ProposalStatus =
  | "PROPOSAL_STATUS_PASSED"
  | "PROPOSAL_STATUS_REJECTED"
  | "PROPOSAL_STATUS_VOTING";

// FIXME: fully define type
export interface Proposal {
  content: any;
  status: ProposalStatus;
  proposal_id: string;
  final_tally_result: any;
  voting_end_time: string;
  voting_start_time: string;
  deposit_end_time: string;
  submit_time: string;
}

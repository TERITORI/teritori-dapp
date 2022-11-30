export type ProposalStatus =
  | "PROPOSAL_STATUS_PASSED"
  | "PROPOSAL_STATUS_REJECTED"
  | "PROPOSAL_STATUS_VOTING"
  | "PROPOSAL_STATUS_DEPOSIT_PERIOD";

export enum ProposalType {
  TEXT = "/cosmos.gov.v1beta1.TextProposal",
  PARAMETER_CHANGE = "/cosmos.params.v1beta1.ParameterChangeProposal",
  SOFTWARE_UPGRADE = "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
  CANCEL_SOFTWARE_UPGRADE = "/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal",
  COMMUNITY_POOL = "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal",
}

export type ProposalForm = {
  title: string;
  description: string;
  type: ProposalType;
  minimumDeposit: string;
  initialDeposit: string;

  depositPeriodDays: number;
  depositPeriodHours: number;
  depositPeriodMinutes: number;

  votingPeriodDays: number;
  votingPeriodHours: number;
  votingPeriodMinutes: number;
};

export type ProposalStatus =
  | "PROPOSAL_STATUS_PASSED"
  | "PROPOSAL_STATUS_REJECTED"
  | "PROPOSAL_STATUS_VOTING"
  | "PROPOSAL_STATUS_DEPOSIT_PERIOD";

export enum ProposalType {
  SOFTWARE_UPGRADE = "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
  PARAMETER_CHANGE = "/cosmos.params.v1beta1.ParameterChangeProposal",
  TEXT = "/cosmos.gov.v1beta1.TextProposal",
}

export type ProposalForm = {
  title: string;
  description: string;
  type: ProposalType;
  minimumDeposit: number;
  initialDeposit: number;

  depositPeriodDays: string;
  depositPeriodHours: string;
  depositPeriodMinutes: string;

  votingPeriodDays: string;
  votingPeriodHours: string;
  votingPeriodMinutes: string;
};

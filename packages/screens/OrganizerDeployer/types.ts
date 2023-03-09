export type CreateDaoFormType = {
  organizationName: string;
  associatedTeritoriNameService: string;
  organizationDescription: string;
  structure: string;
  imageUrl: string;
};

export type ConfigureVotingFormType = {
  supportPercent: number;
  minimumApprovalPercent: number;
  days: string;
  hours: string;
  minutes: string;
};

export type TokenSettingFormType = {
  tokenName: string;
  tokenSymbol: string;
  tokenHolders: { address: string; balance: string }[];
};

export type LaunchingProcessStepType = {
  title: string;
  completeText: string;
  isComplete?: boolean;
};

export type MakeProposalFormType = {
  type: "transfer" | "stake";
  recipintAddress: string;
  amount: string;
  networkFee: string;
  senderAccount: string;
  approvalRequired: string;
};

export type ProposalsTransactionType = {
  id: number;
  type: "transfer" | "stake";
  createdAt: string;
  sending: "TORI";
  createdBy: string;
  time: string;
  amount: string;
  networkFee: string;
  approvedRequired: number;
  approvedBy: number;
  approvers: number;
};

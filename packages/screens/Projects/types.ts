import { LocalFileData } from "../../utils/types/files";

export enum MsPriority {
  MS_PRIORITY_HIGH = "MS_PRIORITY_HIGH",
  MS_PRIORITY_MEDIUM = "MS_PRIORITY_MEDIUM",
  MS_PRIORITY_LOW = "MS_PRIORITY_LOW",
}

export enum MsStatus {
  MS_OPEN = "MS_OPEN",
  MS_PROGRESS = "MS_PROGRESS",
  MS_REVIEW = "MS_REVIEW",
  MS_COMPLETED = "MS_COMPLETED",
}

export enum ContractStatus {
  ALL = "ALL", // This is specific value used only for filter
  CREATED = "CREATED",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CONFLICT = "CONFLICT",
  ABORTED_IN_FAVOR_OF_FUNDER = "ABORTED_IN_FAVOR_OF_FUNDER",
  ABORTED_IN_FAVOR_OF_CONTRACTOR = "ABORTED_IN_FAVOR_OF_CONTRACTOR",
}

export type ShortDescData = {
  name: string;
  desc: string;
  budget: number;
  duration: number;
  funder: string;
  contractor: string;
  coverImg: string;
  tags: string;
  _coverImgFile?: LocalFileData;
  arbitrator: string;
};

export type TeamAndLinkData = {
  websiteLink: string;
  twitterProfile: string;
  discordLink: string;
  githubLink: string;
  teamDesc: string;
};

type ProjectMetadata = {
  shortDescData: ShortDescData;
  milestones: ProjectMilestone[];
  teamAndLinkData: TeamAndLinkData;
};

export type ProjectMilestone = {
  id: number;
  title: string;
  desc: string;
  amount: number;
  paid: number;
  duration: number;
  link: string;
  funded: boolean;
  status: MsStatus;
  priority: MsPriority;
};

enum ConflictOutcome {
  RESUME_CONTRACT = "RESUME_CONTRACT",
  REFUND_FUNDER = "REFUND_FUNDER",
  PAY_CONTRACTOR = "PAY_CONTRACTOR",
  UNKNOWN = "UNKNOWN",
}

type Conflict = {
  initiator: string;
  createdAt: number;
  respondedAt: number | null;
  resolvedAt: number | null;
  initiatorMessage: string;
  responseMessage: string | null;
  resolutionMessage: string | null;
  outcome: ConflictOutcome | null;
};

export type Project = {
  id: number;
  sender: string;
  contractor: string;
  funder: string;
  escrowToken: string;
  metadata: ProjectMetadata;
  status: ContractStatus;
  expireAt: number;
  funderFeedback: string;
  contractorFeedback: string;
  contractorCandidates: string[];
  milestones: ProjectMilestone[];
  conflicts: Conflict[];
  activeMilestone: number;
  pausedBy: string;
  conflictHandler: string;
  handlerCandidate: string;
  handlerSuggestor: string;
  createdAt: number;
  funded: boolean;
  budget: number;
  rejectReason: string;
};

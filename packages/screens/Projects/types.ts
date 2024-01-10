import { LocalFileData } from "../../utils/types/files";

export enum MsPriority {
  MS_PRIORITY_HIGH = "MS_PRIORITY_HIGH",
  MS_PRIORITY_MEDIUM = "MS_PRIORITY_MEDIUM",
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
}

export enum ProjectStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
}

// This type used in form when create a project
export type MilestoneFormData = {
  id: number;
  name: string;
  desc: string;
  status: MsStatus;
  budget: number;
  githubLink: string;
  priority: MsPriority;
};

export type ShortDescData = {
  name: string;
  desc: string;
  budget: string;
  funder: string;
  paymentAddr: string;
  coverImg: string;
  tags: string;
  _coverImgFile?: LocalFileData;
};

export type TeamAndLinkData = {
  websiteLink: string;
  twitterProfile: string;
  discordLink: string;
  githubLink: string;
  teamDesc: string;
};

export type ProjectMetadata = {
  shortDescData: ShortDescData;
  milestones: MilestoneFormData[];
  teamAndLinkData: TeamAndLinkData;
};

export type ProjectMilestone = {
  title: string;
  amount: number;
  paid: number;
  duration: number;
  status: MsStatus;
  priority: MsPriority;
  funded: boolean;
  link: string;
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
  milestones: ProjectMilestone[];
  activeMilestone: number;
  pausedBy: string;
  conflictHandler: string;
  handlerCandidate: string;
  handlerSuggestor: string;
  createdAt: number;
  rejectReason: string;
};

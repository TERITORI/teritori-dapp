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

export type ShortDescData = {
  name: string;
  desc: string;
  budget: number;
  duration: number;
  funder: string;
  contractor: string;
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
  funded: boolean;
  budget: number;
  rejectReason: string;
};

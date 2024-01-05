import { SvgProps } from "react-native-svg";

import { LocalFileData } from "../../utils/types/files";

export const PRIORITY_HIGH = "high";
export const PRIORITY_MEDIUM = "medium";

export const MS_OPEN = "MS_OPEN";
export const MS_PROGRESS = "MS_PROGRESS";
export const MS_REVIEW = "MS_REVIEW";
export const MS_COMPLETED = "MS_COMPLETED";

export type StatusId = "MS_OPEN" | "MS_PROGRESS" | "MS_REVIEW" | "MS_COMPLETED";

// This type used in form when create a project
export type MilestoneFormData = {
  id: number;
  name: string;
  desc: string;
  statusId: StatusId;
  budget: number;
  githubLink: string;
  priority: "medium" | "high";
};

export type Status = {
  id: string;
  text: string;
  iconSVG: React.FC<SvgProps>;
  count: number;
};

export type ShortDescData = {
  name: string;
  desc: string;
  budget: string;
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
  status: StatusId;
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
  status: string;
  expireAt: number;
  funderFeedback: string;
  contractorFeedback: string;
  milestones: ProjectMilestone[];
  activeMilestone: number;
  pausedBy: string;
  conflictHandler: string;
  handlerCandidate: string;
  handlerSuggestor: string;
};

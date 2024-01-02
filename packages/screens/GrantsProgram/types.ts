import { SvgProps } from "react-native-svg";
import { LocalFileData } from "../../utils/types/files";

export const PRIORITY_HIGH = "high";
export const PRIORITY_MEDIUM = "medium";

export const STATUS_OPEN = "open";
export const STATUS_INPROGRESS = "inProgress";
export const STATUS_REVIEW = "review";
export const STATUS_COMPLETED = "completed";

export type StatusId = "open" | "inProgress" | "review" | "completed";

export type Milestone = {
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
  milestones: Milestone[];
  teamAndLinkData: TeamAndLinkData;
};

export type ProjectMileStone = {
  title: string;
  amount: number;
  paid: number;
  duration: number;
  status: string;
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
  milestones: ProjectMileStone[];
  activeMilestone: number;
  pausedBy: string;
  conflictHandler: string;
  handlerCandidate: string;
  handlerSuggestor: string;
};

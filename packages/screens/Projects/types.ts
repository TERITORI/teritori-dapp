import * as zod from "zod";
import { z } from "zod";

import { zodTryParseJSON } from "@/utils/sanitize";

const zodMilestonePriority = z.enum([
  "MS_PRIORITY_HIGH",
  "MS_PRIORITY_MEDIUM",
  "MS_PRIORITY_LOW",
]);

export type MilestonePriority = z.infer<typeof zodMilestonePriority>;

export const zodMilestoneFormValues = zod.object({
  id: zod.string().optional(),
  title: zod
    .string()
    .min(3)
    .regex(/^[^,]*$/, "Should not contain ,"),
  desc: zod
    .string()
    .min(10)
    .regex(/^[^,]*$/, "Should not contain ,"),
  amount: zod.number().positive().int(),
  priority: zodMilestonePriority,
  link: zod.string().url().optional(),
  duration: zod.number().min(1),
});

export type MilestoneFormValues = zod.infer<typeof zodMilestoneFormValues>;

export interface MilestoneRequest {
  title: string;
  desc: string;
  amount: string;
  duration: string;
  link: string;
  priority: string;
}

export const zodMilestoneStatus = z.enum([
  "MS_OPEN",
  "MS_PROGRESS",
  "MS_REVIEW",
  "MS_COMPLETED",
]);

export type MilestoneStatus = z.infer<typeof zodMilestoneStatus>;

const zodProjectMilestone = z.object({
  id: z.string(),
  title: z.string(),
  desc: z.string(),
  amount: z.string(),
  paid: z.string(),
  duration: z.number(), // seconds
  link: z.string(),
  funded: z.boolean(),
  priority: zodMilestonePriority,
  status: zodMilestoneStatus,
});

export type ProjectMilestone = z.infer<typeof zodProjectMilestone>;

export const previewMilestoneForm = (fm: MilestoneFormValues) => {
  const m: ProjectMilestone = {
    ...fm,
    id: fm.id || "",
    status: "MS_OPEN",
    paid: "0",
    amount: fm.amount.toString(),
    link: fm.link || "",
    funded: false,
  };
  return m;
};

const zodContractStatus = z.enum([
  "CREATED",
  "ACCEPTED",
  "CANCELED",
  "COMPLETED",
  "REJECTED",
  "CONFLICT",
  "ABORTED_IN_FAVOR_OF_CONTRACTOR",
  "ABORTED_IN_FAVOR_OF_FUNDER",
]);

type ContractStatus = z.infer<typeof zodContractStatus>;

export type ContractStatusFilter = ContractStatus | "ALL";

const zodConflictOutcome = z.enum([
  "RESUME_CONTRACT",
  "REFUND_FUNDER",
  "PAY_CONTRACTOR",
]);

const zodConflict = z.object({
  initiator: z.string(),
  createdAt: z.coerce.date(),
  respondedAt: z.coerce.date().optional(),
  resolvedAt: z.coerce.date().optional(),
  initiatorMessage: z.string(),
  responseMessage: z.string().optional(),
  resolutionMessage: z.string().optional(),
  outcome: zodConflictOutcome.optional(),
});

const zodProjectShortDescData = z.object({
  name: z.string().optional(),
  desc: z.string().optional(),
  coverImg: z.string().optional(),
  tags: z.string().optional(),
});

export type ProjectShortDescData = z.infer<typeof zodProjectShortDescData>;

const zodProjectTeamAndLinkData = z.object({
  websiteLink: z.string().optional(),
  twitterProfile: z.string().optional(),
  discordLink: z.string().optional(),
  githubLink: z.string().optional(),
  teamDesc: z.string().optional(),
});

export type ProjectTeamAndLinkData = z.infer<typeof zodProjectTeamAndLinkData>;

const zodProjectMetadata = z.object({
  shortDescData: zodProjectShortDescData.optional(),
  teamAndLinkData: zodProjectTeamAndLinkData.optional(),
});

// export type ProjectMetadata = z.infer<typeof zodProjectMetadata>;

export const zodProject = z.object({
  id: z.string(),
  sender: z.string(),
  contractor: z.string(),
  contractorCandidates: z.array(z.string()),
  funder: z.string(),
  paymentDenom: z.string(),
  metadata: z
    .string()
    .transform((data) => zodTryParseJSON(zodProjectMetadata, data)),
  status: zodContractStatus,
  expireAt: z.coerce.date(),
  funderFeedback: z.string(),
  contractorFeedback: z.string(),
  milestones: z.array(zodProjectMilestone),
  pausedBy: z.string(),
  conflictHandler: z.string(),
  handlerCandidate: z.string(),
  handlerSuggestor: z.string(),
  createdAt: z.coerce.date(),
  budget: z.string(),
  funded: z.boolean(),
  rejectReason: z.string(),
  conflicts: z.array(zodConflict),
});

export type Project = z.infer<typeof zodProject>;

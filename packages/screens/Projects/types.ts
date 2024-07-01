import * as yup from "yup";
import { z } from "zod";

import { zodTryParseJSON } from "@/utils/sanitize";

export const yupMilestoneFormValues = yup.object({
  id: yup.string(),
  title: yup
    .string()
    .required()
    .min(3)
    .matches(/^[^,]*$/, "Should not contain ,"),
  desc: yup
    .string()
    .required()
    .min(10)
    .matches(/^[^,]*$/, "Should not contain ,"),
  amount: yup.number().required().positive().integer(),
  priority: yup.string(),
  link: yup.string().url(),
  duration: yup.number().min(1),
});

export type MilestoneFormValues = yup.InferType<typeof yupMilestoneFormValues>;

const zodMilestonePriority = z.enum([
  "MS_PRIORITY_HIGH",
  "MS_PRIORITY_MEDIUM",
  "MS_PRIORITY_LOW",
]);

export type MilestonePriority = z.infer<typeof zodMilestonePriority>;

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

export type ProjectMetadata = z.infer<typeof zodProjectMetadata>;

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

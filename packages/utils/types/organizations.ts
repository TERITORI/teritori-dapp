import { z } from "zod";

import { NSAvailability } from "./tns";

export enum DaoType {
  MEMBER_BASED = 0,
  TOKEN_BASED = 1,
  ROLES_BASED = 2,
}

// SHARED BETWEEN ALL ORGANIZATION TYPES

export type CreateDaoFormType = {
  organizationName: string;
  associatedHandle: string;
  organizationDescription: string;
  structure: DaoType;
  imageUrl: string;
  nameAvailability: NSAvailability;
};

// GENERAL AND SHAREABLE FORM TYPES

export type ConfigureVotingFormType = {
  supportPercent: number;
  minimumApprovalPercent: number;
  days: string;
  hours: string;
  minutes: string;
};

export const ZodRoleObject = z.object({
  name: z.string().trim().min(1),
  color: z.string().trim().min(1),
  resources: z.array(z.string().optional()).optional(),
});
export const ZodRolesMemberObject = z.object({
  addr: z.string().trim().min(1),
  weight: z.string().trim().min(1),
  // TODO: change it to an array
  roles: z.string(),
});
export const ZodRolesObject = z.object({
  roles: z.array(ZodRoleObject),
});
export const ZodRolesMembersObject = z.object({
  members: z.array(ZodRolesMemberObject),
});
const ZodRolesConfigObject = z.object({
  supportPercent: z.number(),
  minimumApprovalPercent: z.number(),
  days: z.string().trim(),
  hours: z.string().trim(),
  minutes: z.string().trim(),
});
export type RolesConfigFormType = z.infer<typeof ZodRolesConfigObject>;
export type RolesMembersFormType = z.infer<typeof ZodRolesMembersObject>;
export type RolesFormType = z.infer<typeof ZodRolesObject>;
export type RoleFormType = z.infer<typeof ZodRoleObject>;

export type LaunchingProcessStepType = {
  title: string;
  completeText: string;
  isComplete?: boolean;
};

// MEMBERSHIP BASED ORGANIZATION FORM TYPES

export type MembershipMemberSettingFormType = {
  members: { addr: string; weight: string }[];
};

// ROLES BASED ORGANIZATION FORM TYPES

export type RolesSettingFormType = {
  roles: { name: string; color: string; resources: string[] | undefined }[];
};

export type RolesMemberSettingFormType = {
  members: { addr: string; weight: string; roles: string | undefined }[];
};

// TOKEN BASED ORGANIZATION FORM TYPES

export type TokenSettingFormType = {
  tokenName: string;
  tokenSymbol: string;
  tokenHolders: { address: string; balance: string }[];
};

export const ROLES_BASED_ORGANIZATION_STEPS = [
  "Create a DAO",
  "Configure voting",
  "Define Roles & Permissions",
  "Set tokens or members",
  "Review information",
  "Launch organization",
];

export const MEMBERSHIP_ORGANIZATION_DEPLOYER_STEPS = [
  "Create a DAO",
  "Configure voting",
  "Set members",
  "Review information",
  "Launch organization",
];

export const TOKEN_ORGANIZATION_DEPLOYER_STEPS = [
  "Create a DAO",
  "Configure voting",
  "Set tokens",
  "Review information",
  "Launch organization",
];

export const LAUNCHING_PROCESS_STEPS: LaunchingProcessStepType[] = [
  { title: "Create organization", completeText: "Transaction finalized" },
];

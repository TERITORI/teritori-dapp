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
  roles: { name: string; color: string, features: string[] | undefined }[];
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

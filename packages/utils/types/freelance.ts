export interface UserInfo {
  user_addr: string;
}
export enum ProfileStep {
  PersonalInfo,
  ProfessionalInfo,
  LinkedAccounts,
  AccountSecurity,
}

export enum GigStep {
  OverView,
  Pricing,
  Description,
  Requirement,
  Gallery,
  Publish,
}

export enum OrderStep {
  OrderDetails,
  ConfirmPay,
  SubmitRequirements,
}

export enum GigsTab {}

export enum EscrowStatus {
  CreateContract,
  Accept,
  Cancel,
  Pause,
  Complete,
}

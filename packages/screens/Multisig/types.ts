export type CreateMultisigWalletFormType = {
  addresses: { address: string }[];
  signatureRequired: string;
  maxSignature: string;
  name: string;
};

export type MultisigLegacyFormType = {
  multisigAddress: string;
  membersAddress: { address: string }[];
  assets: string;
};

// this should not exist
export enum MultisigTransactionType {
  CREATE_NEW_POST = "Create new post",
  MANAGE_PUBLIC_PROFILE = "Manage public profile",
  MINT_NAME = "Mint name",
  EMPTY = "Empty",
  COMPLEX = "Complex",
  SEND = "Send",
  STAKE = "STAKE",
  DELEGATE = "Delegate",
  UNDELEGATE = "Undelegate",
  REDELEGATE = "Redelegate",
  EXECUTE = "Execute",
  CLAIM_REWARD = "Claim Reward",
  UNKNOWN = "Unknown",
  //TODO: More types ?
}

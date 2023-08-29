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

export type MultisigExecuteFormType = {
  multisigAddress: string;
  contractAddress: string;
  msg: object;
};

export type MultisigTransactionDelegateFormType = {
  multisigAddress: string;
  membersAddress: { address: string }[];

  recipientAddress: string;
  amount: string;
  gasLimit: string;
  gasPrice: string;
  memo: string;
};

export type CosmosMultisig = {
  _id: string;
  chainId: string;
  address: string;
  pubkeyJSON: string;
  name: string;
  userAddresses: string[];
};

export type UserWalletType = {
  walletName: string;
  userAddress: string;
  chainId: string;
  multisigId: string;
  multisigAddress: string;
  multisigUserAddresses: string[];
};

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
export type MultiSigWalletTransactionType =
  | MultiSigWalletTransactionBasicType
  | MultiSigWalletTransactionProposalType;

export type MultiSigWalletTransactionProposalType = {
  id: number;
  type: "proposals";
  count: number;
};
export type MultiSigWalletType = {
  id: number;
  name: string;
  asset_type: string;
  approval: number;
  participants: number;
};

export type MultiSigWalletTransactionBasicType = {
  id: number;
  type: "staked" | "received" | "transfered";
  createdAt: string;
  amount: string;
};

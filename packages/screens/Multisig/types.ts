export type CreateMultisigWalletFormType = {
  addresses: { address: string }[];
  signatureRequired: string;
  maxSignature: string;
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

export type MultisigType = {
  _id: string;
  address: string;
  pubkeyJSON: string;
  chainId: string;
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
  STAKE = "STAKE",
  TRANSFER = "TRANSFER",
  // LAUNCH_NFT_COLLECTION = "Launch Nft collection",
  CREATE_NEW_POST = "Create new post",
  MANAGE_PUBLIC_PROFILE = "Manage public profile",
  REGISTER_TNS = "Register TNS",

  //TODO: More types
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

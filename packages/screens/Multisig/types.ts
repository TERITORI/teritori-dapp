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

export enum MultisigTransactionType {
  STAKE = "STAKE",
  TRANSFER = "TRANSFER",
}

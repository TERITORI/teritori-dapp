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

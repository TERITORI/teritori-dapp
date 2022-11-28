export type CreateMultisigWalletFormType = {
  addresses: { address: string }[];
  signatureRequired: string;
  totalSignatureRequired: string;
};

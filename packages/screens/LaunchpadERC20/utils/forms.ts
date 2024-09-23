import { z } from "zod";

export const zodCreateSaleForm = z.object({
  caller: z.string().min(3),
  tokenName: z.string().min(3),
  merkleRoot: z.string().optional(), // depends on private or public sale
  startTimestamp: z.number().int().min(1), // replace by date parsing w/ a date picker component
  endTimestamp: z.number().int().min(1), // replace by date parsing w/ a date picker component
  pricePerToken: z.number().int().min(1),
  limitPerAddr: z.number().int().min(1),
  minGoal: z.number().int().min(1),
  maxGoal: z.number().int().min(1),
  minted: z.boolean(),
});

export type CreateSaleForm = z.infer<typeof zodCreateSaleForm>;

export const emptyCreateSaleForm: CreateSaleForm = {
  caller: "",
  tokenName: "",
  merkleRoot: "",
  startTimestamp: 0,
  endTimestamp: 0,
  pricePerToken: 0,
  limitPerAddr: 0,
  minGoal: 0,
  maxGoal: 0,
  minted: false,
};

export type CreateSaleState = {
  stepIndice: number;
  createSaleForm: CreateSaleForm;
  actions: {
    setSale: (sale: CreateSaleForm) => void;
  };
};

export const zodCreateAirdropForm = z.object({
  caller: z.string().min(3),
  tokenName: z.string().min(3),
  merkleRoot: z.string().min(1),
  amountPerAddr: z.number().int().min(1),
  startTimestamp: z.number().int().min(0).optional(), // replace by date parsing w/ a date picker component
  endTimestamp: z.number().int().min(0).optional(), // replace by date parsing w/ a date picker component
});

export type CreateAirdropForm = z.infer<typeof zodCreateAirdropForm>;

export const emptyCreateAirdropForm: CreateAirdropForm = {
  caller: "",
  tokenName: "",
  merkleRoot: "",
  amountPerAddr: 0,
  startTimestamp: undefined,
  endTimestamp: undefined,
};

export type CreateAirdropState = {
  stepIndice: number;
  createAirdropForm: CreateAirdropForm;
  actions: {
    setAirdrop: (airdrop: CreateAirdropForm) => void;
  };
};

export const zodCreateTokenFormBasics = z.object({
  caller: z.string().min(3),
  name: z.string().min(3),
  symbol: z.string().min(3),
  decimals: z.number().int().min(0).max(18),
  totalSupply: z.number().int().min(1),
  totalSupplyCap: z.number().int().min(1).optional(),
});

export type CreateTokenFormBasics = z.infer<typeof zodCreateTokenFormBasics>;

export const zodCreateTokenFormDetails = z.object({
  allowMint: z.boolean(),
  allowBurn: z.boolean(),
});

export type CreateTokenFormDetails = z.infer<typeof zodCreateTokenFormDetails>;

export const emptyCreateTokenFormBasics: CreateTokenFormBasics = {
  caller: "",
  name: "",
  symbol: "",
  decimals: 0,
  totalSupply: 21_000_000,
  totalSupplyCap: undefined,
};

export const emptyCreateTokenFormDetails: CreateTokenFormDetails = {
  allowMint: false,
  allowBurn: false,
};

export type CreateTokenState = {
  stepIndice: number;
  createTokenFormBasics: CreateTokenFormBasics;
  createTokenFormDetails: CreateTokenFormDetails;
  actions: {
    setBasics: (basics: CreateTokenFormBasics) => void;
    setDetails: (details: CreateTokenFormDetails) => void;
  };
};

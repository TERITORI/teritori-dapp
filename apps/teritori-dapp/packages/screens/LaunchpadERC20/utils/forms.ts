import { z } from "zod";

export const zodCreateTokenFormBasics = z.object({
  caller: z.string().min(3),
  name: z.string().min(3),
  symbol: z.string().min(3),
  decimals: z.coerce.number().int().min(0).max(18),
  totalSupply: z.coerce.number().int().min(1),
  totalSupplyCap: z.coerce.number().int().min(1).optional(),
});

export type TCreateTokenFormBasics = z.infer<typeof zodCreateTokenFormBasics>;

export const zodCreateTokenFormDetails = z.object({
  allowMint: z.boolean(),
  allowBurn: z.boolean(),
});

export type TCreateTokenFormDetails = z.infer<typeof zodCreateTokenFormDetails>;

export const emptyCreateTokenFormBasics: TCreateTokenFormBasics = {
  caller: "",
  name: "",
  symbol: "",
  decimals: 0,
  totalSupply: 21_000_000,
  totalSupplyCap: undefined,
};

export const emptyCreateTokenFormDetails: TCreateTokenFormDetails = {
  allowMint: false,
  allowBurn: false,
};

export type CreateTokenState = {
  stepIndice: number;
  createTokenFormBasics: TCreateTokenFormBasics;
  createTokenFormDetails: TCreateTokenFormDetails;
  actions: {
    setBasics: (basics: TCreateTokenFormBasics) => void;
    setDetails: (details: TCreateTokenFormDetails) => void;
  };
};

export const zodCreateAirdropForm = z.object({
  caller: z.string().min(3),
  tokenName: z.string().min(3),
  merkleRoot: z.string().min(1),
  amountPerAddr: z.coerce.number().int().min(1),
  startTimestamp: z.coerce.number().int().min(0).or(z.nan()),
  endTimestamp: z.coerce.number().int().min(0).or(z.nan()),
});

export type TCreateAirdropForm = z.infer<typeof zodCreateAirdropForm>;

export const emptyCreateAirdropForm: TCreateAirdropForm = {
  caller: "",
  tokenName: "",
  merkleRoot: "",
  amountPerAddr: 0,
  startTimestamp: 0,
  endTimestamp: 0,
};

export type CreateAirdropState = {
  stepIndice: number;
  createAirdropForm: TCreateAirdropForm;
  actions: {
    setAirdrop: (airdrop: TCreateAirdropForm) => void;
  };
};

export const zodCreateSaleForm = z.object({
  caller: z.string().min(3),
  tokenName: z.string().min(3),
  merkleRoot: z.string().optional(), // depends on private or public sale
  startTimestamp: z.coerce.number().int().min(1),
  endTimestamp: z.coerce.number().int().min(1),
  pricePerToken: z.coerce.number().int().min(1),
  limitPerAddr: z.coerce.number().int().min(1),
  minGoal: z.coerce.number().int().min(1),
  maxGoal: z.coerce.number().int().min(1),
  minted: z.boolean(),
});

export type TCreateSaleForm = z.infer<typeof zodCreateSaleForm>;

export const emptyCreateSaleForm: TCreateSaleForm = {
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
  createSaleForm: TCreateSaleForm;
  actions: {
    setSale: (sale: TCreateSaleForm) => void;
  };
};

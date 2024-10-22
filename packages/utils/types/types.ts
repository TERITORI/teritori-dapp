import { z } from "zod";

export const zodToken = z.object({
  name: z.string(),
  symbol: z.string(),
  decimals: z.string(),
  admin: z.string(),
  image: z.string(),
  totalSupply: z.string(),
  totalSupplyCap: z.string(),
  allowMint: z.boolean(),
  allowBurn: z.boolean(),
});

export type Token = z.infer<typeof zodToken>;

export const emptyToken = {
  symbol: "",
  name: "",
  decimals: "",
  admin: "",
  image: "",
  totalSupply: "",
  totalSupplyCap: "",
  allowMint: false,
  allowBurn: false,
};

export const zodAidrop = z.object({
  id: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  amountPerAddr: z.string(),
  startTimestamp: z.string(),
  endTimestamp: z.string(),
});

export type Airdrop = z.infer<typeof zodAidrop>;

export const zodSale = z.object({
  id: z.string(),
  tokenName: z.string(),
  pricePerToken: z.string(),
  limitPerAddr: z.string(),
  minGoal: z.string(),
  maxGoal: z.string(),
  startTimestamp: z.string(),
  endTimestamp: z.string(),
});

export type Sale = z.infer<typeof zodSale>;

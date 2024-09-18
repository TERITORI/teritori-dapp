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

import { z } from "zod";

export const ZodKeyringList = z.array(
  z.object({
    name: z.string(),
    type: z.string(),
    address: z.string(),
    pubkey: z.string(),
    mnemonic: z.string().optional(),
  }),
);

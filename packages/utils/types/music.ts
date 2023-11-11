import { z } from "zod";

export const ZodTrack = z.object({
  title: z.string(),
  description: z.string(),
  imageURI: z.string(),
  audioURI: z.string(),
});

export type Track = z.infer<typeof ZodTrack>;

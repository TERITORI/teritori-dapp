import { z } from "zod";

export const ZodTrack = z.object({
  title: z.string(),
  description: z.string(),
  imageURI: z.string(),
  audioURI: z.string(),
  waveform: z.array(z.number()),
  duration: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Track = z.infer<typeof ZodTrack>;

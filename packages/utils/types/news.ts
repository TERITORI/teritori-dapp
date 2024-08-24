import { z } from "zod";

import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import { PAGE_REGEX, URL_REGEX } from "@/utils/regex";

const ZodNewsAction = z.object({
  label: z.string(),
  url: z
    .string()
    .trim()
    .refine(
      (value) => !value || URL_REGEX.test(value) || PAGE_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrlOrPage,
    ),
});
export type NewsAction = z.infer<typeof ZodNewsAction>;

export const ZodNewsForm = z.object({
  title: z.string(),
  subtitle: z.string(),
  text: z.string(),
  image: z.string(),
  action1: ZodNewsAction.optional(),
  action2: ZodNewsAction.optional(),
});
export type NewsForm = z.infer<typeof ZodNewsForm>;

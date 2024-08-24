import { z } from "zod";

import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import { PAGE_REGEX, URL_REGEX } from "@/utils/regex";

export const ZodBannerForm = z.object({
  url: z
    .string()
    .trim()
    .refine(
      (value) => !value || URL_REGEX.test(value) || PAGE_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrlOrPage,
    )
    .optional(),
  image: z.string(),
});

export type BannerForm = z.infer<typeof ZodBannerForm>;

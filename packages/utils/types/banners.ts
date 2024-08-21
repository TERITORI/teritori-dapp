import { z } from "zod";

import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import { URL_REGEX } from "@/utils/regex";
import { ZodLocalFileData } from "@/utils/types/files";

export const ZodBannerForm = z.object({
  url: z
    .string()
    .trim()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  image: ZodLocalFileData,
});

export type BannerForm = z.infer<typeof ZodBannerForm>;

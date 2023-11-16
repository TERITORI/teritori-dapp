import { z } from "zod";

export const safeJSONParse = (json: string): unknown => {
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
};

export const zodTryParse = <T extends z.ZodType>(
  zodType: T,
  data: unknown,
): z.infer<T> | undefined => {
  const result = zodType.safeParse(data);
  if (result.success) {
    return result.data;
  }
  console.log("zodTryParse error", result.error, data);
  return undefined;
};

export const zodTryParseJSON = <T extends z.ZodType>(
  zodType: T,
  data: string,
): z.infer<T> | undefined => {
  return zodTryParse(zodType, safeJSONParse(data));
};

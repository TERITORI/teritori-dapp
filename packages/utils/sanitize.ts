import { z } from "zod";

const parseJSON = (json: string): unknown => {
  // this is the only exception we want to allow
  // eslint-disable-next-line no-restricted-syntax
  return JSON.parse(json);
};

const safeJSONParse = (json: string): unknown => {
  try {
    return parseJSON(json);
  } catch {
    return undefined;
  }
};

const zodTryParse = <T extends z.ZodType>(
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

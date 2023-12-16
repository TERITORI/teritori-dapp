import { z } from "zod";

const parseJSON = (s: string): unknown => {
  // this is the only exception we allow
  // eslint-disable-next-line no-restricted-syntax
  return JSON.parse(s);
};

export const safeParseJSON = (json: string): unknown => {
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
  return undefined;
};

export const zodTryParseJSON = <T extends z.ZodType>(
  zodType: T,
  data: string,
): z.infer<T> | undefined => {
  return zodTryParse(zodType, safeParseJSON(data));
};

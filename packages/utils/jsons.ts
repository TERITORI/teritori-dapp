export const tryParseJSON = (json: string) => {
  try {
    return JSON.parse(json);
  } catch {
    return json;
  }
};

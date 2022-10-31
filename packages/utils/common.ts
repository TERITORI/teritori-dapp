export const capitalize = (s: string) =>
  (s && s[0].toUpperCase() + s.slice(1)) || "";

export const removeObjectKey = <T>(obj: T, prop: keyof T) => {
  const { [prop]: omit, ...res } = obj;
  return res;
};

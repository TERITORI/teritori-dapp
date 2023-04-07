export const removeObjectKey = <T>(obj: T, prop: keyof T) => {
  const { [prop]: omit, ...res } = obj;
  return res;
};

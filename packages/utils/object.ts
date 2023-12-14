export const removeObjectKey = <
  T extends { [key in string]: unknown },
  P extends keyof T,
>(
  obj: T,
  prop: P,
) => {
  const { [prop]: omit, ...res } = obj;
  return res;
};

export const removeObjectKeys = <
  T extends { [key in string]: unknown },
  P extends (keyof T)[],
>(
  obj: T,
  props: P,
): Omit<T, P[number]> => {
  const copy = { ...obj };
  props.forEach((prop) => {
    delete copy[prop];
  });
  return copy;
};

// generic undefined filter with type guard
export const isDefined = <T>(val: T | undefined): val is T => {
  return val !== undefined;
};

export const trimRight = (str: string, pattern: string) => {
  while (str.endsWith(pattern)) {
    str = str.slice(0, str.length - pattern.length);
  }
  return str;
};

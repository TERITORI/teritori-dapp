export const trimRight = (str: string, pattern: string) => {
  while (str.endsWith(pattern)) {
    str = str.slice(0, str.length - pattern.length);
  }
  return str;
};

export const capitalizeFirstLetter = (val: string) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

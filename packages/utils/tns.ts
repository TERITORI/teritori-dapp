// Get the tld at the end of a token (TNS) (.xxxx)
export const tldFromToken = (str: string): string =>
  str.substring(str.lastIndexOf("."));
// Get the token (TNS) without the tld
export const tokenWithoutTld = (str: string): string =>
  str.substring(0, str.lastIndexOf("."));

export const isTokenOwnedByUser = (tokensArray: string[], name: string) =>
  tokensArray.includes(name + process.env.TLD);

export const isPath = (str: string) => str.includes("::");

export const isToken = (str: string) => !isPath(str);

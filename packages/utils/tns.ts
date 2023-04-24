import { env } from "./env";
// Get the tld at the end of a token (TNS) (.xxxx)
export const tldFromNSToken = (str: string): string =>
  str.substring(str.lastIndexOf("."));
// Get the token (TNS) without the tld
export const nsTokenWithoutTLD = (str: string): string =>
  str.substring(0, str.lastIndexOf("."));

export const isNSPath = (str: string) => str.includes("::");

export const isNSToken = (str: string) => !isNSPath(str);

export const isTokenOwnedByUser = (tokensArray: string[], name: string) =>
  tokensArray.includes(name + process.env.TLD);

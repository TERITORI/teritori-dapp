
// Get the tld at the end of a token (TNS) (.xxxx)
export const tldFromToken = (str: string): string =>
		str.substring(str.lastIndexOf("."));
// Get the token (TNS) without the tld
export const tokenWithoutTld = (str: string): string =>
		str.substr(0, str.lastIndexOf("."));

export const isTokenOwned = (tokenArray: string[], name: string) => {
		return tokenArray.includes(name + process.env.TLD);
};

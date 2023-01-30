export const trimRight = (str: string, pattern: string) => {
  while (str.endsWith(pattern)) {
    str = str.slice(0, str.length - pattern.length);
  }
  return str;
};


export const getShortAddress_Big = (address: string, windowsWidth: number): string => {
  if (windowsWidth < 610) {
    if (!address) return "";
    if (address.length <= 14) return address;
    return `${address.slice(0, 10)}...${address.slice(-4)}`
  }

  else return address;
}

export const getShortAddress_Small = (address: string | null, windowsWidth: number): string => {
  if (windowsWidth < 1400) {
    if (!address) return "";
    if (address.length <= 14) return address;
    return `${address.slice(0, 10)}...${address.slice(-4)}`
  }

  else return String(address);
}

export const getShortAddress_Chain = (address: string | undefined): string => {
  if (!address) return "";
  if (address.length <= 14) return address;
  return `${address.slice(0, 8)}...${address.slice(-2)}`
}
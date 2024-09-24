export const prettyTotalSupplyToken = (supply: string, symbol: string) => {
  return supply.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + symbol;
};

export const prettyTokenSymbol = (symbol: string) => {
  return symbol.length > 4 ? symbol.slice(0, 4) + "..." : symbol;
};

export const prettyTokenName = (name: string) => {
  return name.length > 15 ? name.slice(0, 15) + "..." : name;
};

export const prettyTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp));
  if (date.getTime() === 0) {
    return "Anytime";
  } else {
    return `On ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
  }
};

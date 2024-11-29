export const prettyTotalSupplyToken = (supply: string, symbol: string) => {
  return supply.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + symbol;
};

export const prettyTokenSymbol = (symbol: string) => {
  return symbol.length > 4 ? symbol.slice(0, 4) + "..." : symbol;
};

export const prettyTokenName = (name: string) => {
  return name.length > 15 ? name.slice(0, 15) + "..." : name;
};

// this function display timestamp from unix seconds format to human readable format
export const prettyTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp, 10) * 1000);
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  if (date.getTime() === 0) {
    return "Anytime";
  } else {
    return `On ${day}/${month}/${date.getFullYear()} at ${hours}:${minutes}`;
  }
};

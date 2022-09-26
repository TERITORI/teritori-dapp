// libraries
import { formatCurrency as formatCurrencyLib } from "react-native-format-currency";

export const useCurrencyFormater = () => {
  const formatCurrency = (value: string | number) => {
    const [_, valueFormattedWithoutSymbol] = formatCurrencyLib({
      amount: BigInt(value) as any,
      code: "USD",
    });
    return valueFormattedWithoutSymbol;
  };

  return { formatCurrency };
};

import { SvgProps } from "react-native-svg";

export type TransactionAccount = {
  account: string;
  name: string;
  subtitle: string;
  icon: React.FC<SvgProps>;
  amount: number;
};

export type TransactionForm = {
  toAddress: string;
  fromAddress: string;
  amount: string;
};

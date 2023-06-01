export type NFTActivityType = {
  transactionId: string;
  transactionType: string;
  time: string;
  totalAmount: string;
  buyer: string;
  seller: string;
};

export interface PrettyPrint {
  networkId: string;
  value: number;
  denom: string;
}

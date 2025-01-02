import Long from "long";

import { Info } from "../../contracts-clients/rakki/Rakki.types";

const grossTicketsPrizeAmount = (info: Info, ticketsCount: number) =>
  Long.fromString(info.config.ticket_price.amount).mul(ticketsCount);

const netPrizeAmount = (info: Info, ticketsCount: number) => {
  const feePrizeAmount = grossTicketsPrizeAmount(info, ticketsCount)
    .mul(info.config.fee_per10k)
    .div(10000);
  // Net prize amount
  return grossTicketsPrizeAmount(info, ticketsCount).sub(feePrizeAmount);
};

export const netCurrentPrizeAmount = (info: Info) =>
  netPrizeAmount(info, info.current_tickets_count).toString();

export const netMaxPrizeAmount = (info: Info) =>
  netPrizeAmount(info, info.config.max_tickets).toString();

export const grossMaxPrizeAmount = (info: Info) =>
  grossTicketsPrizeAmount(info, info.config.max_tickets).toString();

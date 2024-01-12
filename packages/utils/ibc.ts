import { sha256 } from "ethers/lib/utils";

export const getIBCDenom = (
  portId: string,
  channelId: string,
  denom: string,
) => {
  const path = `${portId}/${channelId}/${denom}`;
  const h = sha256(Buffer.from(path, "utf-8")).substring(2);
  return `ibc/${h.toUpperCase()}`;
};

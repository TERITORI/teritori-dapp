import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { useDAOGroup } from "./useDAOGroup";
import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import {
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  parseUserId,
} from "../../networks";
import { extractGnoString } from "../../utils/gno";

// FIXME: pagination

export const useDAOMembers = (daoId: string | undefined) => {
  const { data: daoGroupAddress } = useDAOGroup(daoId);
  const { data: members, ...other } = useQuery(
    ["daoMembers", daoId, daoGroupAddress],
    async () => {
      const [network, daoAddress] = parseUserId(daoId);
      if (!network?.id) {
        return null;
      }
      switch (network.kind) {
        case NetworkKind.Cosmos: {
          if (!daoGroupAddress) {
            return null;
          }
          const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
            network.id
          );
          const cw4Client = new Cw4GroupQueryClient(
            cosmwasmClient,
            daoGroupAddress
          );
          const { members } = await cw4Client.listMembers({ limit: 100 });
          return members;
        }
        case NetworkKind.Gno: {
          const provider = new GnoJSONRPCProvider(network.endpoint);
          const res = extractGnoString(
            await provider.evaluateExpression(daoAddress, `GetBinaryMembers()`)
          );
          const membersB64 = res.split(",");
          const members: { addr: string; weight: number }[] = [];
          for (const memberB64 of membersB64) {
            members.push(decodeGnoMember(Buffer.from(memberB64, "base64")));
          }
          return members;
        }
      }
    },
    { staleTime: Infinity }
  );
  return { members, ...other };
};

const decodeGnoMember = (buf: Buffer): { addr: string; weight: number } => {
  let offset = 0;

  // const id = buf.readBigUint64BE(offset);
  offset += 8;

  const addrLen = buf.readUInt16BE(offset);
  offset += 2;
  const addr = buf.slice(offset, offset + addrLen).toString();
  offset += addrLen;

  // const weightHighBits = buf.readUInt32BE(offset);
  offset += 4;
  const weight = buf.readUInt32BE(offset);
  // offset += 4;

  return { addr, weight };
};

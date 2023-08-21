import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { useDAOGroup } from "./useDAOGroup";
import { useDAOType } from "./useDAOType";
import { useDAOVotingModule } from "./useDAOVotingModule";
import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import { Member } from "../../contracts-clients/cw4-group/Cw4Group.types";
import { DaoVotingCw721StakedQueryClient } from "../../contracts-clients/dao-voting-cw721-staked/DaoVotingCw721Staked.client";
import {
  getUserId,
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  parseUserId,
} from "../../networks";
import { DaoType } from "../../screens/Organizations/types";
import { extractGnoString } from "../../utils/gno";
import { getOwnersByCollection } from "../collection/useOwnersByCollection";

// FIXME: pagination

export const useDAOMembers = (daoId: string) => {
  const [network] = parseUserId(daoId);
  const { daoVotingModule } = useDAOVotingModule(daoId);
  const { data: daoGroupAddress } = useDAOGroup(daoId);
  const daoType = useDAOType(network?.id, daoId);
  const { data: members, ...other } = useQuery(
    ["daoMembers", daoId, daoType],
    async () => {
      switch (daoType) {
        case DaoType.MEMBER_BASED: {
          return getMembers(daoId, daoGroupAddress);
        }
        case DaoType.NFT_BASED: {
          return getNftMembers(daoId, daoVotingModule);
        }
        default:
          return null;
      }
    },
    { staleTime: Infinity }
  );
  return { members, ...other };
};

const getMembers = async (
  daoId: string,
  daoGroupAddress: string | null | undefined
) => {
  const [network, daoAddress] = parseUserId(daoId);
  if (!network?.id || !daoGroupAddress) {
    return null;
  }
  switch (network.kind) {
    case NetworkKind.Cosmos: {
      if (!daoGroupAddress) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
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
      const members: Member[] = [];
      for (const memberB64 of membersB64) {
        members.push(decodeGnoMember(Buffer.from(memberB64, "base64")));
      }
      return members;
    }
  }
};

const getNftMembers = async (
  daoId: string,
  daoVotingModule: string | null | undefined
) => {
  const [network] = parseUserId(daoId);
  if (!network?.id || !daoVotingModule) {
    return null;
  }
  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
  const votingClient = new DaoVotingCw721StakedQueryClient(
    cosmwasmClient,
    daoVotingModule
  );
  const votingClientConfig = await votingClient.config();
  const collectionId = getUserId(network.id, votingClientConfig.nft_address);
  const owners = await getOwnersByCollection(collectionId, network.id);
  // Member from Cw4Group.types.ts may not be an appropriate type
  const nftMembers: Member[] = owners.map((o) => {
    return {
      addr: parseUserId(o)[1],
      // weight is useless here but needed for Member type
      weight: 1,
    };
  });
  return nftMembers;
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

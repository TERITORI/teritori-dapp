import { useDAOVotingModule } from "./useDAOVotingModule";
import { getCosmosNetwork } from "../../networks";
import { DaoType } from "../../screens/Organizations/types";
import { useCosmWasmContract } from "../cosmwasm/useCosmWasmContractInfo";

// Returns DaoType by checking the DAO voting module (address)
export const useDAOType = (
  networkId: string | undefined,
  daoId: string | null | undefined
) => {
  const network = getCosmosNetwork(networkId);
  const { daoVotingModule } = useDAOVotingModule(daoId);
  const res = useCosmWasmContract(network?.id, daoVotingModule);

  if (!res.data?.codeId || !network) return null;
  switch (res.data.codeId) {
    case network.daoVotingCw721StakedCodeId:
      return DaoType.NFT_BASED;
    case network.daoVotingCw20StakedCodeId:
      return DaoType.TOKEN_BASED;
    case network.daoVotingCw4CodeId:
      return DaoType.MEMBER_BASED;
    default:
      return null;
  }
};

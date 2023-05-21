import { useQuery } from "@tanstack/react-query";

import { DaoListRequest } from "../../api/dao/v1/dao";
import { DaoInfo } from "../../screens/OrganizerDeployer/types";
import { mustGetDaoClient } from "../../utils/backend";

export const useDAOs = (networkId: string, req?: Partial<DaoListRequest>) => {
  const { data, ...other } = useQuery(
    ["daos", networkId, req],
    async () => {
      const daoClient = mustGetDaoClient(networkId);
      const res = await daoClient.DaoList(req || {});
      const daos: DaoInfo[] = [];
      for (const dao of res.daos) {
        const tempDao: DaoInfo = {
          name: dao.name,
          address: dao.contractAddress,
          imgUrl: dao.imageUrl,
          date: "",
          description: dao.description,
          members: "",
          treasury: "",
          proposalModuleAddress: "",
          proposalBaseModuleAddress: "",
        };

        daos.push(tempDao);
      }
      return daos;
    },
    { staleTime: Infinity }
  );
  return { daos: data, ...other };
};

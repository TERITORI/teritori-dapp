import { useQuery } from "@tanstack/react-query";

import { DAOsRequest } from "../../api/dao/v1/dao";
import { mustGetDAOClient } from "../../utils/backend";

export const useDAOs = (req: Partial<DAOsRequest>) => {
  const { data, ...other } = useQuery(
    ["daos", req],
    async () => {
      const networkId = req?.networkId;
      if (!networkId) {
        return [];
      }
      const daoClient = mustGetDAOClient(networkId);
      const { daos } = await daoClient.DAOs(req || {});
      return daos;
    },
    { staleTime: Infinity },
  );
  return { daos: data, ...other };
};

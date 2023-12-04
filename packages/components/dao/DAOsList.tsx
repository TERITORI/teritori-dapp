import { DAOCard, GnoDAOCard } from "./DAOCard";
import { DAO, DAOsRequest } from "../../api/dao/v1/dao";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { GnoDAORegistration, useGnoDAOs } from "../../hooks/gno/useGnoDAOs";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "../../hooks/useSelectedNetwork";
import { NetworkKind, getUserId } from "../../networks";
import { layout } from "../../utils/style/layout";
import { GridList } from "../layout/GridList";

const gap = layout.spacing_x2;

const minElemWidth = 250;

export const DAOsList: React.FC<{
  req: Partial<DAOsRequest>;
}> = ({ req }) => {
  const network = useSelectedNetworkInfo();
  switch (network?.kind) {
    case NetworkKind.Cosmos: {
      return <CosmosDAOsList req={req} />;
    }
    case NetworkKind.Gno: {
      return <GnoDAOsList />;
    }
    default: {
      return null;
    }
  }
};

const cosmosKeyExtractor = (item: DAO) => item.id;

const CosmosDAOsList: React.FC<{
  req: Partial<DAOsRequest>;
}> = ({ req }) => {
  const { daos } = useDAOs(req);
  return (
    <GridList<DAO>
      data={daos || []}
      gap={gap}
      minElemWidth={minElemWidth}
      keyExtractor={cosmosKeyExtractor}
      renderItem={(info, elemWidth) => (
        <DAOCard daoId={info.item.id} style={{ width: elemWidth }} />
      )}
    />
  );
};

const gnoKeyExtractor = (item: GnoDAORegistration) => item.pkgPath;

const GnoDAOsList: React.FC = () => {
  const networkId = useSelectedNetworkId();
  const { gnoDAOs } = useGnoDAOs(networkId);
  return (
    <GridList<GnoDAORegistration>
      data={gnoDAOs || []}
      gap={gap}
      minElemWidth={minElemWidth}
      keyExtractor={gnoKeyExtractor}
      renderItem={(info, elemWidth) => (
        <GnoDAOCard
          key={info.item.pkgPath}
          daoId={getUserId(networkId, info.item.pkgPath)}
          registration={info.item}
          style={{
            width: elemWidth,
          }}
        />
      )}
    />
  );
};

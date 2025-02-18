import { DAOCard } from "./DAOCard";
import { DAO, DAOsRequest } from "../../api/dao/v1/dao";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { layout } from "../../utils/style/layout";
import { GridList } from "../layout/GridList";

const gap = layout.spacing_x2;

const minElemWidth = 250;

export const DAOsList: React.FC<{
  req: Partial<DAOsRequest>;
}> = ({ req }) => {
  const { daos } = useDAOs(req);
  return (
    <GridList<DAO>
      data={daos || []}
      gap={gap}
      minElemWidth={minElemWidth}
      keyExtractor={keyExtractor}
      renderItem={(info, elemWidth) => (
        <DAOCard daoId={info.item.id} style={{ width: elemWidth }} />
      )}
    />
  );
};

const keyExtractor = (item: DAO) => item.id;

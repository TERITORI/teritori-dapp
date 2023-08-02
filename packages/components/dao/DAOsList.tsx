import { View } from "react-native";

import { DAOCard, GnoDAOCard } from "./DAOCard";
import { DAOsRequest } from "../../api/dao/v1/dao";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { useGnoDAOs } from "../../hooks/gno/useGnoDAOs";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getUserId } from "../../networks";
import { layout } from "../../utils/style/layout";

const halfGap = layout.padding_x1;

export const DAOsList: React.FC<{
  req: Partial<DAOsRequest>;
}> = ({ req }) => {
  const { daos } = useDAOs(req);
  const networkId = useSelectedNetworkId();
  const { gnoDAOs } = useGnoDAOs(networkId);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -halfGap,
        marginVertical: -halfGap,
      }}
    >
      {(daos || []).map((item) => (
        <DAOCard
          key={item.id}
          daoId={item.id}
          style={{
            marginHorizontal: halfGap,
            marginVertical: halfGap,
          }}
        />
      ))}
      {(gnoDAOs || []).map((item) => (
        <GnoDAOCard
          key={item.pkgPath}
          daoId={getUserId(
            networkId,
            item.pkgPath.substring("gno.land/".length).replaceAll("/", "-")
          )}
          registration={item}
          style={{
            marginHorizontal: halfGap,
            marginVertical: halfGap,
          }}
        />
      ))}
    </View>
  );
};

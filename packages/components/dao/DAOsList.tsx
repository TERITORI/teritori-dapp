import { View } from "react-native";

import { DAOItem } from "./DAOItem";
import { DAOsRequest } from "../../api/dao/v1/dao";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { layout } from "../../utils/style/layout";

const halfGap = layout.padding_x1;

export const DAOsList: React.FC<{
  req: Partial<DAOsRequest>;
}> = ({ req }) => {
  const { daos } = useDAOs(req);
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
        <DAOItem
          key={item.id}
          daoId={item.id}
          style={{
            marginHorizontal: halfGap,
            marginVertical: halfGap,
          }}
        />
      ))}
    </View>
  );
};

import { Picker } from "@react-native-picker/picker";
import { ComponentProps } from "react";

import { useDAOs } from "../../hooks/dao/useDAOs";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { parseUserId } from "../../networks";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";

export const DAOSelector: React.FC<{
  userId: string | undefined;
  value: string;
  onSelect: (address: string) => void;
  style?: ComponentProps<typeof Picker>["style"];
}> = ({ userId, value, onSelect, style }) => {
  const [network, userAddress] = parseUserId(userId);
  const { daos } = useDAOs({
    networkId: network?.id,
    memberAddress: userAddress,
  });
  if (!daos?.length) {
    return null;
  }
  return (
    <Picker
      selectedValue={value}
      placeholder="Select a DAO"
      onValueChange={onSelect}
      style={[
        {
          backgroundColor: "black",
          color: "white",
          borderRadius: 4,
          borderColor: neutral77,
        },
        fontSemibold12,
        style,
      ]}
    >
      <Picker.Item label="Use my wallet" value="" />
      {(daos || []).map((dao) => {
        return <DAOPickerItem key={dao.id} daoId={dao.id} />;
      })}
    </Picker>
  );
};

export const DAOPickerItem: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [, address] = parseUserId(daoId);
  const { primaryAlias } = useNSPrimaryAlias(daoId);
  const name = primaryAlias || address;
  return <Picker.Item label={`Use ${name}`} value={daoId} />;
};

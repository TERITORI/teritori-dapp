import { Picker } from "@react-native-picker/picker";

import { useDAOs } from "../../hooks/dao/useDAOs";
import { parseUserId } from "../../networks";

export const DAOSelector: React.FC<{
  userId: string | undefined;
  value: string;
  onSelect: (address: string) => void;
}> = ({ userId, value, onSelect }) => {
  const [network, userAddress] = parseUserId(userId);
  const { daos } = useDAOs(network?.id, {
    memberAddress: userAddress,
  });
  return (
    <Picker
      selectedValue={value}
      placeholder="Select a DAO"
      onValueChange={onSelect}
    >
      <Picker.Item label="Propose to DAO" value="" />
      {(daos || []).map((dao) => {
        return (
          <Picker.Item
            label={`${dao.name} - ${dao.address}`}
            value={dao.address}
          />
        );
      })}
    </Picker>
  );
};

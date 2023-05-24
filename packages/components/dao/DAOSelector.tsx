import { Picker } from "@react-native-picker/picker";

import { useDAOs } from "../../hooks/dao/useDAOs";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { getUserId, parseUserId } from "../../networks";

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
      style={{
        backgroundColor: "black",
        color: "white",
      }}
    >
      <Picker.Item label="Use my wallet" value="" />
      {(daos || []).map((dao) => {
        const daoId = getUserId(network?.id, dao.address);
        return <DAOPickerItem key={daoId} daoId={daoId} />;
      })}
    </Picker>
  );
};

export const DAOPickerItem: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [, address] = parseUserId(daoId);
  const { metadata } = useNSUserInfo(daoId);
  const name = metadata?.tokenId || address;
  return <Picker.Item label={`Use ${name}`} value={address} />;
};

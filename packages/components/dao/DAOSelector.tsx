import React, { FC, useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useDAOs } from "../../hooks/dao/useDAOs";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { parseUserId } from "../../networks";
import { tinyAddress } from "../../utils/text";
import {
  SelectInput,
  SelectInputData,
  SelectInputItem,
} from "../inputs/SelectInput";

const ownWalletToSelect: SelectInputData = {
  label: "Use my wallet",
  value: "",
};

const DAOSelectorItem: FC<{
  daoId: string;
  onPress: (item: SelectInputData) => void;
}> = ({ daoId, onPress }) => {
  const { primaryAlias, isLoading } = useNSPrimaryAlias(daoId);
  const [, daoAddress] = parseUserId(daoId);
  const item: SelectInputData = useMemo(() => {
    return {
      label: `Use ${
        primaryAlias ? "@" + primaryAlias : tinyAddress(daoAddress, 40)
      }`,
      value: daoId || "",
    };
  }, [primaryAlias, daoAddress, daoId]);

  return (
    <SelectInputItem
      item={item}
      onPress={() => onPress(item)}
      isLoading={isLoading}
    />
  );
};

export const DAOSelector: React.FC<{
  userId: string | undefined;
  onSelect: (userId: string) => void;
  style?: StyleProp<ViewStyle>;
}> = ({ userId, onSelect, style }) => {
  const [network, userAddress] = parseUserId(userId);
  const [selectedData, setSelectedData] =
    useState<SelectInputData>(ownWalletToSelect);
  const { daos } = useDAOs({
    networkId: network?.id,
    memberAddress: userAddress,
  });

  return (
    <SelectInput
      style={style}
      selectedData={selectedData}
      selectData={(data) => {
        setSelectedData(data);
        onSelect(data.value.toString());
      }}
      name="daoSelector"
      placeHolder="Select a DAO to use"
      defaultItem={({ onPressItem }) => (
        <SelectInputItem item={ownWalletToSelect} onPress={onPressItem} />
      )}
    >
      {daos?.map((dao, index) => ({ onPressItem }) => (
        <DAOSelectorItem key={index} daoId={dao.id} onPress={onPressItem} />
      ))}
    </SelectInput>
  );
};

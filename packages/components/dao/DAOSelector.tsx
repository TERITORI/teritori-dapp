import React, { FC, useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useDAOs } from "../../hooks/dao/useDAOs";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { parseUserId } from "../../networks";
import { tinyAddress } from "../../utils/text";
import {
  SelectInput,
  SelectInputItem,
  SelectInputItemComponent,
} from "../inputs/SelectInput";

const ownWalletToSelect: SelectInputItem = {
  label: "Use my wallet",
  value: "",
};

const DAOSelectorItem: FC<{
  daoId: string;
  onPress: (item: SelectInputItem) => void;
}> = ({ daoId, onPress }) => {
  const { primaryAlias, isLoading } = useNSPrimaryAlias(daoId);
  const [, daoAddress] = parseUserId(daoId);

  const item: SelectInputItem = useMemo(() => {
    return {
      label: `Use ${
        primaryAlias ? "@" + primaryAlias : tinyAddress(daoAddress, 40)
      }`,
      value: daoId || "",
    };
  }, [primaryAlias, daoAddress, daoId]);

  return (
    <SelectInputItemComponent
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
  const [selectedItem, setSelectedData] =
    useState<SelectInputItem>(ownWalletToSelect);
  const { daos } = useDAOs({
    networkId: network?.id,
    memberAddress: userAddress,
  });
  const selectableData: SelectInputItem[] = useMemo(() => {
    if (!daos?.length) return [];
    const res: SelectInputItem[] = daos?.map((d) => {
      return {
        label: `Use ${tinyAddress(d.contractAddress, 40)}`,
        value: d.id,
      };
    });
    return [ownWalletToSelect, ...res];
  }, [daos]);

  return (
    <SelectInput
      style={style}
      selectedItem={selectedItem}
      selectItem={(data) => {
        setSelectedData(data);
        onSelect(data.value.toString());
      }}
      data={selectableData}
      name="daoSelector"
      placeHolder="Select a DAO to use"
      renderItem={({ onPressItem, item }) =>
        item.value ? (
          <DAOSelectorItem
            daoId={item.value.toString()}
            onPress={onPressItem}
          />
        ) : (
          <SelectInputItemComponent
            item={ownWalletToSelect}
            onPress={onPressItem}
          />
        )
      }
    />
  );
};

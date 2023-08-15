import React, { useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useDAOs } from "../../hooks/dao/useDAOs";
import { useNSPrimaryAliases } from "../../hooks/useNSPrimaryAlias";
import { parseUserId } from "../../networks";
import { tinyAddress } from "../../utils/text";
import { SelectInput, SelectInputData } from "../inputs/SelectInput";

const ownWalletToSelect: SelectInputData = {
  label: "Use my wallet",
  value: "",
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
  // We get the aliases for all these daos and provide them in the SelectInput. We display aliases or addresses and use userId as value
  const { primaryAliases: daosAliases, isLoading } = useNSPrimaryAliases(
    daos?.map((d) => d.id)
  );
  const selectableData: SelectInputData[] = useMemo(
    () =>
      !daosAliases?.length
        ? []
        : [
            ownWalletToSelect,
            ...daosAliases.map((d) => {
              const [, daoAddress] = parseUserId(d.userId);
              return {
                label: `Use ${d.alias ? "@" + d.alias : tinyAddress(daoAddress, 40)}`,
                value: d.userId,
              };
            }),
          ],
    [daosAliases]
  );

  return (
    <SelectInput
      style={style}
      data={selectableData}
      selectedData={selectedData}
      selectData={(data) => {
        setSelectedData(data);
        onSelect(data.value.toString());
      }}
      name="daoSelector"
      placeHolder="Select a DAO to use"
      isLoading={isLoading}
    />
  );
};

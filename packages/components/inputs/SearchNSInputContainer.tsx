import React, { FC, useMemo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useNameSearch } from "../../hooks/search/useNameSearch";
import { useNSTokensByOwner } from "../../hooks/useNSTokensByOwner";
import { getUserId } from "../../networks";
import { layout } from "../../utils/style/layout";
import { AvatarWithName } from "../user/AvatarWithName";

// Used as a wrapper on a TextInput or something like. It allows to search a name in TNS and returns the address.
export const SearchNSInputContainer: FC<{
  searchText: string;
  onPressName: (userId: string, name?: string) => void;
  networkId: string;
  style?: StyleProp<ViewStyle>;
  ownerAddress?: string;
}> = ({
  searchText,
  onPressName,
  networkId,
  style,
  ownerAddress,
  children,
}) => {
  const { names } = useNameSearch({
    networkId,
    input: searchText,
    limit: 12,
  });
  const ownerId = useMemo(
    () => ownerAddress && getUserId(networkId, ownerAddress),
    [ownerAddress, networkId]
  );
  const { tokens: ownerNames } = useNSTokensByOwner(ownerId);
  const selectableNames = useMemo(
    () =>
      ownerAddress
        ? names.filter((n) => {
            let a = false;
            ownerNames.forEach((oN) => {
              if (oN === n) a = true;
            });
            return a;
          })
        : names,
    [ownerNames, names, ownerAddress]
  );

  const hasNames = !!selectableNames.length;

  return (
    <>
      {children}
      {hasNames && (
        <View
          style={[
            {
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: layout.padding_x1_5,
            },
            style,
          ]}
        >
          {selectableNames.map((n) => (
            <AvatarWithName
              key={n}
              networkId={networkId}
              name={n}
              onPress={(userId, name) => onPressName(userId, name)}
              style={{ marginRight: layout.padding_x1 }}
            />
          ))}
        </View>
      )}
    </>
  );
};

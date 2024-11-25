import React, { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useNameSearch } from "../../hooks/search/useNameSearch";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { layout } from "../../utils/style/layout";
import { AvatarWithName } from "../user/AvatarWithName";

// Used as a wrapper on a TextInput or something like. It allows to search a name in TNS and returns the address.
export const SearchNSInputContainer: FC<{
  searchText: string;
  onPressName: (userId: string) => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}> = ({ searchText, onPressName, style, children }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { names } = useNameSearch({
    networkId: selectedNetworkId,
    input: searchText,
    limit: 12,
  });
  const hasNames = !!names.length;

  return (
    <>
      {children}
      {hasNames && (
        <View
          style={[
            {
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: layout.spacing_x1_5,
            },
            style,
          ]}
        >
          {names.map((n) => (
            <AvatarWithName
              key={n}
              networkId={selectedNetworkId}
              name={n}
              onPress={(userId) => onPressName(userId)}
              style={{ marginRight: layout.spacing_x1 }}
            />
          ))}
        </View>
      )}
    </>
  );
};

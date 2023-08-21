import React, { useMemo, useState } from "react";
import { StyleProp, View, ViewStyle, useWindowDimensions } from "react-native";

import { AddMembersModal } from "./AddMembersModal";
import { useIsDAOMember } from "../../hooks/dao/useDAOMember";
import { useDAOMembers } from "../../hooks/dao/useDAOMembers";
import { useDAOType } from "../../hooks/dao/useDAOType";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, parseUserId } from "../../networks";
import { DaoType } from "../../screens/Organizations/types";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { UserCard } from "../cards/UserCard";

// FIXME: pagination

const halfGap = 8;

export const DAOMembers: React.FC<{
  daoId: string;
  style?: StyleProp<ViewStyle>;
}> = ({ daoId, style }) => {
  const [network] = parseUserId(daoId);
  const dataMembers = useDAOMembers(daoId);
  const members = useMemo(() => dataMembers?.members, [dataMembers]);
  const { width: windowWidth } = useWindowDimensions();
  const selectedWallet = useSelectedWallet();
  const [width, setWidth] = useState(0);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const isDAOMember = useIsDAOMember(daoId, selectedWallet?.userId);
  const daoType = useDAOType(network?.id, daoId);

  if (!network) {
    return null;
  }

  let elems = 3;
  if (windowWidth < 702) {
    elems = 1;
  } else if (windowWidth < 1365) {
    elems = 2;
  }

  return (
    <View
      style={style}
      onLayout={(ev) => setWidth(ev.nativeEvent.layout.width)}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <BrandText style={{ fontSize: 20 }}>
          {members?.length || "0"} members
        </BrandText>
        {isDAOMember && daoType !== DaoType.NFT_BASED && (
          <PrimaryButton
            text="Add members"
            size="XS"
            onPress={() => setShowAddMemberModal(true)}
          />
        )}
      </View>
      <View
        style={{ flexWrap: "wrap", flexDirection: "row", margin: -halfGap }}
      >
        {members &&
          members.map((member, index) => {
            const userId = getUserId(network.id, member.addr);
            return (
              <UserCard
                key={index}
                userId={userId}
                style={{
                  width: (width - (elems - 1) * 2 * halfGap) / elems,
                  margin: halfGap,
                }}
                daoId={daoId}
              />
            );
          })}
      </View>
      <AddMembersModal
        daoId={daoId}
        show={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
      />
    </View>
  );
};

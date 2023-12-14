import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useCallback, useState } from "react";
import { StyleProp, View, ViewStyle, useWindowDimensions } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Member } from "../../contracts-clients/cw4-group/Cw4Group.types";
import { useDAOGroup } from "../../hooks/dao/useDAOGroup";
import { useDAOMakeProposal } from "../../hooks/dao/useDAOMakeProposal";
import { useIsDAOMember } from "../../hooks/dao/useDAOMember";
import { useDAOMembers } from "../../hooks/dao/useDAOMembers";
import { useInvalidateDAOProposals } from "../../hooks/dao/useDAOProposals";
import { useNameSearch } from "../../hooks/search/useNameSearch";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, getUserId, parseUserId } from "../../networks";
import { adenaVMCall, extractGnoJSONString } from "../../utils/gno";
import { VotingGroupConfig } from "../../utils/gnodao/configs";
import {
  GnoAddMemberMessage,
  GnoSingleChoiceProposal,
} from "../../utils/gnodao/messages";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { SearchBarInput } from "../Search/SearchBarInput";
import { PrimaryButton } from "../buttons/PrimaryButton";
import ModalBase from "../modals/ModalBase";
import { AvatarWithName } from "../user/AvatarWithName";
import { UserCard } from "../user/UserCard";

// FIXME: pagination

const halfGap = 8;

export const DAOMembers: React.FC<{
  daoId: string | undefined;
  style?: StyleProp<ViewStyle>;
}> = ({ daoId, style }) => {
  const [network] = parseUserId(daoId);
  const { members } = useDAOMembers(daoId);
  const { width: windowWidth } = useWindowDimensions();
  const selectedWallet = useSelectedWallet();
  const [width, setWidth] = useState(0);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const { isDAOMember } = useIsDAOMember(daoId, selectedWallet?.userId);

  if (!members || !network) {
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
        <BrandText style={{ fontSize: 20 }}>{members.length} members</BrandText>
        {!!isDAOMember && (
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
        {members.map((member) => {
          const userId = getUserId(network.id, member.addr);
          return (
            <UserCard
              key={userId}
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

const AddMembersModal: React.FC<{
  daoId: string | undefined;
  show: boolean;
  onClose: () => void;
}> = ({ daoId, show, onClose }) => {
  const [network] = parseUserId(daoId);
  const { wrapWithFeedback } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const [searchText, setSearchText] = useState("");
  const [ids, setIds] = useState<string[]>([]);
  const proposeToAddMembers = useProposeToAddMembers(daoId);

  const { names } = useNameSearch({
    networkId: network?.id,
    input: searchText,
    limit: 16,
  });
  return (
    <ModalBase
      visible={show}
      label="Add members to DAO"
      onClose={onClose}
      scrollable
    >
      <View
        style={{
          minHeight: 300,
          width: 400,
        }}
      >
        <View
          style={{
            margin: -4,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {ids.map((id) => {
            return (
              <AvatarWithName
                style={{ margin: 4 }}
                key={id}
                userId={id}
                onPress={(userId) =>
                  setIds((ids) => ids.filter((id) => id !== userId))
                }
              />
            );
          })}
        </View>
      </View>
      <PrimaryButton
        disabled={!ids.length}
        text="Propose to add members"
        size="XS"
        boxStyle={{ alignSelf: "center" }}
        loader
        fullWidth
        onPress={wrapWithFeedback(async () => {
          await proposeToAddMembers(
            selectedWallet?.address,
            ids.map((n) => parseUserId(n)[1]),
          );
          onClose();
        })}
      />
      <SearchBarInput
        text={searchText}
        onChangeText={setSearchText}
        style={{
          marginBottom: modalMarginPadding,
          marginTop: 8,
          width: "100%",
        }}
      />
      <View
        style={{
          minHeight: 300,
          width: 400,
          marginBottom: modalMarginPadding,
        }}
      >
        <View
          style={{
            margin: -4,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {names.map((name) => {
            return (
              <AvatarWithName
                style={{ margin: 4 }}
                key={name}
                networkId={network?.id}
                name={name}
                onPress={(userId) =>
                  setIds((ids) => [...new Set([...ids, userId])])
                }
              />
            );
          })}
        </View>
      </View>
    </ModalBase>
  );
};

const useProposeToAddMembers = (daoId: string | undefined) => {
  const makeProposal = useDAOMakeProposal(daoId);
  const { data: groupAddress } = useDAOGroup(daoId);
  const invalidateDAOProposals = useInvalidateDAOProposals(daoId);
  return useCallback(
    async (senderAddress: string | undefined, membersToAdd: string[]) => {
      const weight = 1;
      const [network, daoAddress] = parseUserId(daoId);
      if (!senderAddress) {
        throw new Error("Invalid sender");
      }
      switch (network?.kind) {
        case NetworkKind.Cosmos: {
          if (!groupAddress) {
            throw new Error("DAO group address not found");
          }
          const updateMembersReq: {
            add: Member[];
            remove: string[];
          } = {
            add: membersToAdd.map((m) => ({ addr: m, weight })),
            remove: [],
          };
          await makeProposal(senderAddress, {
            title: `Add ${membersToAdd.length} member(s) with weight ${weight}`,
            description: "",
            msgs: [
              {
                wasm: {
                  execute: {
                    contract_addr: groupAddress,
                    msg: Buffer.from(
                      JSON.stringify({
                        update_members: updateMembersReq,
                      }),
                    ).toString("base64"),
                    funds: [],
                  },
                },
              },
            ],
          });
          break;
        }
        case NetworkKind.Gno: {
          const client = new GnoJSONRPCProvider(network.endpoint);

          const moduleConfig: VotingGroupConfig = extractGnoJSONString(
            await client.evaluateExpression(
              daoAddress,
              "daoCore.VotingModule().ConfigJSON()",
            ),
          );
          const { groupId } = moduleConfig;

          const msgs: GnoAddMemberMessage[] = [];
          for (const member of membersToAdd) {
            msgs.push({
              type: "gno.land/r/demo/teritori/groups.AddMember",
              payload: {
                groupId,
                address: member,
                weight,
                metadata: "",
              },
            });
          }
          const propReq: GnoSingleChoiceProposal = {
            title: `Add ${membersToAdd.length} member(s) with weight ${weight}`,
            description: "",
            messages: msgs,
          };
          await adenaVMCall(
            network.id,
            {
              caller: senderAddress,
              send: "",
              pkg_path: daoAddress,
              func: "ProposeJSON",
              args: ["0", JSON.stringify(propReq)],
            },
            { gasWanted: 2000000 },
          );
          break;
        }
      }
      invalidateDAOProposals();
    },
    [daoId, groupAddress, invalidateDAOProposals, makeProposal],
  );
};

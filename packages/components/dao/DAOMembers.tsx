import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { ComponentProps, useCallback, useRef, useState } from "react";
import {
  Pressable,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import trashSVG from "../../../assets/icons/trash.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Member } from "../../contracts-clients/cw4-group/Cw4Group.types";
import { useDAOGroup } from "../../hooks/dao/useDAOGroup";
import { useDAOMakeProposal } from "../../hooks/dao/useDAOMakeProposal";
import { useIsDAOMember } from "../../hooks/dao/useDAOMember";
import { useDAOMembers } from "../../hooks/dao/useDAOMembers";
import { useInvalidateDAOProposals } from "../../hooks/dao/useDAOProposals";
import { useNameSearch } from "../../hooks/search/useNameSearch";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, getUserId, parseUserId } from "../../networks";
import { toRawURLBase64String } from "../../utils/buffer";
import { adenaVMCall, extractGnoNumber } from "../../utils/gno";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
} from "../../utils/style/colors";
import {
  fontSemibold10,
  fontSemibold12,
  fontSemibold8,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { DropdownOption } from "../DropdownOption";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { SearchBarInput } from "../Search/SearchBarInput";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";
import ModalBase from "../modals/ModalBase";
import { AvatarWithName } from "../user/AvatarWithName";

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
      noBrokenCorners
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
        style={{ alignSelf: "center" }}
        loader
        fullWidth
        onPress={wrapWithFeedback(async () => {
          await proposeToAddMembers(
            selectedWallet?.address,
            ids.map((n) => parseUserId(n)[1])
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

const UserCard: React.FC<{
  userId: string;
  style: StyleProp<ViewStyle>;
  daoId?: string;
}> = ({ userId, style, daoId }) => {
  const [, userAddress] = parseUserId(userId);
  const { metadata } = useNSUserInfo(userId);
  const selectedWallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const { isDAOMember: selectedWalletIsMember } = useIsDAOMember(
    daoId,
    selectedWallet?.userId
  );
  const proposeToRemoveMember = useProposeToRemoveMember(daoId);

  const flatStyle = StyleSheet.flatten(style);

  const padding = 16;
  const width = typeof flatStyle.width === "number" ? flatStyle.width : 325;
  return (
    <TertiaryBox
      style={style}
      mainContainerStyle={[
        {
          width,
          height: 287,
          padding,
          justifyContent: "space-between",
          alignItems: "flex-start",
        },
      ]}
    >
      <OmniLink to={{ screen: "UserPublicProfile", params: { id: userId } }}>
        <UserAvatarWithFrame
          userId={userId}
          size="L"
          style={{
            marginBottom: 4,
            marginLeft: -4,
            alignSelf: "flex-start", // this extra flex-start is needed on web when the bio is long
          }}
        />
        <BrandText
          style={[fontSemibold12, { lineHeight: 14, marginBottom: 8 }]}
        >
          {metadata.public_name || userAddress}
        </BrandText>
        <View>
          <BrandText
            style={[fontSemibold10, { color: neutral77, marginBottom: 8 }]}
          >
            {metadata.tokenId ? `@${metadata.tokenId}` : "Anon"}
          </BrandText>
        </View>
        <BrandText
          style={[
            fontSemibold10,
            {
              color: neutral77,
              marginBottom: 8,
            },
          ]}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {metadata.public_bio}
        </BrandText>
      </OmniLink>

      <View>
        <FollowingFollowers style={{ marginBottom: 10 }} />
        <BrandText
          style={[fontSemibold12, { lineHeight: 14, marginBottom: 8 }]}
        >
          Roles
        </BrandText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: width - 2 * padding }}
        >
          {fakeRoles.map((role, index) => {
            return (
              <View
                style={[
                  {
                    marginLeft: index === 0 ? undefined : 4,
                    justifyContent: "center",
                    borderRadius: 4,
                    backgroundColor: role.highlight ? "#9C4CEA" : "#1C1C1C",
                    height: 18,
                    paddingHorizontal: 4,
                  },
                  !role.highlight && {
                    borderWidth: 0.5,
                    borderColor: neutral33,
                  },
                ]}
              >
                <BrandText
                  style={[
                    fontSemibold8,
                    {
                      color: role.highlight ? "white" : neutralA3,
                    },
                  ]}
                >
                  {role.text}
                </BrandText>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ position: "absolute", top: padding, right: padding }}>
        <CardActions
          actions={[
            selectedWalletIsMember && {
              label: "Eject this member",
              icon: trashSVG,
              onPress: wrapWithFeedback(
                async () => {
                  await proposeToRemoveMember(
                    selectedWallet?.address,
                    userAddress
                  );
                },
                { title: "Created proposal" }
              ),
            },
          ]}
        />
      </View>
    </TertiaryBox>
  );
};

const CardActions: React.FC<{
  actions: (
    | ComponentProps<typeof DropdownOption>
    | null
    | undefined
    | boolean
  )[];
}> = ({ actions }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  const filteredActions = actions.filter(
    (a): a is ComponentProps<typeof DropdownOption> =>
      typeof a !== "boolean" && !!a
  );
  if (!filteredActions.length) {
    return null;
  }

  return (
    <View>
      <Pressable onPress={() => onPressDropdownButton(dropdownRef)}>
        <SVG source={dotsCircleSVG} height={32} width={32} />
      </Pressable>
      {isDropdownOpen(dropdownRef) && (
        <View
          style={{
            position: "absolute",
            zIndex: 2,
            top: layout.iconButton + layout.padding_x0_5,
            backgroundColor: neutral00,
            padding: layout.padding_x0_5,
            borderColor: neutral33,
            borderWidth: 1,
            borderRadius: 8,
            right: -layout.padding_x1_5,
            minWidth: 250,
          }}
        >
          {filteredActions.map((action) => (
            <DropdownOption
              {...action}
              onPress={() => {
                closeOpenedDropdown();
                action.onPress?.();
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const FollowingFollowers: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  return (
    <View style={[{ flexDirection: "row" }, style]}>
      <BrandText style={[fontSemibold10, { marginRight: 2 }]}>36</BrandText>
      <BrandText style={[fontSemibold10, { marginRight: 8, color: neutral77 }]}>
        Following
      </BrandText>
      <BrandText style={[fontSemibold10, { marginRight: 2 }]}>21.5k</BrandText>
      <BrandText style={[fontSemibold10, { color: neutral77 }]}>
        Followers
      </BrandText>
    </View>
  );
};

const fakeRoles: { highlight?: boolean; text: string }[] = [
  {
    text: "Hiring",
    highlight: true,
  },
  { text: "Teritorian" },
  { text: "Torishark" },
  { text: "OG" },
  { text: "Ripper" },
  { text: "Squad leader" },
  { text: "NFT Enjoyoor" },
  { text: "Tester" },
];

const useProposeToRemoveMember = (daoId: string | undefined) => {
  const makeProposal = useDAOMakeProposal(daoId);
  const { data: groupAddress } = useDAOGroup(daoId);
  return useCallback(
    async (
      senderAddress: string | undefined,
      memberToRemoveAddress: string
    ) => {
      if (!senderAddress) {
        throw new Error("Invalid sender");
      }
      if (!groupAddress) {
        throw new Error("DAO group address not found");
      }
      const updateMembersReq: {
        add: Member[];
        remove: string[];
      } = { add: [], remove: [memberToRemoveAddress] };
      return await makeProposal(senderAddress, {
        title: `Remove ${memberToRemoveAddress} from members`,
        description: "",
        msgs: [
          {
            wasm: {
              execute: {
                contract_addr: groupAddress,
                msg: Buffer.from(
                  JSON.stringify({
                    update_members: updateMembersReq,
                  })
                ).toString("base64"),
                funds: [],
              },
            },
          },
        ],
      });
    },
    [groupAddress, makeProposal]
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
                      })
                    ).toString("base64"),
                    funds: [],
                  },
                },
              },
            ],
          });
          invalidateDAOProposals();
          return;
        }
        case NetworkKind.Gno: {
          const client = new GnoJSONRPCProvider(network.endpoint);

          const groupId = extractGnoNumber(
            await client.evaluateExpression(daoAddress, "GetGroupID()")
          );

          console.log("groupId", groupId);

          const b64Messages: string[] = [];
          for (const member of membersToAdd) {
            b64Messages.push(
              toRawURLBase64String(
                encodeAddMember({
                  groupId,
                  addr: member,
                  weight,
                  metadata: "",
                })
              )
            );
          }
          await adenaVMCall(
            network.id,
            {
              caller: senderAddress,
              send: "",
              pkg_path: daoAddress,
              func: "Propose",
              args: ["0", "Add members", "", b64Messages.join(",")],
            },
            { gasWanted: 2000000 }
          );
          invalidateDAOProposals();
        }
      }
    },
    [daoId, groupAddress, invalidateDAOProposals, makeProposal]
  );
};

interface GnoMember {
  groupId: number;
  addr: string;
  weight: number;
  metadata: string;
}

const encodeAddMember = (member: GnoMember) => {
  const b = Buffer.alloc(16000); // TODO: compute size or concat

  let offset = 0;

  const type = "AddMember";
  b.writeUInt16BE(type.length, offset);
  offset += 2;
  b.write(type, offset);
  offset += type.length;

  b.writeUInt32BE(0, offset);
  offset += 4;
  b.writeUInt32BE(member.groupId, offset);
  offset += 4;

  b.writeUInt16BE(member.addr.length, offset);
  offset += 2;
  b.write(member.addr, offset);
  offset += member.addr.length;

  b.writeUInt32BE(member.weight, offset);
  offset += 4;

  b.writeUInt16BE(member.metadata.length, offset);
  offset += 2;
  b.write(member.metadata, offset);
  offset += member.metadata.length;

  return Buffer.from(b.subarray(0, offset));
};

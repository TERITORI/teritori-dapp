import React, { ComponentProps, useRef, useState } from "react";
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
import { DaoCoreQueryClient } from "../../contracts-clients/dao-core/DaoCore.client";
import { DaoVotingCw4QueryClient } from "../../contracts-clients/dao-voting-cw4/DaoVotingCw4.client";
import { useIsDAOMember } from "../../hooks/dao/useDAOMember";
import { useDAOMembers } from "../../hooks/dao/useDAOMembers";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getUserId,
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";
import { makeProposal } from "../../utils/dao";
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
import { SearchBar } from "../Search/SearchBar";
import { NameResult } from "../Search/SearchBarResults";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { AvatarWithFrame } from "../images/AvatarWithFrame";
import ModalBase from "../modals/ModalBase";

// FIXME: pagination

const halfGap = 8;

export const DAOMembers: React.FC<{
  daoId: string | undefined;
  style?: StyleProp<ViewStyle>;
}> = ({ daoId, style }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const { members } = useDAOMembers(daoId);
  const { width: windowWidth } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const { wrapWithFeedback } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const [names, setNames] = useState<string[]>([]);

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
        <PrimaryButton
          text="Add members"
          size="XS"
          onPress={() => setShowAddMemberModal(true)}
        />
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
      <ModalBase
        visible={showAddMemberModal}
        label="Add members to DAO"
        onClose={() => setShowAddMemberModal(false)}
        noBrokenCorners
      >
        <View
          style={{
            minHeight: 200,
            width: 400,
            margin: -4,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {names.map((n) => {
            return (
              <NameResult
                style={{ margin: 4 }}
                key={n}
                networkId={network.id}
                userId={n}
                onPress={(ownerId) =>
                  setNames((names) => names.filter((na) => na !== ownerId))
                }
              />
            );
          })}
        </View>
        <PrimaryButton
          disabled={!names.length}
          text="Propose to add members"
          size="XS"
          style={{ alignSelf: "center" }}
          loader
          onPress={wrapWithFeedback(async () => {
            await proposeToAddMembers(
              network.id,
              selectedWallet?.address,
              daoAddress,
              names.map((n) => parseUserId(n)[1])
            );
          })}
        />
        <SearchBar
          style={{
            marginBottom: modalMarginPadding,
            marginTop: 8,
            width: "100%",
          }}
          onPressName={(_name, userId) => {
            setNames((names) => [...new Set(names).add(userId)]);
          }}
          noCollections // FIXME: don't reuse the header search bar
        />
      </ModalBase>
    </View>
  );
};

const UserCard: React.FC<{
  userId: string;
  style: StyleProp<ViewStyle>;
  daoId?: string;
}> = ({ userId, style, daoId }) => {
  const [network, address] = parseUserId(userId);
  const { metadata } = useNSUserInfo(userId);
  const selectedWallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const { isDAOMember: selectedWalletIsMember } = useIsDAOMember(
    daoId,
    selectedWallet?.userId
  );
  const [, daoAddress] = parseUserId(daoId);

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
        <AvatarWithFrame
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
          {metadata.public_name || address}
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
                    network?.id,
                    selectedWallet?.address,
                    daoAddress,
                    address
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

const proposeToRemoveMember = async (
  networkId: string | undefined,
  senderAddress: string | undefined,
  daoAddress: string | undefined,
  memberToRemoveAddress: string
) => {
  const network = mustGetCosmosNetwork(networkId);

  if (!daoAddress) {
    throw new Error("no DAO address");
  }
  if (!senderAddress) {
    throw new Error("no selected wallet");
  }

  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

  const daoCoreClient = new DaoCoreQueryClient(cosmwasmClient, daoAddress);

  const votingModuleAddress = await daoCoreClient.votingModule();
  const votingClient = new DaoVotingCw4QueryClient(
    cosmwasmClient,
    votingModuleAddress
  );

  const cw4Address = await votingClient.groupContract();

  const updateMembersReq: {
    add: Member[];
    remove: string[];
  } = { add: [], remove: [memberToRemoveAddress] };

  return await makeProposal(networkId, senderAddress, daoAddress, {
    title: `Remove ${memberToRemoveAddress} from members`,
    description: "",
    msgs: [
      {
        wasm: {
          execute: {
            contract_addr: cw4Address,
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
};

const proposeToAddMembers = async (
  networkId: string | undefined,
  senderAddress: string | undefined,
  daoAddress: string | undefined,
  membersToAdd: string[]
) => {
  const network = mustGetCosmosNetwork(networkId);

  if (!daoAddress) {
    throw new Error("no DAO address");
  }
  if (!senderAddress) {
    throw new Error("no selected wallet");
  }

  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

  const daoCoreClient = new DaoCoreQueryClient(cosmwasmClient, daoAddress);

  const votingModuleAddress = await daoCoreClient.votingModule();
  const votingClient = new DaoVotingCw4QueryClient(
    cosmwasmClient,
    votingModuleAddress
  );

  const cw4Address = await votingClient.groupContract();

  const weight = 1;
  const updateMembersReq: {
    add: Member[];
    remove: string[];
  } = { add: membersToAdd.map((m) => ({ addr: m, weight })), remove: [] };

  return await makeProposal(networkId, senderAddress, daoAddress, {
    title: `Add ${membersToAdd.length} member(s) with weight ${weight}`,
    description: "",
    msgs: [
      {
        wasm: {
          execute: {
            contract_addr: cw4Address,
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
};

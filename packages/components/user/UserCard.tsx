import React, { ComponentProps, useRef, useCallback } from "react";
import {
  StyleProp,
  ViewStyle,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import trashSVG from "../../../assets/icons/trash.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Member } from "../../contracts-clients/cw4-group/Cw4Group.types";
import { useDAOGroup } from "../../hooks/dao/useDAOGroup";
import { useDAOMakeProposal } from "../../hooks/dao/useDAOMakeProposal";
import { useIsDAOMember } from "../../hooks/dao/useDAOMember";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { parseUserId } from "../../networks";
import {
  neutral77,
  neutral33,
  neutralA3,
  neutral00,
} from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold10,
  fontSemibold8,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { DropdownOption } from "../DropdownOption";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { BoxStyle } from "../boxes/Box";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

export const UserCard: React.FC<{
  userId: string;
  style: StyleProp<ViewStyle & BoxStyle>;
  daoId?: string;
}> = ({ userId, style, daoId }) => {
  const [, userAddress] = parseUserId(userId);
  const { metadata } = useNSUserInfo(userId);
  const selectedWallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const { isDAOMember: selectedWalletIsMember } = useIsDAOMember(
    daoId,
    selectedWallet?.userId,
  );
  const proposeToRemoveMember = useProposeToRemoveMember(daoId);

  const flatStyle = StyleSheet.flatten(style);

  const padding = 16;
  const width = typeof flatStyle.width === "number" ? flatStyle.width : 325;
  return (
    <TertiaryBox
      style={[
        style,
        {
          justifyContent: "space-between",
          alignItems: "flex-start",
          width,
          height: 287,
          padding,
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
          style={[
            fontSemibold12,
            { lineHeight: 14, marginBottom: 8, width: width - 2 * padding }, // FIXME: we have to set a fixed width because TertiaryBox is broken
          ]}
          numberOfLines={1}
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
                    userAddress,
                  );
                },
                { title: "Created proposal" },
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
      typeof a !== "boolean" && !!a,
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
            top: layout.iconButton + layout.spacing_x0_5,
            backgroundColor: neutral00,
            padding: layout.spacing_x0_5,
            borderColor: neutral33,
            borderWidth: 1,
            borderRadius: 8,
            right: -layout.spacing_x1_5,
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
      memberToRemoveAddress: string,
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
                  }),
                ).toString("base64"),
                funds: [],
              },
            },
          },
        ],
      });
    },
    [groupAddress, makeProposal],
  );
};

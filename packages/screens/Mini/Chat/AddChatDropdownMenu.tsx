import React from "react";
import { View } from "react-native";

import AddSVG from "../../../../assets/icons/add-new.svg";
import ChatGraySVG from "../../../../assets/icons/chat-gray.svg";
import FriendGraySVG from "../../../../assets/icons/friend-gray.svg";
import OrganizationGraySVG from "../../../../assets/icons/organization-gray.svg";
import GroupGraySVG from "../../../../assets/icons/users-group-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { Dropdown } from "../../../components/Dropdown";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { neutral22 } from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";

export const AddChatDropdownMenu = () => {
  return (
    <View style={{ width: "auto" }}>
      <Dropdown
        triggerComponent={<AddSVG />}
        positionStyle={{
          bottom: -190,
          right: 0,
        }}
      >
        <View
          style={{
            backgroundColor: neutral22,
            borderRadius: 12,
            paddingHorizontal: 16,
            width: 252,
          }}
        >
          <CustomPressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 45,
              gap: 12,
            }}
          >
            <ChatGraySVG />
            <BrandText style={[fontMedium16, {}]}>
              Create new conversation
            </BrandText>
          </CustomPressable>
          <CustomPressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 45,
              gap: 12,
            }}
          >
            <GroupGraySVG />
            <BrandText style={[fontMedium16, {}]}>Create new group</BrandText>
          </CustomPressable>
          <CustomPressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 45,
              gap: 12,
            }}
          >
            <FriendGraySVG />
            <BrandText style={[fontMedium16, {}]}>Add s friend </BrandText>
          </CustomPressable>
          <CustomPressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 45,
              gap: 12,
            }}
          >
            <OrganizationGraySVG />
            <BrandText style={[fontMedium16, {}]}>
              Create an organization
            </BrandText>
          </CustomPressable>
        </View>
      </Dropdown>
      {/* )} */}
    </View>
  );
};

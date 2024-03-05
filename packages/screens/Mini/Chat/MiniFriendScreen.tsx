import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";

import messageSVG from "../../../../assets/icons/chat-round.svg";
import searchSVG from "../../../../assets/icons/search-gray.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  selectContactRequestList,
  selectConversationList,
} from "../../../store/slices/message";
import { ScreenFC } from "../../../utils/navigation";
import {
  neutral22,
  neutral77,
  secondaryColor,
  withAlpha,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontMedium16,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ContactRequest } from "../../../utils/types/message";
import { weshClient } from "../../../weshnet";
import {
  acceptFriendRequest,
  activateGroup,
  sendMessage,
} from "../../../weshnet/services";
import { bytesFromString } from "../../../weshnet/utils";
import { CustomButton } from "../components/Button/CustomButton";
import { ChatAvatar } from "../components/ChatAvatar";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { RoundedTabs } from "@/components/tabs/RoundedTabs";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

export const miniFriendTabItems = {
  requests: {
    name: "Requests",
  },
  friends: {
    name: "Friends",
  },
};

export const MiniFriendScreen: ScreenFC<"MiniFriend"> = ({
  navigation,
  route,
}) => {
  const [selectedTab, setSelectedTab] = useState<
    keyof typeof miniFriendTabItems
  >(route.params.activeTab ?? "requests");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BlurScreenContainer title="Friends">
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <RoundedTabs
          items={miniFriendTabItems}
          onSelect={(key) => setSelectedTab(key)}
          selected={selectedTab}
          style={{
            height: 36,
            maxHeight: 36,
            backgroundColor: withAlpha(neutral22, 0.9),
          }}
        />

        <SpacerColumn size={2} />

        <MiniTextInput
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon={searchSVG}
          placeholder="Search..."
          style={{ paddingVertical: layout.spacing_x1 }}
          inputStyle={[fontMedium14, { lineHeight: 0 }]}
        />
        <SpacerColumn size={3} />

        {selectedTab === "requests" && <FriendRequests />}

        {selectedTab === "friends" && <Friends />}

        <View style={{ flex: 1 }} />
      </View>
    </BlurScreenContainer>
  );
};

type Props = {
  name: string;
  isOnline: boolean;
  avatar: any;
  data: ContactRequest;
};

function FriendRequests() {
  const contactRequestList = useSelector(selectContactRequestList);

  if (contactRequestList.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <BrandText
          style={[fontMedium16, { textAlign: "center", color: neutral77 }]}
        >
          No Friend Requests yet.
        </BrandText>
      </View>
    );
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={contactRequestList}
      renderItem={({ item }) => (
        <FriendRequest
          data={item}
          name={item.name}
          isOnline={false}
          avatar={undefined}
        />
      )}
      keyExtractor={(item) => item.id}
      style={{}}
    />
  );
}

function FriendRequest({ isOnline, data }: Props) {
  const [addLoading, setAddLoading] = useState(false);
  const navigation = useAppNavigation();
  const { setToast } = useFeedbacks();

  const handleAddFriend = async () => {
    setAddLoading(true);
    setToast({
      mode: "mini",
      showAlways: true,
      message: "Adding Friend...",
      type: "loading",
      variant: "outline",
    });
    try {
      const contactPk = bytesFromString(data?.contactId);
      await acceptFriendRequest(contactPk);
      const groupInfo = await activateGroup({ contactPk });
      await sendMessage({
        groupPk: groupInfo?.group?.publicKey,
        message: {
          type: "accept-contact",
        },
      });

      navigation.replace("Conversation", { conversationId: data?.id });
      setToast({
        mode: "mini",
        message: "Successfully Added Friend.",
        type: "success",
        variant: "outline",
      });
    } catch (err) {
      console.error(err);
      setToast({
        mode: "mini",
        message: "Error adding friend",
        type: "error",
        variant: "outline",
      });
    }
    setAddLoading(false);
  };

  const handleCancelFriend = async () => {
    setToast({
      mode: "mini",
      showAlways: true,
      message: "Cancelling Friend...",
      type: "loading",
      variant: "outline",
    });
    try {
      await weshClient.client.ContactRequestDiscard({
        contactPk: bytesFromString(data?.contactId),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setToast({
        mode: "mini",
        message: "Successfully Cancelled Friend Request.",
        type: "success",
        variant: "outline",
      });
    } catch (e) {
      console.log(e);
      setToast({
        mode: "mini",
        message: "Error canceling friend request",
        type: "error",
        variant: "outline",
      });
    }
  };

  return (
    <View>
      <FlexRow justifyContent="space-between" style={{ flex: 1 }}>
        <FlexRow style={{ flex: 1 }}>
          <ChatAvatar isActive={isOnline} membersAvatar={[data.avatar ?? ""]} />
          <SpacerRow size={1.5} />
          <View>
            <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
              {data?.name || "Anon"}
            </BrandText>
          </View>
        </FlexRow>

        <FlexRow justifyContent="flex-end" style={{ flex: 1 }}>
          <CustomButton
            title="Add"
            onPress={() => handleAddFriend()}
            size="small"
            width={70}
          />
          <SpacerRow size={1} />

          <CustomButton
            onPress={() => handleCancelFriend()}
            title="Reject"
            type="danger"
            size="small"
            width={70}
            isDisabled={addLoading}
          />
        </FlexRow>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
}

function Friends() {
  const conversations = useSelector(selectConversationList);

  const totalFriends =
    conversations?.filter((conv) => conv.type === "contact") || [];

  console.log(totalFriends);

  if (totalFriends.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <BrandText
          style={[fontMedium16, { textAlign: "center", color: neutral77 }]}
        >
          No Friend yet.
        </BrandText>
      </View>
    );
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={totalFriends}
      renderItem={({ item }) => (
        <FriendItem
          id={item.id}
          name={item.name}
          isOnline={false}
          avatar={undefined}
        />
      )}
      keyExtractor={(item) => item.id}
      style={{}}
    />
  );
}

function FriendItem({
  id,
  name,
  isOnline,
  avatar,
}: {
  id: string;
  name: string;
  isOnline: boolean;
  avatar?: string;
}) {
  const navigation = useAppNavigation();

  return (
    <View>
      <FlexRow justifyContent="space-between" style={{ flex: 1 }}>
        <FlexRow style={{ flex: 1 }}>
          <ChatAvatar isActive={isOnline} membersAvatar={[avatar ?? ""]} />
          <SpacerRow size={1.5} />
          <View>
            <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
              {name || "Anon"}
            </BrandText>
          </View>
        </FlexRow>

        <FlexRow justifyContent="flex-end" style={{ flex: 1 }}>
          <CustomPressable
            onPress={() =>
              navigation.replace("Conversation", { conversationId: id })
            }
          >
            <SVGorImageIcon icon={messageSVG} iconSize={22} />
          </CustomPressable>
        </FlexRow>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
}

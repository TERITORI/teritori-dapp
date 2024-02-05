import React, { Dispatch, SetStateAction, useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar, Badge } from "react-native-paper";
import { useSelector } from "react-redux";

import FriendRequestModal from "./components/FriendRequestModal";
import searchSVG from "../../../../assets/icons/search-gray.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { selectContactRequestList } from "../../../store/slices/message";
import { ScreenFC } from "../../../utils/navigation";
import { neutral22, secondaryColor } from "../../../utils/style/colors";
import { fontMedium14, fontSemibold14 } from "../../../utils/style/fonts";
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
import MiniTextInput from "../components/MiniTextInput";
import MiniToast from "../components/MiniToast";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

export type ToastType = {
  type: "success" | "error" | "";
  message: string;
};

export const MiniFriendScreen: ScreenFC<"MiniFriend"> = ({ navigation }) => {
  const [activeModal, setActiveModal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const contactRequestList = useSelector(selectContactRequestList);
  const [openToast, setOpenToast] = useState<ToastType>({
    type: "",
    message: "",
  });

  console.log(contactRequestList);

  return (
    <BlurScreenContainer
      title="Friend Requests"
      customHeader={
        openToast.type && (
          <MiniToast
            message={openToast.message}
            type={openToast.type ?? "info"}
            onClose={() => setOpenToast({ type: "", message: "" })}
          />
        )
      }
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <MiniTextInput
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon={searchSVG}
          placeholder="Search Friend Requests"
          style={{ paddingVertical: layout.spacing_x1 }}
          inputStyle={[fontMedium14]}
        />
        <SpacerColumn size={2} />

        <View style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={contactRequestList}
            renderItem={({ item }) => (
              <FriendRequest
                data={item}
                name={item.name}
                isOnline={false}
                avatar={undefined}
                setOpenToast={setOpenToast}
              />
            )}
            keyExtractor={(item) => item.id}
            style={{}}
          />
          <CustomButton
            onPress={() => setActiveModal("addFriend")}
            title="Send Friend Request"
          />
        </View>
      </View>

      <FriendRequestModal
        visible={activeModal === "addFriend"}
        onClose={() => setActiveModal("")}
        setOpenToast={setOpenToast}
      />
    </BlurScreenContainer>
  );
};

type Props = {
  name: string;
  isOnline: boolean;
  avatar: any;
  data: ContactRequest;
  setOpenToast: Dispatch<SetStateAction<ToastType>>;
};

function FriendRequest({ isOnline, data, setOpenToast }: Props) {
  const [addLoading, setAddLoading] = useState(false);
  //   console.log(data);

  const onlineStatusBadgeColor = isOnline ? "green" : "yellow";

  const handleAddFriend = async () => {
    setAddLoading(true);
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
    } catch (err) {
      console.error("add friend err", err);
      setOpenToast({ type: "error", message: "Add Friend failed" });
    }
    // setAddLoading(false);
  };

  const handleCancelFriend = async () => {
    try {
      await weshClient.client.ContactRequestDiscard({
        contactPk: bytesFromString(data?.contactId),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setOpenToast({ type: "error", message: "Cancel Friend failed" });
    }
  };

  return (
    <View>
      <FlexRow justifyContent="space-between" style={{ flex: 1 }}>
        <FlexRow style={{ flex: 1 }}>
          <Avatar.Image size={48} source={{ uri: data.avatar }} />
          <Badge
            style={{
              position: "absolute",
              top: 38,
              left: 38,
              backgroundColor: onlineStatusBadgeColor,
            }}
            size={12}
          />
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
            onPress={handleAddFriend}
            size="small"
            width={70}
          />
          <SpacerRow size={1} />

          <CustomButton
            onPress={handleCancelFriend}
            title="Reject"
            type="danger"
            size="small"
            width={70}
          />
        </FlexRow>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
}

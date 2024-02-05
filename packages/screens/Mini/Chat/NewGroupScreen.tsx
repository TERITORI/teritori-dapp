import React, { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import GroupCreateModal from "./components/GroupCreateModal";
import {
  ContactType,
  NewConversationOrGroupSelector,
} from "./components/NewConversationOrGroupSelector";
import searchSVG from "../../../../assets/icons/search-gray.svg";
import { SpacerColumn } from "../../../components/spacer";
import { selectContactRequestList } from "../../../store/slices/message";
import { ScreenFC } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

export const NewGroupScreen: ScreenFC<"MiniNewGroup"> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const contactRequestList = useSelector(selectContactRequestList);
  const [activeGroupModal, setActiveGroupModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<ContactType[]>([]);

  return (
    <BlurScreenContainer title="New group">
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <MiniTextInput
          onChangeText={setSearch}
          value={search}
          icon={searchSVG}
          placeholder="Search by nickname"
          style={{ paddingVertical: layout.spacing_x1 }}
          inputStyle={[fontMedium14]}
          placeholderTextColor={neutralA3}
        />
        <SpacerColumn size={2} />
        <NewConversationOrGroupSelector
          contacts={contactRequestList}
          isGroupSelector
          onPressContact={({ id }) =>
            navigation.replace("Conversation", { conversationId: id })
          }
          onCreateGroup={(selectedContactsGroup) => {
            setActiveGroupModal(true);
            setSelectedContacts(selectedContactsGroup);
          }}
        />
      </View>
      <GroupCreateModal
        visible={activeGroupModal}
        onClose={() => setActiveGroupModal(false)}
        checkedContacts={selectedContacts.map((item) => item.id)}
      />
    </BlurScreenContainer>
  );
};

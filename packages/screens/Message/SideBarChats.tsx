import React from "react";
import { View, Text } from "react-native";

import add from "../../../assets/icons/add-circle-filled.svg";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import Search from "../../../assets/icons/search.svg";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import ConversationData from "../../components/sidebarchat/ConversationData";
import Searchbar from "../../components/sidebarchat/Searchbar";
import SideBarChatConversation from "../../components/sidebarchat/SideBarChatConversation";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
const SideBarChats: React.FC = () => {
  return (
    <View>
      <Searchbar />
      <SpacerColumn size={3} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "#fff" }}>All conversation</Text>
          <SpacerRow size={1} />
          <SVG source={chevronDownSVG} height={20} width={20} color="#fff" />
        </View>
        <View style={{ flexDirection: "row" }}>
          <SVG source={add} height={20} width={20} color="#16BBFF" />
          <SpacerRow size={2} />
          <SVG source={Search} height={20} width={20} color="#fff" />
        </View>
      </View>
      <SpacerColumn size={3} />
      <Separator horizontal={false} />
      {ConversationData.map((item) => (
        <SideBarChatConversation
          avatar={item.avatar}
          name={item.name}
          isOnline={item.isOnline}
          chat={item.chat}
          time={item.time}
        />
      ))}
    </View>
  );
};
export default SideBarChats;

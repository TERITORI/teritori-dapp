import React from "react";
import { View } from "react-native";

import add from "../../../assets/icons/add-circle-filled.svg";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import Search from "../../../assets/icons/search.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import ConversationData from "../../components/sidebarchat/ConversationData";
import Searchbar from "../../components/sidebarchat/Searchbar";
import SideBarChatConversation from "../../components/sidebarchat/SideBarChatConversation";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import {
  primaryColor,
  secondaryColor,
  neutral22,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
const SideBarChats: React.FC = () => {
  return (
    <View>
      <SpacerColumn size={2} />
      <Searchbar />
      <SpacerColumn size={2.5} />
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
              All conversation
            </BrandText>
            <SpacerRow size={0.8} />
            <SVG
              source={chevronDownSVG}
              height={16}
              width={16}
              color={secondaryColor}
            />
          </FlexRow>
        </View>
        <View>
          <FlexRow>
            <SVG source={add} height={16} width={16} color={primaryColor} />
            <SpacerRow size={2} />
            <SVG
              source={Search}
              height={16}
              width={16}
              color={secondaryColor}
            />
          </FlexRow>
        </View>
      </FlexRow>

      <SpacerColumn size={2.5} />

      <Separator horizontal={false} color={neutral22} />

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

import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { MessageAvatar } from "./MessageAvatar";
import chaticon from "../../../../assets/icons/chaticon.svg";
import dots from "../../../../assets/icons/dots.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral22, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { Conversation } from "../../../utils/types/message";
import { getConversationName } from "../../../weshnet/client/messageHelpers";

type FriendListProps = {
  item: Conversation;
  handleChatPress: () => void;
};

const FriendList = ({ item, handleChatPress }: FriendListProps) => {
  return (
    <View>
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <MessageAvatar
              item={item.members?.[0]}
              disableStatus={item.type === "group"}
            />
            <SpacerRow size={1.5} />
            <View>
              <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
                {getConversationName(item)}
              </BrandText>
            </View>
          </FlexRow>
        </View>
        <View>
          <FlexRow>
            <TouchableOpacity onPress={handleChatPress}>
              <SVG source={chaticon} />
            </TouchableOpacity>
            <SpacerRow size={1.5} />
            <TouchableOpacity>
              <SVG source={dots} />
            </TouchableOpacity>
          </FlexRow>
        </View>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
};

export default FriendList;

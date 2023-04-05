import chat from "../../../assets/icons/add-chat.svg";
import friend from "../../../assets/icons/friend.svg";
import group from "../../../assets/icons/group.svg";
import space from "../../../assets/icons/space.svg";
const data = [
  {
    title: "Create a conversation",
    icon: chat,
    onPress: () => console.log("CreateConversationScreen"),
  },
  {
    title: "Create a group",
    icon: group,
    onPress: () => console.log("CreateGroupScreen"),
  },
  {
    title: "Add a friend",
    icon: friend,
  },
  {
    title: "Create a Teritori space",
    icon: space,
    subtitle: "coming soon",
  },
];
export default data;

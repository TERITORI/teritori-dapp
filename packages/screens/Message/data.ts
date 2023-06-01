import chat from "../../../assets/icons/add-chat.svg";
import friend from "../../../assets/icons/friend.svg";
import group from "../../../assets/icons/group.svg";
import space from "../../../assets/icons/space.svg";
const data = [
  {
    id: 1,
    title: "Create a conversation",
    icon: chat,
    onPress: () => console.log("CreateConversationScreen"),
  },
  {
    id: 2,
    title: "Create a group",
    icon: group,
    onPress: () => console.log("CreateGroupScreen"),
  },
  {
    id: 3,
    title: "Add a friend",
    icon: friend,
  },
  {
    id: 4,
    title: "Create a Teritori space",
    icon: space,
    subtitle: "coming soon",
  },
];
export default data;

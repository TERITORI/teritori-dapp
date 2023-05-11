import Doublecheck from "../../../assets/icons/doublecheck.svg";
import singleCheck from "../../../assets/icons/singlecheck.svg";
import warning from "../../../assets/icons/warning.svg";

const ConversationData = [
  {
    name: "Eleanor Pena",
    isOnline: true,
    avatar: require("../../../assets/icons/ava.png"),
    chat: "Hi, I know we haven’t talked …",
    time: "9:30",
    icon: Doublecheck,
  },
  {
    name: "John",
    isOnline: false,
    avatar: require("../../../assets/icons/ava.png"),
    chat: " Hi, I know we haven’tt …",
    time: "9:00",
    icon: warning,
  },
  {
    name: "David",
    isOnline: true,
    avatar: require("../../../assets/icons/ava.png"),
    chat: "Hi, I know we haven’t  …",
    time: "3:30",
    icon: singleCheck,
  },
  {
    name: "William",
    isOnline: false,
    avatar: require("../../../assets/icons/ava.png"),
    chat: "Hi, I know we haven’t talked  …",
    time: "5:00",
    icon: Doublecheck,
  },
  {
    name: "Charles",
    isOnline: false,
    avatar: require("../../../assets/icons/ava.png"),
    chat: "Hi, I know we haven’t talked …",
    time: "4:10",
    icon: warning,
  },
  {
    name: "Robert",
    isOnline: true,
    avatar: require("../../../assets/icons/ava.png"),
    chat: "Hi, I know we haven’t talked  …",
    time: "2:30",
    icon: singleCheck,
  },
];
export default ConversationData;

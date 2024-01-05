import { NotificationType } from "./NotificationList";
import { GradientDirectionEnum } from "./components/GradientBox";
import {
  blueDefault,
  orangeDefault,
  primaryColor,
  purpleDark,
  purpleDefault,
  secondaryColor,
} from "../../../utils/style/colors";

export const notifications: NotificationType[] = [
  {
    notificationId: "1",
    img: {
      url: "https://images.unsplash.com/photo-1591102972305-213abaa76d6f?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    type: "purchase",
    message: "Beyond",
    user: { id: "23", username: "Norman", avatarUrl: "" },
    price: 15000,
    postedAt: "10 min ago",
  },
  {
    notificationId: "2",
    img: {
      url: "https://images.unsplash.com/photo-1601887389937-0b02c26b602c?q=80&w=2523&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    type: "comment",
    message: '"Happy to announce my new..."',
    user: { id: "23", username: "Utopia96", avatarUrl: "" },
    postedAt: "70 min ago",
  },
  {
    notificationId: "3",
    img: {
      url: "https://images.unsplash.com/photo-1630313107085-987b5eb46062?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    type: "collection",
    message: "M E N T A L",
    postedAt: "50 min ago",
  },
  {
    notificationId: "4",
    img: {
      url: "https://images.unsplash.com/photo-1572379371012-9e11bfc61b35?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    type: "tip",
    price: 3000,
    from: "Doubleface",
    for: '"GM Teritori 🖐️"',
    postedAt: "11 min ago",
  },
  {
    notificationId: "5",
    img: { url: "" },
    type: "transfer",
    price: 5000,
    from: "Eagl3",
    postedAt: "22 min ago",
  },
  {
    notificationId: "6",
    img: {
      url: "https://www.haddonstone.com/en-us/wp-content/uploads/sites/14/2019/01/Winter_Statue-HE765-A_0.jpg",
    },
    type: "purchase",
    message: "Beyond",
    user: { id: "23", username: "Norman", avatarUrl: "" },
    price: 15000,
    postedAt: "30 min ago",
  },
  {
    notificationId: "7",
    img: { url: "" },
    type: "comment",
    message: '"Happy to announce my new..."',
    user: { id: "23", username: "Utopia96", avatarUrl: "" },
    postedAt: "10 min ago",
  },
  {
    notificationId: "8",
    img: { url: "" },
    type: "collection",
    message: "M E N T A L",
    postedAt: "40 min ago",
  },
  {
    notificationId: "9",
    img: { url: "" },
    type: "tip",
    price: 3000,
    from: "Doubleface",
    for: '"GM Teritori 🖐️"',
    postedAt: "80 min ago",
  },
  {
    notificationId: "10",
    img: { url: "" },
    type: "transfer",
    price: 5000,
    from: "Eagl3",
    postedAt: "20 min ago",
  },
  {
    notificationId: "11",
    img: { url: "" },
    type: "transfer",
    price: 5000,
    from: "Eagl3",
    postedAt: "4 min ago",
  },
];

export const randomGradients = [
  {
    direction: GradientDirectionEnum.bottomTop,
    colors: [primaryColor, secondaryColor],
  },
  {
    direction: GradientDirectionEnum.topBottom,
    colors: [primaryColor, purpleDefault, purpleDark],
  },
  {
    direction: GradientDirectionEnum.leftDiagnol,
    colors: [primaryColor, blueDefault],
  },
  {
    direction: GradientDirectionEnum.rightDiagnol,
    colors: [blueDefault, orangeDefault],
  },
];

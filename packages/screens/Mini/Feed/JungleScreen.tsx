import { View, FlatList } from "react-native";

import PostCard, { PostType } from "./components/PostCard";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";

const posts: PostType[] = [
  {
    id: "sdfsdf",
    user: { img: "", name: "John Doe", username: "johndoe" },
    postedAt: "6 minutes ago",
    content: [{ type: "text", value: "How are you today?" }],
    comments: 43,
    reaction: false,
    transfer: 3,
  },
  {
    id: "sdfsdfasdfd",
    user: { img: "", name: "John Doe", username: "johndoe" },
    postedAt: "6 minutes ago",
    content: [
      { type: "text", value: { text: "Hey", mentions: ["Teritori"] } },
      {
        type: "img",
        value:
          "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=2811&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    comments: 124,
    reaction: false,
    transfer: 5,
  },
  {
    id: "sdfsdfasdfdasdfa",
    user: { img: "", name: "John Doe", username: "johndoe" },
    postedAt: "6 minutes ago",
    content: [
      { type: "text", value: { text: "GM", mentions: ["Teritori"] } },
      {
        type: "img",
        value:
          "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=2811&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    comments: 43,
    reaction: false,
    transfer: 3,
  },
];

const JungleScreen: ScreenFC<"MiniFeeds"> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <SpacerColumn size={2} />
      <FlatList
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            <SpacerColumn size={index === 0 ? 1 : 2} />
            <PostCard post={item} />
            <SpacerColumn size={2} />
          </>
        )}
      />
    </View>
  );
};

export default JungleScreen;

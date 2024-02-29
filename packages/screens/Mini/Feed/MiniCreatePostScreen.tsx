import { View } from "react-native";

import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { NewsFeedInput } from "@/components/socialFeed/NewsFeed/NewsFeedInput";
import { layout } from "@/utils/style/layout";

export default function MiniCreatePostScreen() {
  return (
    <BlurScreenContainer title="Create Post">
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <NewsFeedInput type="post" />
      </View>
    </BlurScreenContainer>
  );
}

import React from "react";
import { View } from "react-native";

import { FeedMusicList } from "@/components/music/FeedMusicList";

export const MusicFeedScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <FeedMusicList title="All music" allowUpload />
    </View>
  );
};

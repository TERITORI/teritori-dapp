import React from "react";
import { ScrollView } from "react-native";

import { FeedMusicList } from "../../../components/music/FeedMusicList";

export const MusicFeedScreen = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <FeedMusicList title="All music" />
    </ScrollView>
  );
};

import React from "react";
import { View } from "react-native";

import { FeedMusicList } from "@/components/music/FeedMusicList";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";

export const MusicFeedScreen = () => {
  const selectedNetworkId = useSelectedNetworkId();
  return (
    <View style={{ flex: 1 }}>
      <FeedMusicList
        networkId={selectedNetworkId}
        title="All music"
        allowUpload
      />
    </View>
  );
};

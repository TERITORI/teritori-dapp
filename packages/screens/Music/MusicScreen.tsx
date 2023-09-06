import React, { useState, useMemo } from "react";
import { View } from "react-native";

import { MusicHomeContent } from "./components/MusicHomeContent";
import { MusicMyLibraryContent } from "./components/MusicMyLibraryContent";
import { GetAllAlbumListRequest } from "../../api/musicplayer/v1/musicplayer";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useFetchLibraryIds } from "../../hooks/musicplayer/useFetchLibraryIds";
import { ScreenFC } from "../../utils/navigation";
import { MusicTabs } from "../MusicAlbum/components/MusicTabs";

export const MusicScreen: ScreenFC<"Music"> = () => {
  const tabData: string[] = ["Home", "My Library"];
  const [tab, setTab] = useState<string>(tabData[0]);
  const { data } = useFetchLibraryIds();
  const musicRequest: GetAllAlbumListRequest = {
    limit: 10,
    offset: 0,
  };

  const libraryIdList = useMemo(() => (data ? data : []), [data]);

  return (
    <ScreenContainer
      headerChildren={<BrandText>Music Player</BrandText>}
      isLarge
      responsive
    >
      <View
        style={{
          width: "100%",
        }}
      >
        <MusicTabs tab={tab} setTab={setTab} />

        {tab === tabData[0] && (
          <MusicHomeContent req={musicRequest} idList={libraryIdList} />
        )}
        {tab === tabData[1] && <MusicMyLibraryContent idList={libraryIdList} />}
      </View>
    </ScreenContainer>
  );
};

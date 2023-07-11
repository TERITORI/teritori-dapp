import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { MusicPlayerHomeContent } from "./MusicPlayerHomeContent";
import { MusicPlayerMyLibraryContent } from "./MusicPlayerMyLibraryContent";
import { GetAllAlbumListRequest } from "../../api/musicplayer/v1/musicplayer";
import { BrandText } from "../../components/BrandText";
import { MediaPlayer } from "../../components/MusicPlayer/MediaPlayer";
import { MusicPlayerTab } from "../../components/MusicPlayer/MusicPlayerTab";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { ScreenFC } from "../../utils/navigation";
import { neutralA3, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MusicPlayerScreen: ScreenFC<"MusicPlayer"> = () => {
  const tabData: string[] = ["Home", "My Library"];
  const [tab, setTab] = useState<string>(tabData[0]);
  const [idForLibraryList, setIdForLibraryList] = useState<string[]>([]);
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);

  const musicRequest: GetAllAlbumListRequest = {
    limit: 10,
    offset: 0,
  };
  useEffect(() => {
    const getLibraryIdList = async () => {
      if (!userId) return;
      try {
        const res = await mustGetMusicplayerClient(
          selectedNetworkId
        ).GetAlbumIdListForLibrary({
          user: userId,
        });
        const idList: string[] = [];
        res.albumLibraries.map((libraryInfo, index) => {
          idList.push(libraryInfo.identifier);
        });
        setIdForLibraryList(idList);
      } catch (err) {
        console.log(err);
      }
    };
    getLibraryIdList();
  }, [selectedNetworkId, userId]);

  return (
    <ScreenContainer
      headerChildren={<BrandText>Music Player</BrandText>}
      fullWidth
    >
      <View style={styles.pageConatiner}>
        <MusicPlayerTab tab={tab} setTab={setTab} />

        {tab === tabData[0] && (
          <MusicPlayerHomeContent
            req={musicRequest}
            idList={idForLibraryList}
          />
        )}
        {tab === tabData[1] && (
          <MusicPlayerMyLibraryContent idList={idForLibraryList} />
        )}
      </View>

      <MediaPlayer />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  pageConatiner: {
    width: "100%",
    paddingHorizontal: 80,
  },
  tabContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    gap: layout.padding_x3,
  },
  selectedUnitBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1_5,
    paddingVertical: layout.padding_x2_5,
    borderBottomColor: secondaryColor,
    borderBottomWidth: 2,
    paddingRight: 6,
  },
  unselectedUnitBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1_5,
    paddingVertical: layout.padding_x2_5,
    borderBottomColor: secondaryColor,
    borderBottomWidth: 0,
    paddingRight: 6,
  },
  selectedText: StyleSheet.flatten([fontSemibold14]),
  unselectedText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  divideLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 1,
    backgroundColor: neutralA3,
    width: "100%",
  },
});

import React, { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { MusicPlayerHomeContent } from "./MusicPlayerHomeContent";
import { MusicPlayerMyLibraryContent } from "./MusicPlayerMyLibraryContent";
import { MusicPlayerTab } from "./components/MusicPlayerTab";
import { GetAllAlbumListRequest } from "../../api/musicplayer/v1/musicplayer";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useFetchLibraryIds } from "../../hooks/musicplayer/useFetchLibraryIds";
import { ScreenFC } from "../../utils/navigation";
import { neutralA3, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MusicPlayerScreen: ScreenFC<"MusicPlayer"> = () => {
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
      <View style={styles.pageContainer}>
        <MusicPlayerTab tab={tab} setTab={setTab} />

        {tab === tabData[0] && (
          <MusicPlayerHomeContent req={musicRequest} idList={libraryIdList} />
        )}
        {tab === tabData[1] && (
          <MusicPlayerMyLibraryContent idList={libraryIdList} />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    width: "100%",
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

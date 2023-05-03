import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { AlbumShortInfo } from "../../utils/types/music";
import { MusicPlayerCard } from "../MusicPlayer/MusicPlayerCard";

export const UPPAlbums: React.FC<{ userId: string }> = ({ userId }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const [albumList, setAlbumList] = useState<AlbumShortInfo[]>([]);
  useEffect(() => {
    const getAlbumList = async () => {
      const res = await mustGetMusicplayerClient(
        selectedNetworkId
      ).getAlbumList({});
      const newAlbumList: AlbumShortInfo[] = [];
      res.albums.map((albumInfo, index) => {
        newAlbumList.push({
          id: albumInfo.id,
          name: albumInfo.name,
          description: albumInfo.description,
          image: albumInfo.image,
        });
      });
      setAlbumList(newAlbumList);
    };
    getAlbumList();
  }, [selectedNetworkId]);
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {albumList.map((item: AlbumShortInfo, index) => {
        return <MusicPlayerCard item={item} index={index} key={index} />;
      })}
    </View>
  );
};
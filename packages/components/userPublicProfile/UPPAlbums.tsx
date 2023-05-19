import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { AlbumInfo, AlbumMetadataInfo } from "../../utils/types/music";
import { MusicPlayerCard } from "../MusicPlayer/MusicPlayerCard";

export const UPPAlbums: React.FC<{ userId: string }> = ({ userId }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const [albumList, setAlbumList] = useState<AlbumInfo[]>([]);
  useEffect(() => {
    const getAlbumList = async () => {
      try {
        const res = await mustGetMusicplayerClient(
          selectedNetworkId
        ).getAlbumList({});
        const newAlbumList: AlbumInfo[] = [];
        res.musicAlbums.map((albumInfo, index) => {
          const metadata = JSON.parse(albumInfo.metadata) as AlbumMetadataInfo;
          newAlbumList.push({
            id: albumInfo.identifier,
            name: metadata.title,
            description: metadata.description,
            image: metadata.image,
            audios: [],
          });
        });
        setAlbumList(newAlbumList);
      } catch (err) {
        console.log(err);
      }
    };
    getAlbumList();
  }, [selectedNetworkId]);
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {albumList.map((item: AlbumInfo, index) => {
        return <MusicPlayerCard item={item} index={index} key={index} />;
      })}
    </View>
  );
};
import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { AlbumCard } from "../../screens/MusicAlbum/components/AlbumCard";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { AlbumInfo, AlbumMetadataInfo } from "../../utils/types/mediaPlayer";

export const UPPAlbums: React.FC<{ userId: string }> = ({ userId }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const [albumList, setAlbumList] = useState<AlbumInfo[]>([]);
  useEffect(() => {
    const getAlbumList = async () => {
      try {
        const res = await mustGetMusicplayerClient(
          selectedNetworkId
        ).GetAllAlbumList({ offset: 0, limit: 10 });
        const newAlbumList: AlbumInfo[] = [];
        res.musicAlbums.map((albumInfo: any) => {
          const metadata = JSON.parse(albumInfo.metadata) as AlbumMetadataInfo;
          newAlbumList.push({
            id: albumInfo.identifier,
            name: metadata.title,
            description: metadata.description,
            image: metadata.image,
            createdBy: albumInfo.createdBy,
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
        return <AlbumCard album={item} hasLibrary={false} key={index} />;
      })}
    </View>
  );
};
